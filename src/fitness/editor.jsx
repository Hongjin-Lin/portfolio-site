import { useEffect, useMemo, useState } from "react";
import config from "../data/fitness/config.json";
import { MEALS, MEAL_INFO, todayKey } from "./data.js";
import { getDefaultBranch, fetchEntriesRaw, commitFiles, compressImage } from "./github.js";

const TOKEN_KEY = "ft_gh_token";
const TOKEN_URL = "https://github.com/settings/personal-access-tokens/new";

const emptyMeal = () => ({ items: "", kcal: "", protein: "", photos: [] });

function formFromEntry(entry) {
  const meals = {};
  for (const m of MEALS) {
    const src = entry?.meals?.[m] || {};
    meals[m] = {
      items: src.items || "",
      kcal: src.kcal ?? "",
      protein: src.protein ?? "",
      photos: (src.photos || []).map((url) => ({ kind: "existing", url })),
    };
  }
  return {
    weight: entry?.weightKg ?? "",
    workoutTitle: entry?.workout?.title || "",
    workoutDetail: entry?.workout?.detail || "",
    workoutMin: entry?.workout?.durationMin ?? "",
    meals,
    notes: entry?.notes || "",
  };
}

const toNum = (v) => (v === "" || v == null ? null : Number(v) || null);

function buildEntry(date, form) {
  return {
    date,
    weightKg: toNum(form.weight),
    workout: {
      title: form.workoutTitle.trim(),
      detail: form.workoutDetail.trim(),
      durationMin: toNum(form.workoutMin),
    },
    meals: Object.fromEntries(
      MEALS.map((m) => [
        m,
        {
          items: form.meals[m].items.trim(),
          kcal: toNum(form.meals[m].kcal),
          protein: toNum(form.meals[m].protein),
          photos: form.meals[m].photos.map((p) => (p.kind === "existing" ? p.url : p.pendingPath)),
        },
      ]),
    ),
    notes: form.notes.trim(),
  };
}

