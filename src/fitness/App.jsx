import { useEffect, useMemo, useRef, useState } from "react";
import { GithubLogoIcon as GithubLogo } from "@phosphor-icons/react/dist/csr/GithubLogo";
import { LinkedinLogoIcon as LinkedinLogo } from "@phosphor-icons/react/dist/csr/LinkedinLogo";
import { EnvelopeSimpleIcon as EnvelopeSimple } from "@phosphor-icons/react/dist/csr/EnvelopeSimple";
import { MoonIcon as Moon } from "@phosphor-icons/react/dist/csr/Moon";
import { SunIcon as Sun } from "@phosphor-icons/react/dist/csr/Sun";
import config from "../data/fitness/config.json";
import rawEntries from "../data/fitness/entries.json";
import * as lib from "./data.js";
import { Editor } from "./editor.jsx";

const LANG_KEY = "ft_lang";
const ACCENTS = ["#b12d6c", "#2456c8", "#2e7d46", "#c26a1f", "#7a4fc9", "#1f7a78"];
const ACCENT_NAMES = ["Rose", "Blue", "Green", "Amber", "Violet", "Teal"];

function FitnessBrand() {
  return <a className="tn-brand tn-brand--root" href="/" aria-label="root/ home">
    <span className="tn-brand-mascot" aria-hidden="true"><img className="tn-brand-avatar" src="/icons/focus-reader.png" alt="" /><span className="tn-image-tint tn-image-tint--mascot" /></span>
    <span className="tn-brand-lockup"><span className="tn-brand-wordmark">root<span className="tn-brand-slash">/</span></span></span>
  </a>;
}

