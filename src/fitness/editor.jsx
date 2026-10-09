import { useEffect, useMemo, useState } from "react";
import config from "../data/fitness/config.json";
import { MEALS, MEAL_INFO, todayKey } from "./data.js";
import { getDefaultBranch, fetchEntriesRaw, commitFiles, compressImage } from "./github.js";

const TOKEN_KEY = "ft_gh_token";
const TOKEN_URL = "https://github.com/settings/personal-access-tokens/new";

const toNum = (v) => (v === "" || v == null ? null : Number(v) || null);
const emptySlot = (type) => ({ type, items: "", kcal: "", protein: "", photos: [] });
const emptyWorkout = () => ({ title: "", detail: "", durationMin: "" });

function storedMeals(entry) {
  const m = entry?.meals;
  if (Array.isArray(m)) {
    return m.filter(Boolean).map((x) => ({
      type: MEAL_INFO[x?.type] ? x.type : "snack",
      items: x?.items || "",
      kcal: x?.kcal ?? "",
      protein: x?.protein ?? "",
      photos: (x?.photos || []).map((url) => ({ kind: "existing", url })),
    }));
  }
  if (m && typeof m === "object") {
    return MEALS.filter((k) => m[k]).map((k) => ({
      type: k,
      items: m[k].items || "",
      kcal: m[k].kcal ?? "",
      protein: m[k].protein ?? "",
      photos: (m[k].photos || []).map((url) => ({ kind: "existing", url })),
    }));
  }
  return [];
}

function storedWorkouts(entry) {
  const list = Array.isArray(entry?.workouts)
    ? entry.workouts
    : entry?.workout && (entry.workout.title || entry.workout.detail || entry.workout.durationMin != null)
      ? [entry.workout]
      : [];
  return list.map((w) => ({ title: w?.title || "", detail: w?.detail || "", durationMin: w?.durationMin ?? "" }));
}

/** Always expose the three standard meal slots first, then any extra snacks. */
function formFromEntry(entry) {
  const stored = storedMeals(entry);
  const meals = MEALS.map((type) => {
    const found = stored.find((m) => m.type === type);
    return found || emptySlot(type);
  });
  for (const m of stored) {
    if (!MEALS.includes(m.type)) meals.push(m);
  }
  const workouts = storedWorkouts(entry);
  return { weight: entry?.weightKg ?? "", workouts: workouts.length ? workouts : [emptyWorkout()], meals, notes: entry?.notes || "" };
}

function buildEntry(date, form, photoUrls) {
  return {
    date,
    weightKg: toNum(form.weight),
    workouts: form.workouts
      .map((w) => ({ title: w.title.trim(), detail: w.detail.trim(), durationMin: toNum(w.durationMin) }))
      .filter((w) => w.title || w.detail || w.durationMin != null),
    meals: form.meals.map((m, i) => ({
      type: m.type,
      items: m.items.trim(),
      kcal: toNum(m.kcal),
      protein: toNum(m.protein),
      photos: photoUrls[i] || [],
    })),
    notes: form.notes.trim(),
  };
}