export function Editor({ open, onClose, entries, lang }) {
  const [date, setDate] = useState(todayKey());
  const [form, setForm] = useState(() => formFromEntry(null));
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || "");
  const [tokenInput, setTokenInput] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [busy, setBusy] = useState(false);

  const byDate = useMemo(() => new Map(entries.map((e) => [e.date, e])), [entries]);

  useEffect(() => {
    if (!open) return;
    setStatus({ state: "idle", message: "" });
    setForm(formFromEntry(byDate.get(date) || null));
  }, [open, date]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return null;

  const set = (path, value) => {
    setForm((prev) => {
      const next = { ...prev, meals: { ...prev.meals } };
      if (path[0] === "meals") {
        const meal = path[1];
        next.meals[meal] = { ...next.meals[meal], [path[2]]: value };
      } else {
        next[path[0]] = value;
      }
      return next;
    });
  };

  const addPhotos = (meal, fileList) => {
    const added = Array.from(fileList || []).map((file) => ({
      kind: "new",
      file,
      preview: URL.createObjectURL(file),
      base64: null,
      pendingPath: "",
    }));
    set("meals", { ...form.meals, [meal]: { ...form.meals[meal], photos: [...form.meals[meal].photos, ...added] } });
  };

  const removePhoto = (meal, index) => {
    const photos = form.meals[meal].photos.filter((_, i) => i !== index);
    set("meals", { ...form.meals, [meal]: { ...form.meals[meal], photos } });
  };

  const saveToken = () => {
    const value = tokenInput.trim();
    if (!value) return;
    localStorage.setItem(TOKEN_KEY, value);
    setToken(value);
    setShowToken(false);
    setTokenInput("");
  };

  const hasAnyData = () => {
    if (form.weight !== "" || form.workoutTitle || form.workoutDetail || form.workoutMin !== "" || form.notes) return true;
    return MEALS.some((m) => {
      const meal = form.meals[m];
      return meal.items || meal.kcal !== "" || meal.protein !== "" || meal.photos.length;
    });
  };

  const save = async () => {
    if (!token) { setShowToken(true); return; }
    if (!hasAnyData()) {
      setStatus({ state: "error", message: lang === "zh" ? "请至少填写一项内容（体重 / 训练 / 任意一餐）。" : "Fill in at least one field first." });
      return;
    }
    setBusy(true);
    try {
      setStatus({ state: "busy", message: lang === "zh" ? "压缩照片中…" : "Compressing photos…" });
      const files = [];
      const photoUrls = {};
      for (const m of MEALS) {
        photoUrls[m] = [];
        const photos = form.meals[m].photos;
        for (let i = 0; i < photos.length; i += 1) {
          const p = photos[i];
          if (p.kind === "existing") {
            photoUrls[m].push(p.url);
            continue;
          }
          const path = `${config.repo.photoDir}/${date}/${m}-${i + 1}.jpg`;
          const base64 = p.base64 || (await compressImage(p.file));
          files.push({ path, base64 });
          photoUrls[m].push(path);
          p.base64 = base64;
          p.pendingPath = path;
        }
      }

      setStatus({ state: "busy", message: lang === "zh" ? "读取远端数据…" : "Fetching remote data…" });
      let remoteEntries = entries;
      try {
        remoteEntries = JSON.parse(await fetchEntriesRaw(token));
        if (!Array.isArray(remoteEntries)) remoteEntries = entries;
      } catch { /* fall back to bundled copy */ }

      setStatus({ state: "busy", message: lang === "zh" ? "提交到 GitHub…" : "Committing to GitHub…" });
      const entry = buildEntry(date, form);
      entry.meals = Object.fromEntries(MEALS.map((m) => [m, { ...entry.meals[m], photos: photoUrls[m] }]));
      const merged = [...remoteEntries.filter((e) => e?.date !== date), entry].sort((a, b) => (a.date < b.date ? -1 : 1));
      files.unshift({
        path: config.repo.dataPath,
        base64: btoa(unescape(encodeURIComponent(`${JSON.stringify(merged, null, 2)}\n`))),
      });
      await commitFiles(token, files, `fitness: log ${date}`);

      setStatus({
        state: "ok",
        message:
          lang === "zh"
            ? "已提交到 GitHub ✓ Vercel 正在部署，约 1–2 分钟后页面生效。"
            : "Committed to GitHub ✓ Vercel is deploying; the page updates in 1–2 minutes.",
      });
    } catch (err) {
      setStatus({ state: "error", message: err.message || String(err) });
    } finally {
      setBusy(false);
    }
  };

  const zh = lang === "zh";
  const labels = {
    title: zh ? "每日打卡" : "Daily check-in",
    date: zh ? "日期" : "Date",
    weight: zh ? "体重（kg）" : "Weight (kg)",
    workout: zh ? "训练内容" : "Workout",
    workoutTitle: zh ? "训练名称（如：胸 + 三头）" : "Workout name",
    workoutDetail: zh ? "细节（组数 × 次数 × 重量…）" : "Details (sets × reps × load…)",
    duration: zh ? "时长（分钟）" : "Duration (min)",
    items: zh ? "吃了什么" : "What I ate",
    kcal: zh ? "卡路里 kcal" : "Calories (kcal)",
    protein: zh ? "蛋白质 g" : "Protein (g)",
    photos: zh ? "照片" : "Photos",
    addPhoto: zh ? "+ 添加照片" : "+ Add photos",
    notes: zh ? "备注" : "Notes",
    save: zh ? "提交打卡" : "Commit check-in",
    saving: zh ? "提交中…" : "Committing…",
    cancel: zh ? "取消" : "Cancel",
    tokenTitle: zh ? "GitHub Token 配置" : "GitHub token setup",
    tokenHelp1: zh ? "首次使用需要一枚 Fine-grained Personal Access Token（仅授权本仓库、Contents 读写权限）。Token 只保存在你自己的浏览器里，不会进入仓库。" : "A fine-grained personal access token scoped to this repo (Contents: read & write) is required. It is stored only in your browser.",
    tokenStep: zh ? ["打开 GitHub Token 创建页（链接如下）", "Repository access 选 “Only select repositories” → portfolio-site", "Permissions → Repository permissions → Contents: Read and write", "Expiration 建议 90 天", "生成后粘贴到下面并保存"] : ["Open the GitHub token page below", "Repository access: “Only select repositories” → portfolio-site", "Permissions → Repository permissions → Contents: Read and write", "Suggested expiration: 90 days", "Paste the token below and save"],
    tokenPlaceholder: zh ? "github_pat_…" : "github_pat_…",
    tokenSave: zh ? "保存 Token" : "Save token",
    replaceHint: zh ? "该日期已有记录，已载入表单，保存后将覆盖更新。" : "An entry for this date already exists; saving will overwrite it.",
  };

  return (
    <div className="ft-modal" role="dialog" aria-modal="true" aria-label={labels.title} onMouseDown={(e) => { if (e.target === e.currentTarget && !busy) onClose(); }}
    >
      <div className="ft-modal-panel">
        <header className="ft-modal-head">
          <h2>{labels.title}</h2>
          <button type="button" className="ft-close" onClick={onClose} disabled={busy} aria-label={labels.cancel}>×</button>
        </header>

        <div className="ft-modal-body">
          <div className="ft-form-row">
            <label>
              <span>{labels.date}</span>
              <input type="date" value={date} max={todayKey()} onChange={(e) => setDate(e.target.value || todayKey())} />
            </label>
            <label>
              <span>{labels.weight}</span>
              <input type="number" step="0.1" inputMode="decimal" value={form.weight} onChange={(e) => set(["weight"], e.target.value)} placeholder="78.4" />
            </label>
          </div>
          {byDate.has(date) && <p className="ft-hint">{labels.replaceHint}</p>}

          <fieldset className="ft-fieldset">
            <legend>{labels.workout}</legend>
            <div className="ft-form-row">
              <label><span>{labels.workoutTitle}</span>
                <input value={form.workoutTitle} onChange={(e) => set(["workoutTitle"], e.target.value)} placeholder={zh ? "腿 + 核心" : "Legs + core"} /></label>
              <label><span>{labels.duration}</span>
                <input type="number" inputMode="numeric" value={form.workoutMin} onChange={(e) => set(["workoutMin"], e.target.value)} placeholder="75" /></label>
            </div>
            <label className="ft-block"><span>{labels.workoutDetail}</span>
              <textarea rows={2} value={form.workoutDetail} onChange={(e) => set(["workoutDetail"], e.target.value)} placeholder={zh ? "深蹲 5×5（100kg）· 罗马尼亚硬拉 4×8" : "Squat 5×5 (100kg) · RDL 4×8"} /></label>
          </fieldset>

          {MEALS.map((m) => (
            <fieldset className="ft-fieldset" key={m}>
              <legend>{MEAL_INFO[m].icon} {MEAL_INFO[m][lang]}</legend>
              <label className="ft-block"><span>{labels.items}</span>
                <input value={form.meals[m].items} onChange={(e) => set(["meals", m, "items"], e.target.value)} placeholder={zh ? "鸡胸肉 150g · 糙米饭 150g" : "Chicken breast 150g · brown rice 150g"} /></label>
              <div className="ft-form-row">
                <label><span>{labels.kcal}</span>
                  <input type="number" inputMode="numeric" value={form.meals[m].kcal} onChange={(e) => set(["meals", m, "kcal"], e.target.value)} placeholder="720" /></label>
                <label><span>{labels.protein}</span>
                  <input type="number" inputMode="numeric" value={form.meals[m].protein} onChange={(e) => set(["meals", m, "protein"], e.target.value)} placeholder="58" /></label>
              </div>
              <div className="ft-photo-block">
                <span>{labels.photos}</span>
                <div className="ft-photo-grid">
                  {form.meals[m].photos.map((p, i) => (
                    <figure key={p.preview || p.url} className="ft-photo">
                      <img src={p.kind === "existing" ? p.url : p.preview} alt={`${MEAL_INFO[m][lang]} ${i + 1}`} />
                      <button type="button" onClick={() => removePhoto(m, i)} aria-label="remove">×</button>
                    </figure>
                  ))}
                  <label className="ft-photo-add">
                    <input type="file" accept="image/*" multiple hidden onChange={(e) => { addPhotos(m, e.target.files); e.target.value = ""; }} />
                    {labels.addPhoto}
                  </label>
                </div>
              </div>
            </fieldset>
          ))}

          <label className="ft-block"><span>{labels.notes}</span>
            <textarea rows={2} value={form.notes} onChange={(e) => set(["notes"], e.target.value)} /></label>
        </div>

        {showToken && (
          <div className="ft-token">
            <h3>{labels.tokenTitle}</h3>
            <p>{labels.tokenHelp1}</p>
            <ol>
              {labels.tokenStep.map((s) => <li key={s}>{s}</li>)}
            </ol>
            <p><a href={TOKEN_URL} target="_blank" rel="noreferrer">{TOKEN_URL}</a></p>
            <div className="ft-token-row">
              <input type="password" value={tokenInput} onChange={(e) => setTokenInput(e.target.value)} placeholder={labels.tokenPlaceholder} autoComplete="off" />
              <button type="button" className="ft-btn" onClick={saveToken} disabled={!tokenInput.trim()}>{labels.tokenSave}</button>
            </div>
            {token && <p className="ft-hint">{zh ? "已保存 Token，可关闭此面板。" : "Token saved."}</p>}
          </div>
        )}

        {status.state !== "idle" && (
          <p className={`ft-status ft-status--${status.state}`} role="status">
            {status.state === "busy" ? "⏳ " : status.state === "ok" ? "✅ " : "⚠️ "}
            {status.message}
          </p>
        )}

        <footer className="ft-modal-foot">
          <button type="button" className="ft-btn ft-btn--ghost" onClick={onClose} disabled={busy}>{labels.cancel}</button>
          <button type="button" className="ft-btn" onClick={() => setShowToken((v) => !v)} disabled={busy}>
            {token ? (zh ? "Token 设置" : "Token settings") : (zh ? "配置 Token" : "Set up token")}
          </button>
          <button type="button" className="ft-btn ft-btn--primary" onClick={save} disabled={busy}>
            {busy ? labels.saving : labels.save}
          </button>
        </footer>
      </div>
    </div>
  );
}