function FitnessNavIcon({ type }) {
  if (type === "about") return <img className="tn-nav-icon tn-nav-icon--nalong" src="/icons/nalong-thinking.png" alt="" aria-hidden="true" />;
  const props = { className: "tn-nav-icon", viewBox: "0 0 28 28", fill: "none", stroke: "currentColor", strokeWidth: 1.6, strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": true };
  if (type === "projects") return <svg {...props}><rect x="3.5" y="4" width="21" height="20" rx="2" fill="#e8e4f2"/><path d="M4 9h20M8 13l-2 2 2 2m4-4-2 2 2 2m3 1 4-6" stroke="#547d94"/></svg>;
  if (type === "fitness") return <svg {...props}><path d="M5 10v8m3-10v12m12-12v12m3-10v8M8 14h12" stroke="#c26a1f"/><path d="M5 10v8m3-10v12m12-12v12m3-10v8" stroke="#1f7a78"/></svg>;
  return <svg {...props}><path d="M7 3.8h9l5 5v15H7z" fill="#f6e6b8"/><path d="M16 4v5h5m-11 4h8m-8 4h8m-8 4h6" stroke="#c26a1f"/></svg>;
}

const T = {
  zh: {
    intro: "你好，我是泓进，后端与机器学习工程师、开源创作者。这里是我的数字花园。🌱",
    projects: "项目", fitness: "健身打卡", about: "关于我", resume: "简历",
    eyebrow: "Fitness Tracker",
    title: "62 天饮食与训练挑战",
    subtitle: (c) => `每日三餐与加餐（照片 · 卡路里 · 蛋白质）、体重与训练记录。目标：每天 ${c.calorieTarget} kcal，蛋白质 ${c.proteinMin}–${c.proteinMax} g。`,
    backHome: "返回首页",
    calendarTitle: "打卡日历",
    timelineTitle: "每日记录",
    stats: {
      day: "打卡进度", logged: "已记录", streak: "连续打卡",
      weight: "最新体重", kcal7: "近 7 日均卡路里", protein7: "近 7 日均蛋白质",
      steps7: "近 7 日均步数", stepsUnit: "步",
    },
    legend: { full: "完整打卡", partial: "部分记录", missed: "未打卡", future: "未来" },
    clickHint: "点击日期查看当日记录；空白日期点击直接补录",
    dayN: (n) => `Day ${n}`,
    workout: "训练", min: "分钟", weightLabel: "体重", stepsLabel: "步数", today: "今天",
    emptyTitle: "等待第一条打卡",
    emptyBody: "点击左侧日历上的任意日期，或页面底部的「打卡 / 编辑」，上传当天的饮食与训练；下面的示例卡片展示了每天记录的完整样子。",
    demoBadge: "示例", edit: "打卡 / 编辑", editDay: "编辑", comments: "评论",
    deployNote: "数据提交至 GitHub，由 Vercel 自动部署",
    noWeight: "未记录", lightboxClose: "关闭大图",
  },
  en: {
    intro: "I am Hongjin, an incoming MSc Computer Science & Engineering student at the Technical University of Denmark 📖.",
    projects: "Projects", fitness: "Fitness", about: "About me", resume: "Resume",
    eyebrow: "Fitness Tracker",
    title: "62 Days of Diet & Training",
    subtitle: (c) => `Daily meals & snacks (photos · calories · protein), weight, and workouts. Target: ${c.calorieTarget} kcal and ${c.proteinMin}–${c.proteinMax} g protein per day.`,
    backHome: "Back home",
    calendarTitle: "Calendar",
    timelineTitle: "Daily log",
    stats: {
      day: "Progress", logged: "logged", streak: "Streak",
      weight: "Latest weight", kcal7: "Avg calories (7d)", protein7: "Avg protein (7d)",
      steps7: "Avg steps (7d)", stepsUnit: "steps",
    },
    legend: { full: "Complete", partial: "Partial", missed: "Missed", future: "Upcoming" },
    clickHint: "Click a date to view its log; click an empty day to fill it in",
    dayN: (n) => `Day ${n}`,
    workout: "Workout", min: "min", weightLabel: "Weight", stepsLabel: "Steps", today: "Today",
    emptyTitle: "Waiting for the first check-in",
    emptyBody: "Click any date in the calendar, or “Check-in / Edit” at the bottom, to log a day. The demo card below shows what a logged day looks like.",
    demoBadge: "Demo", edit: "Check-in / Edit", editDay: "Edit", comments: "Comments",
    deployNote: "Committed via GitHub · auto-deployed by Vercel",
    noWeight: "—", lightboxClose: "Close",
  },
};

function Sparkline({ series }) {
  if (series.length < 2) return null;
  const values = series.map((p) => p.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = series
    .map((p, i) => `${(i / (series.length - 1)) * 100},${28 - ((p.value - min) / span) * 24 - 2}`)
    .join(" ");
  return (
    <svg className="ft-spark" viewBox="0 0 100 30" preserveAspectRatio="none" aria-hidden="true">
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

const DOW = {
  zh: ["一", "二", "三", "四", "五", "六", "日"],
  en: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
};

function Calendar({ all, start, keys, lang, t, onSelect }) {
  const map = useMemo(() => new Map(lib.realEntries(all).map((e) => [e.date, e])), [all]);
  const today = lib.todayKey();
  const weeks = [];
  for (let i = 0; i < keys.length; i += 7) weeks.push(keys.slice(i, i + 7));
  let lastMonth = "";
  return (
    <div className="ft-calendar">
      <p className="ft-cal-hint">{t.clickHint}</p>
      <div className="ft-cal-grid ft-cal-grid--head">
        {DOW[lang].map((d) => <span key={d} className="ft-cal-dow">{d}</span>)}
      </div>
      {weeks.map((week) => {
        const first = lib.parseKey(week[0]);
        const monthLabel = lang === "zh"
          ? `${first.getMonth() + 1} 月`
          : first.toLocaleDateString("en-US", { month: "short" });
        const showMonth = monthLabel !== lastMonth;
        lastMonth = monthLabel;
        return (
          <div key={week[0]} className="ft-cal-week-wrap">
            {showMonth && <div className="ft-cal-month">{monthLabel}</div>}
            <div className="ft-cal-grid">
              {week.map((k) => {
                const entry = map.get(k);
                const isFuture = k > today;
                const complete = entry && lib.dayComplete(entry);
                const actionable = Boolean(entry) || !isFuture;
                const cls = [
                  "ft-cell",
                  entry ? (complete ? "is-full" : "is-partial") : isFuture ? "is-future" : "is-missed",
                  k === today ? "is-today" : "",
                  actionable ? "is-selectable" : "",
                ].filter(Boolean).join(" ");
                const totals = entry ? lib.dayTotals(entry) : null;
                const title = entry
                  ? `${k} · ${totals.kcal} kcal · ${totals.protein}g`
                  : isFuture
                    ? k
                    : `${k} · ${lang === "zh" ? "点击补录" : "click to log"}`;
                return (
                  <button
                    key={k}
                    type="button"
                    className={cls}
                    title={title}
                    onClick={() => actionable && onSelect(k, entry)}
                  >
                    {lib.parseKey(k).getDate()}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
      <div className="ft-legend">
        {[["is-full", t.legend.full], ["is-partial", t.legend.partial], ["is-missed", t.legend.missed], ["is-future", t.legend.future]].map(([c, label]) => (
          <span key={c}><i className={`ft-cell ${c}`} aria-hidden="true" /> {label}</span>
        ))}
      </div>
    </div>
  );
}

function Comments({ date, lang }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || el.childElementCount > 0) return undefined;
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.async = true;
    script.crossOrigin = "anonymous";
    const attrs = {
      "data-repo": config.giscus.repo,
      "data-repo-id": config.giscus.repoId,
      "data-category": config.giscus.category,
      "data-category-id": config.giscus.categoryId,
      "data-mapping": "specific",
      "data-term": `fitness-${date}`,
      "data-strict": "1",
      "data-reactions-enabled": "1",
      "data-emit-metadata": "0",
      "data-input-position": "top",
      "data-theme": "light",
      "data-lang": lang === "zh" ? "zh-CN" : "en",
      "data-loading": "lazy",
    };
    Object.entries(attrs).forEach(([k, v]) => script.setAttribute(k, v));
    el.appendChild(script);
    return () => {
      el.textContent = "";
    };
  }, [date, lang]);
  return <div className="ft-comments" ref={ref} />;
}

function DayCard({ entry, start, lang, t, onZoom, onEdit, selected = false, hideDayNumber = false }) {
  const [showComments, setShowComments] = useState(false);
  const totals = lib.dayTotals(entry);
  const n = lib.dayNumber(entry.date, start);
  const d = lib.parseKey(entry.date);
  const weekday = new Intl.DateTimeFormat(lang === "zh" ? "zh-CN" : "en-US", { weekday: "long" }).format(d);
  const dateLabel = lang === "zh"
    ? `${d.getMonth() + 1} 月 ${d.getDate()} 日`
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const zh = lang === "zh";
  const kcalPct = Math.min(100, (totals.kcal / config.calorieTarget) * 100);
  const proteinPct = Math.min(100, (totals.protein / config.proteinMax) * 100);
  const bandLeft = (config.proteinMin / config.proteinMax) * 100;
  const meals = lib.getMeals(entry);
  const workouts = lib.getWorkouts(entry);

  return (
    <article className={`ft-day${selected ? " is-selected" : ""}`} id={`ft-day-${entry.date}`}>
      <header className="ft-day-head">
        <div className="ft-day-date">
          <strong>{dateLabel}</strong>
          <span>{weekday}</span>
        </div>
        {!hideDayNumber && <span className="ft-chip ft-chip--day">{t.dayN(n)}</span>}
        {entry.date === lib.todayKey() && <span className="ft-chip ft-chip--today">{t.today}</span>}
        <span className="ft-chip ft-chip--weight">
          {t.weightLabel} {entry.weightKg != null ? `${entry.weightKg} kg` : t.noWeight}
        </span>
        {entry.steps != null && (
          <span className="ft-chip ft-chip--steps">
            {t.stepsLabel} {Number(entry.steps).toLocaleString(zh ? "zh-CN" : "en-US")}
          </span>
        )}
        <span className="ft-chip">
          {totals.kcal || "—"} kcal · {totals.protein || "—"}g {zh ? "蛋白质" : "protein"}
        </span>
        {onEdit && (
          <button type="button" className="ft-edit-btn" onClick={() => onEdit(entry.date)}>
            ✎ {t.editDay}
          </button>
        )}
      </header>

      <div className="ft-day-body">
        <aside className="ft-workouts">
          {workouts.length ? workouts.map((w, i) => (
            <section className="ft-workout" key={`${w.title}-${i}`}>
              <h3>{t.workout}{workouts.length > 1 ? ` ${i + 1}` : ""}</h3>
              {w.title && (
                <p className="ft-workout-title">
                  {w.title}
                  {w.durationMin ? <em> · {w.durationMin} {t.min}</em> : null}
                </p>
              )}
              {w.detail && <p className="ft-workout-detail">{w.detail}</p>}
              {!w.title && !w.detail && <p className="ft-muted">—</p>}
            </section>
          )) : (
            <section className="ft-workout">
              <h3>{t.workout}</h3>
              <p className="ft-muted">—</p>
            </section>
          )}
        </aside>

        <div className="ft-meals">
          {meals.map((m, i) => (
            <section className={`ft-meal ft-meal--${m.type}`} key={`${m.type}-${i}`}>
              <h4>{lib.MEAL_INFO[m.type]?.icon} {lib.MEAL_INFO[m.type]?.[lang] || m.type}</h4>
              {m.items && <p className="ft-meal-items">{m.items}</p>}
              <p className="ft-meal-numbers">
                <strong>{m.kcal != null ? m.kcal : "—"}</strong> kcal
                <i aria-hidden="true" />
                <strong>{m.protein != null ? m.protein : "—"}</strong> g {zh ? "蛋白质" : "protein"}
              </p>
              {m.photos?.length > 0 && (
                <div className="ft-thumbs">
                  {m.photos.map((src) => (
                    <button key={src} type="button" className="ft-thumb" onClick={() => onZoom(src)}>
                      <img src={src} alt={`${lib.MEAL_INFO[m.type]?.[lang] || m.type} · ${entry.date}`} loading="lazy" />
                    </button>
                  ))}
                </div>
              )}
            </section>
          ))}
        </div>
      </div>

      <div className="ft-bars">
        <div className="ft-bar-row">
          <span>kcal</span>
          <div className="ft-bar"><i style={{ width: `${kcalPct}%` }} /></div>
          <small>{totals.kcal || 0} / {config.calorieTarget}</small>
        </div>
        <div className="ft-bar-row">
          <span>{zh ? "蛋白质" : "Protein"}</span>
          <div className="ft-bar ft-bar--protein">
            <span className="ft-band" style={{ left: `${bandLeft}%` }} aria-hidden="true" />
            <i style={{ width: `${proteinPct}%` }} />
          </div>
          <small>{totals.protein || 0} / {config.proteinMin}–{config.proteinMax} g</small>
        </div>
      </div>

      {entry.notes && <p className="ft-notes">{entry.notes}</p>}

      <div className="ft-day-actions">
        <button type="button" className="ft-comments-toggle" onClick={() => setShowComments((v) => !v)}>
          💬 {t.comments}{showComments ? " ▲" : " ▼"}
        </button>
      </div>
      {showComments && <Comments date={entry.date} lang={lang} />}
    </article>
  );
}

function StatsRow({ stats, start, config, t, lang }) {
  const s = t.stats;
  const dayNum = Math.min(Math.max(lib.dayNumber(lib.todayKey(), start), 0), config.durationDays);
  const cards = [
    { label: s.day, value: `Day ${dayNum}`, unit: `${config.durationDays}`, sub: `${s.logged} ${stats.logged}` },
    { label: s.streak, value: stats.streak, unit: t.min === "分钟" ? "天" : "days" },
    {
      label: s.weight,
      value: stats.weightLast != null ? stats.weightLast : "—",
      sub: stats.delta != null ? `${stats.delta > 0 ? "+" : ""}${stats.delta} kg` : "—",
      spark: stats.series,
    },
    { label: s.kcal7, value: stats.kcal7 ?? "—", unit: `/ ${config.calorieTarget} kcal` },
    { label: s.protein7, value: stats.protein7 ?? "—", unit: `/ ${config.proteinMin}–${config.proteinMax} g` },
    {
      label: s.steps7,
      value: stats.steps7 != null ? Number(stats.steps7).toLocaleString(lang === "zh" ? "zh-CN" : "en-US") : "—",
      sub: stats.stepsLast != null
        ? `${lang === "zh" ? "最新" : "latest"} ${Number(stats.stepsLast).toLocaleString(lang === "zh" ? "zh-CN" : "en-US")} ${s.stepsUnit}`
        : undefined,
    },
  ];
  return (
    <section className="ft-stats">
      {cards.map((c) => (
        <div className="ft-stat" key={c.label}>
          <p className="ft-stat-label">{c.label}</p>
          <p className="ft-stat-value">
            {c.value}
            {c.unit && <small> {c.unit}</small>}
          </p>
          {c.spark ? <Sparkline series={c.spark} /> : c.sub ? <p className="ft-stat-sub">{c.sub}</p> : null}
        </div>
      ))}
    </section>
  );
}

export function App() {
  const [lang, setLang] = useState(() => localStorage.getItem(LANG_KEY) || "zh");
  const [editorOpen, setEditorOpen] = useState(() => new URLSearchParams(window.location.search).get("edit") === "1");
  const [editorDate, setEditorDate] = useState(lib.todayKey());
  const [selected, setSelected] = useState(null);
  const [zoom, setZoom] = useState(null);
  const [accent, setAccent] = useState(() => localStorage.getItem("tn-accent") || ACCENTS[0]);
  const [dark, setDark] = useState(() => localStorage.getItem("tn-dark") === "1");
  const [themeOpen, setThemeOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [emailCopyState, setEmailCopyState] = useState("idle");
  const selectTimer = useRef(null);
  const t = T[lang];

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem("tn-accent", accent);
    document.documentElement.style.setProperty("--tn-accent", accent);
  }, [accent]);

  useEffect(() => {
    localStorage.setItem("tn-dark", dark ? "1" : "0");
    if (dark) document.documentElement.dataset.tnDark = "1";
    else delete document.documentElement.dataset.tnDark;
  }, [dark]);

  useEffect(() => {
    if (!themeOpen) return undefined;
    const outside = (event) => { if (!event.target.closest(".tn-theme-actions, .tn-mobile-actions")) setThemeOpen(false); };
    const escape = (event) => { if (event.key === "Escape") setThemeOpen(false); };
    document.addEventListener("pointerdown", outside);
    window.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("pointerdown", outside);
      window.removeEventListener("keydown", escape);
    };
  }, [themeOpen]);

  useEffect(() => () => clearTimeout(selectTimer.current), []);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText("hongjin1125@outlook.com");
      setEmailCopyState("copied");
    } catch {
      setEmailCopyState("error");
    }
    window.setTimeout(() => setEmailCopyState("idle"), 1800);
  };

  const renderThemePicker = (id) => themeOpen && <div className="tn-theme-picker" id={id} role="group" aria-label="Choose theme color">
    {ACCENTS.map((color, i) => <button key={color} type="button" className={`tn-theme-swatch${accent === color ? " active" : ""}`} style={{ "--swatch-color": color }} title={`${ACCENT_NAMES[i]} theme`} aria-label={`Choose ${ACCENT_NAMES[i]} theme`} aria-pressed={accent === color} onClick={() => { setAccent(color); setThemeOpen(false); }}><i /></button>)}
  </div>;

  const { start, keys } = useMemo(() => lib.buildRange(rawEntries, config), []);
  const real = useMemo(() => lib.sortByDate(lib.realEntries(rawEntries), "desc"), []);
  const stats = useMemo(() => lib.computeStats(rawEntries, config), []);
  const demoEntries = real.length === 0 ? lib.sortByDate(rawEntries.filter((e) => e.demo), "desc") : [];

  const openEditorAt = (key) => {
    setEditorDate(key);
    setEditorOpen(true);
  };

  const handleSelect = (key, entry) => {
    if (entry) {
      document.getElementById(`ft-day-${key}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
      setSelected(key);
      clearTimeout(selectTimer.current);
      selectTimer.current = setTimeout(() => setSelected(null), 2400);
    } else {
      openEditorAt(key);
    }
  };

  return (
    <div className={`ft-shell tn-shell${lang === "zh" ? " language-zh" : ""}`}>
      <header className="tn-mobile-nav ft-mobile-nav">
        <FitnessBrand />
        <div className="tn-mobile-actions">
          <button className={`tn-dot${themeOpen ? " open" : ""}`} onClick={() => setThemeOpen(!themeOpen)} aria-label="Choose theme color" aria-haspopup="true" aria-expanded={themeOpen} aria-controls="ft-mobile-theme-picker" data-tooltip="Accent color"><i /></button>
          {renderThemePicker("ft-mobile-theme-picker")}
          <button className="tn-icon-button" onClick={() => setDark(!dark)} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} data-tooltip="Theme">{dark ? <Sun size={24} /> : <Moon size={24} />}</button>
          <button className="tn-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>{menuOpen ? "×" : "☰"}</button>
        </div>
        {menuOpen && <nav className="tn-mobile-menu" aria-label="Mobile primary">
          <a href="/#projects" onClick={() => setMenuOpen(false)}><FitnessNavIcon type="projects" />{t.projects}</a>
          <a href="/fitness-tracker/" aria-current="page" onClick={() => setMenuOpen(false)}><FitnessNavIcon type="fitness" />{t.fitness}</a>
          <a href="/#about" onClick={() => setMenuOpen(false)}><FitnessNavIcon type="about" />{t.about}</a>
          <a href="/#about" onClick={() => setMenuOpen(false)}><FitnessNavIcon type="resume" />{t.resume}</a>
          <div className="tn-lang-switch tn-lang-switch--mobile" role="group" aria-label="Language">
            <button type="button" className={lang === "en" ? "active" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>EN</button><span aria-hidden="true">/</span><button type="button" className={lang === "zh" ? "active" : ""} onClick={() => setLang("zh")} aria-pressed={lang === "zh"}>中</button>
          </div>
        </nav>}
      </header>

      <aside className="tn-side ft-side">
        <section className="tn-sec tn-sec--brand">
          <FitnessBrand />
          <div className="tn-theme-actions">
            <button className={`tn-dot${themeOpen ? " open" : ""}`} onClick={() => setThemeOpen(!themeOpen)} aria-label="Choose theme color" aria-haspopup="true" aria-expanded={themeOpen} aria-controls="ft-desktop-theme-picker" data-tooltip="Accent color"><i /></button>
            {renderThemePicker("ft-desktop-theme-picker")}
            <button className="tn-icon-button" onClick={() => setDark(!dark)} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} data-tooltip="Theme">{dark ? <Sun size={24} /> : <Moon size={24} />}</button>
          </div>
        </section>
        <section className="tn-sec"><p>{t.intro}</p></section>
        <section className="tn-sec tn-sec--nonav">
          <nav className="tn-nav" aria-label={lang === "zh" ? "主导航" : "Primary"}>
            <a href="/#projects"><FitnessNavIcon type="projects" />{t.projects}</a>
            <a href="/fitness-tracker/" aria-current="page"><FitnessNavIcon type="fitness" />{t.fitness}</a>
            <a href="/#about"><FitnessNavIcon type="about" />{t.about}</a>
            <a href="/#about"><FitnessNavIcon type="resume" />{t.resume}</a>
          </nav>
        </section>
        <section className="tn-sec tn-sec--foot">
          <div className="tn-footer-actions">
            <div className="tn-socials" aria-label="Social links">
              <a href="https://github.com/Hongjin-Lin" target="_blank" rel="noreferrer" aria-label="GitHub" data-tooltip="GitHub"><GithubLogo size={26} /></a>
              <a href="#" aria-label="LinkedIn" data-tooltip="LinkedIn"><LinkedinLogo size={25} /></a>
              <button type="button" className="tn-social-copy" onClick={copyEmail} aria-label={emailCopyState === "copied" ? "Email copied" : "Copy my email"} data-tooltip={emailCopyState === "copied" ? "Email copied!" : emailCopyState === "error" ? "Could not copy" : "Copy my email"}><EnvelopeSimple size={25} /></button>
            </div>
            <div className="tn-lang-switch tn-lang-switch--inline" role="group" aria-label="Language">
              <button type="button" className={lang === "en" ? "active" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>EN</button><span aria-hidden="true">/</span><button type="button" className={lang === "zh" ? "active" : ""} onClick={() => setLang("zh")} aria-pressed={lang === "zh"}>中</button>
            </div>
          </div>
        </section>
      </aside>

      <main className="ft-main tn-main">
        <section className="ft-hero">
          <p className="ft-eyebrow"><span aria-hidden="true" /> {t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="ft-sub">{t.subtitle(config)}</p>
        </section>

        <StatsRow stats={stats} start={start} config={config} t={t} lang={lang} />

        <div className="ft-columns">
          <div className="ft-col ft-col--cal">
            <section className="ft-section">
              <h2>{t.calendarTitle}</h2>
              <Calendar all={rawEntries} start={start} keys={keys} lang={lang} t={t} onSelect={handleSelect} />
            </section>
          </div>

          <div className="ft-col ft-col--records">
            <section className="ft-section">
              <h2>{t.timelineTitle}</h2>
              {real.length === 0 && (
                <div className="ft-empty">
                  <h3>{t.emptyTitle}</h3>
                  <p>{t.emptyBody}</p>
                </div>
              )}
              <div className="ft-days">
                {real.map((entry) => (
                  <DayCard
                    key={entry.date}
                    entry={entry}
                    start={start}
                    lang={lang}
                    t={t}
                    onZoom={setZoom}
                    onEdit={openEditorAt}
                    selected={selected === entry.date}
                  />
                ))}
                {demoEntries.map((entry) => (
                  <div key={entry.date} className="ft-demo-wrap">
                    <span className="ft-chip ft-chip--demo">{t.demoBadge}</span>
                    <DayCard entry={entry} start={entry.date} lang={lang} t={t} onZoom={setZoom} onEdit={openEditorAt} hideDayNumber />
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
        <footer className="ft-footer">
          <p>{t.deployNote}</p>
          <button type="button" className="ft-btn ft-btn--primary" onClick={() => openEditorAt(lib.todayKey())}>✎ {t.edit}</button>
        </footer>
      </main>

      <Editor
        open={editorOpen}
        onClose={() => setEditorOpen(false)}
        entries={rawEntries}
        lang={lang}
        date={editorDate}
        onDateChange={setEditorDate}
      />

      {zoom && (
        <div className="ft-lightbox" role="dialog" aria-modal="true" aria-label={t.lightboxClose} onClick={() => setZoom(null)}>
          <img src={zoom} alt="" />
        </div>
      )}
    </div>
  );
}