export function Editor({ open, onClose, entries, lang, date, onDateChange }) {
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

  const zh = lang === "zh";

  const setMeal = (idx, key, value) =>
    setForm((prev) => ({ ...prev, meals: prev.meals.map((m, i) => (i === idx ? { ...m, [key]: value } : m)) }));
  const setWorkout = (idx, key, value) =>
    setForm((prev) => ({ ...prev, workouts: prev.workouts.map((w, i) => (i === idx ? { ...w, [key]: value } : w)) }));

  const addSnack = () => setForm((prev) => ({ ...prev, meals: [...prev.meals, emptySlot("snack")] }));
  const removeMeal = (idx) =>
    setForm((prev) => ({ ...prev, meals: prev.meals.filter((_, i) => i !== idx) }));
  const addWorkout = () => setForm((prev) => ({ ...prev, workouts: [...prev.workouts, emptyWorkout()] }));
  const removeWorkout = (idx) =>
    setForm((prev) => ({ ...prev, workouts: prev.workouts.filter((_, i) => i !== idx) }));

  const addPhotos = (idx, fileList) =>
    setForm((prev) => ({
      ...prev,
      meals: prev.meals.map((m, i) =>
        i === idx
          ? {
              ...m,
              photos: [
                ...m.photos,
                ...Array.from(fileList || []).map((file) => ({
                  kind: "new",
                  file,
                  preview: URL.createObjectURL(file),
                  base64: null,
                })),
              ],
            }
          : m,
      ),
    }));

  const removePhoto = (idx, pi) =>
    setForm((prev) => ({
      ...prev,
      meals: prev.meals.map((m, i) => (i === idx ? { ...m, photos: m.photos.filter((_, j) => j !== pi) } : m)),
    }));

  const saveToken = () => {
    const value = tokenInput.trim();
    if (!value) return;
    localStorage.setItem(TOKEN_KEY, value);
    setToken(value);
    setShowToken(false);
    setTokenInput("");
  };

  const hasAnyData = () => {
    if (form.weight !== "" || form.notes) return true;
    if (form.workouts.some((w) => w.title || w.detail || w.durationMin !== "")) return true;
    return form.meals.some((m) => m.items || m.kcal !== "" || m.protein !== "" || m.photos.length);
  };

  const save = async () => {
    if (!token) { setShowToken(true); return; }
    if (!hasAnyData()) {
      setStatus({ state: "error", message: zh ? "请至少填写一项内容（体重 / 训练 / 任意一餐）。" : "Fill in at least one field first." });
      return;
    }
    setBusy(true);
    try {
      setStatus({ state: "busy", message: zh ? "压缩照片中…" : "Compressing photos…" });
      const files = [];
      const photoUrls = {};
      form.meals.forEach((m, idx) => {
        photoUrls[idx] = [];
        m.photos.forEach((p, pi) => {
          if (p.kind === "existing") {
            photoUrls[idx].push(p.url);
            return;
          }
          const path = `${config.repo.photoDir}/${date}/${m.type}-${idx + 1}-${pi + 1}.jpg`;
          files.push({ path, base64: null, file: p.file, name: path });
          photoUrls[idx].push(path);
          p.pendingPath = path;
        });
      });
      for (const f of files) {
        if (f.file) f.base64 = await compressImage(f.file);
      }

      setStatus({ state: "busy", message: zh ? "读取远端数据…" : "Fetching remote data…" });
      let remoteEntries = entries;
      try {
        remoteEntries = JSON.parse(await fetchEntriesRaw(token));
        if (!Array.isArray(remoteEntries)) remoteEntries = entries;
      } catch { /* fall back to bundled copy */ }

      setStatus({ state: "busy", message: zh ? "提交到 GitHub…" : "Committing to GitHub…" });
      const entry = buildEntry(date, form, photoUrls);
      const merged = [...remoteEntries.filter((e) => e?.date !== date), entry].sort((a, b) => (a.date < b.date ? -1 : 1));
      files.unshift({
        path: config.repo.dataPath,
        base64: btoa(unescape(encodeURIComponent(`${JSON.stringify(merged, null, 2)}\n`))),
      });
      await commitFiles(token, files.filter((f) => f.base64 != null), `fitness: log ${date}`);

      setStatus({
        state: "ok",
        message: zh
          ? "已提交到 GitHub ✓ Vercel 正在部署，约 1–2 分钟后页面生效。"
          : "Committed to GitHub ✓ Vercel is deploying; the page updates in 1–2 minutes.",
      });
    } catch (err) {
      setStatus({ state: "error", message: err.message || String(err) });
    } finally {
      setBusy(false);
    }
  };

  const labels = {
    title: zh ? "每日打卡" : "Daily check-in",
    date: zh ? "日期" : "Date",
    weight: zh ? "体重（kg）" : "Weight (kg)",
    workout: zh ? "训练" : "Workout",
    workoutTitle: zh ? "训练名称" : "Workout name",
    workoutDetail: zh ? "细节（组数 × 次数 × 重量…）" : "Details (sets × reps × load…)",
    duration: zh ? "时长（分钟）" : "Duration (min)",
    items: zh ? "吃了什么" : "What I ate",
    kcal: zh ? "卡路里 kcal" : "Calories (kcal)",
    protein: zh ? "蛋白质 g" : "Protein (g)",
    photos: zh ? "照片" : "Photos",
    addPhoto: zh ? "+ 照片" : "+ Photos",
    addSnack: zh ? "添加加餐" : "Add snack",
    addWorkout: zh ? "添加训练" : "Add workout",
    remove: zh ? "删除" : "Remove",
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

  const mealFieldset = (m, idx, removable, count) => (
    <fieldset className="ft-fieldset" key={`${m.type}-${idx}`}>
      <legend>{MEAL_INFO[m.type].icon} {MEAL_INFO[m.type][lang]}{removable ? ` ${count}` : ""}</legend>
      {removable && (
        <button type="button" className="ft-remove" onClick={() => removeMeal(idx)} disabled={busy} aria-label={labels.remove}>×</button>
      )}
      <label className="ft-block"><span>{labels.items}</span>
        <input value={m.items} onChange={(e) => setMeal(idx, "items", e.target.value)} placeholder={zh ? "鸡胸肉 150g · 糙米饭 150g" : "Chicken breast 150g · brown rice 150g"} /></label>
      <div className="ft-form-row">
        <label><span>{labels.kcal}</span>
          <input type="number" inputMode="numeric" value={m.kcal} onChange={(e) => setMeal(idx, "kcal", e.target.value)} placeholder="720" /></label>
        <label><span>{labels.protein}</span>
          <input type="number" inputMode="numeric" value={m.protein} onChange={(e) => setMeal(idx, "protein", e.target.value)} placeholder="58" /></label>
      </div>
      <div className="ft-photo-block">
        <span>{labels.photos}</span>
        <div className="ft-photo-grid">
          {m.photos.map((p, pi) => (
            <figure key={p.preview || p.url} className="ft-photo">
              <img src={p.kind === "existing" ? p.url : p.preview} alt={`${MEAL_INFO[m.type][lang]} ${pi + 1}`} />
              <button type="button" onClick={() => removePhoto(idx, pi)} disabled={busy} aria-label="remove">×</button>
            </figure>
          ))}
          <label className="ft-photo-add">
            <input type="file" accept="image/*" multiple hidden onChange={(e) => { addPhotos(idx, e.target.files); e.target.value = ""; }} />
            {labels.addPhoto}
          </label>
        </div>
      </div>
    </fieldset>
  );

  let snackCount = 0;

  return (
    <div className="ft-modal" role="dialog" aria-modal="true" aria-label={labels.title} onMouseDown={(e) => { if (e.target === e.currentTarget && !busy) onClose(); }}>
      <div className="ft-modal-panel">
        <header className="ft-modal-head">
          <h2>{labels.title}</h2>
          <button type="button" className="ft-close" onClick={onClose} disabled={busy} aria-label={labels.cancel}>×</button>
        </header>

        <div className="ft-modal-body">
          <div className="ft-form-row">
            <label>
              <span>{labels.date}</span>
              <input type="date" value={date} max={todayKey()} onChange={(e) => onDateChange(e.target.value || todayKey())} />
            </label>
            <label>
              <span>{labels.weight}</span>
              <input type="number" step="0.1" inputMode="decimal" value={form.weight} onChange={(e) => setForm((prev) => ({ ...prev, weight: e.target.value }))} placeholder="78.4" />
            </label>
          </div>
          {byDate.has(date) && <p className="ft-hint">{labels.replaceHint}</p>}

          <fieldset className="ft-fieldset">
            <legend>{labels.workout}</legend>
            {form.workouts.map((w, i) => (
              <div className="ft-subblock" key={i}>
                <div className="ft-subblock-head">
                  <span>{zh ? `训练 ${i + 1}` : `Workout ${i + 1}`}</span>
                  {form.workouts.length > 1 && (
                    <button type="button" className="ft-remove" onClick={() => removeWorkout(i)} disabled={busy} aria-label={labels.remove}>×</button>
                  )}
                </div>
                <div className="ft-form-row">
                  <label><span>{labels.workoutTitle}</span>
                    <input value={w.title} onChange={(e) => setWorkout(i, "title", e.target.value)} placeholder={zh ? "腿 + 核心" : "Legs + core"} /></label>
                  <label><span>{labels.duration}</span>
                    <input type="number" inputMode="numeric" value={w.durationMin} onChange={(e) => setWorkout(i, "durationMin", e.target.value)} placeholder="75" /></label>
                </div>
                <label className="ft-block"><span>{labels.workoutDetail}</span>
                  <textarea rows={2} value={w.detail} onChange={(e) => setWorkout(i, "detail", e.target.value)} placeholder={zh ? "深蹲 5×5（100kg）· 罗马尼亚硬拉 4×8" : "Squat 5×5 (100kg) · RDL 4×8"} /></label>
              </div>
            ))}
            <button type="button" className="ft-add" onClick={addWorkout} disabled={busy}>＋ {labels.addWorkout}</button>
          </fieldset>

          {form.meals.map((m, idx) => {
            if (MEALS.includes(m.type)) return mealFieldset(m, idx, false);
            snackCount += 1;
            return mealFieldset(m, idx, true, snackCount);
          })}
          <button type="button" className="ft-add" onClick={addSnack} disabled={busy}>＋ {labels.addSnack}</button>

          <label className="ft-block"><span>{labels.notes}</span>
            <textarea rows={2} value={form.notes} onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))} /></label>
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
