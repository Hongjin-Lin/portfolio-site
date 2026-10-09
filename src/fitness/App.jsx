import { useEffect, useMemo, useState } from "react";
import config from "../data/fitness/config.json";
import rawEntries from "../data/fitness/entries.json";
import * as lib from "./data.js";
import { Editor } from "./editor.jsx";

const LANG_KEY = "ft_lang";

const T = {
  zh: {
    eyebrow: "Fitness Tracker",
    title: "60 天饮食与训练打卡",
    subtitle: (c) => `每日三餐（照片 · 卡路里 · 蛋白质）、体重与训练记录。目标：每天 ${c.calorieTarget} kcal，蛋白质 ${c.proteinMin}–${c.proteinMax} g。`,
    backHome: "返回首页",
    calendarTitle: "打卡日历",
    timelineTitle: "每日记录",
    stats: {
      day: "打卡进度", logged: "已记录", streak: "连续打卡",
      weight: "最新体重", kcal7: "近 7 日均卡路里", protein7: "近 7 日均蛋白质",
    },
    legend: { full: "完整打卡", partial: "部分记录", missed: "未打卡", future: "未来" },
    dayN: (n) => `Day ${n}`,
    workout: "训练", min: "分钟", weightLabel: "体重", today: "今天",
    emptyTitle: "等待第一条打卡",
    emptyBody: "点击页面底部「打卡 / 编辑」上传今天的饮食与训练；下面的示例卡片展示了每天记录的完整样子。",
    demoBadge: "示例", edit: "打卡 / 编辑",
    deployNote: "数据提交至 GitHub，由 Vercel 自动部署",
    noWeight: "未记录", lightboxClose: "关闭大图",
  },
  en: {
    eyebrow: "Fitness Tracker",
    title: "60 Days of Diet & Training",
    subtitle: (c) => `Daily meals (photos · calories · protein), weight, and workouts. Target: ${c.calorieTarget} kcal and ${c.proteinMin}–${c.proteinMax} g protein per day.`,
    backHome: "Back home",
    calendarTitle: "Calendar",
    timelineTitle: "Daily log",
    stats: {
      day: "Progress", logged: "logged", streak: "Streak",
      weight: "Latest weight", kcal7: "Avg calories (7d)", protein7: "Avg protein (7d)",
    },
    legend: { full: "Complete", partial: "Partial", missed: "Missed", future: "Upcoming" },
    dayN: (n) => `Day ${n}`,
    workout: "Workout", min: "min", weightLabel: "Weight", today: "Today",
    emptyTitle: "Waiting for the first check-in",
    emptyBody: "Use “Check-in / Edit” at the bottom to log today's meals and workout. The demo card below shows what a logged day looks like.",
    demoBadge: "Demo", edit: "Check-in / Edit",
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

function Calendar({ all, start, keys, lang, t }) {
  const map = useMemo(() => new Map(lib.realEntries(all).map((e) => [e.date, e])), [all]);
  const today = lib.todayKey();
  const weeks = [];
  for (let i = 0; i < keys.length; i += 7) weeks.push(keys.slice(i, i + 7));
  let lastMonth = "";
  return (
    <div className="ft-calendar">
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
                const cls = [
                  "ft-cell",
                  entry ? (complete ? "is-full" : "is-partial") : isFuture ? "is-future" : "is-missed",
                  k === today ? "is-today" : "",
                ].filter(Boolean).join(" ");
                const totals = entry ? lib.dayTotals(entry) : null;
                return (
                  <button
                    key={k}
                    type="button"
                    className={cls}
                    title={entry ? `${k} · ${totals.kcal} kcal · ${totals.protein}g` : k}
                    onClick={() =>
                      document.getElementById(`ft-day-${k}`)?.scrollIntoView({ behavior: "smooth", block: "start" })
                    }
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

function DayCard({ entry, start, lang, t, onZoom, hideDayNumber = false }) {
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

  return (
    <article className="ft-day" id={`ft-day-${entry.date}`}>
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
        <span className="ft-chip">
          {totals.kcal || "—"} kcal · {totals.protein || "—"}g {zh ? "蛋白质" : "protein"}
        </span>
      </header>

      <div className="ft-day-body">
        <section className="ft-workout">
          <h3>{t.workout}</h3>
          {entry.workout?.title ? (
            <>
              <p className="ft-workout-title">
                {entry.workout.title}
                {entry.workout?.durationMin ? <em> · {entry.workout.durationMin} {t.min}</em> : null}
              </p>
              {entry.workout?.detail && <p className="ft-workout-detail">{entry.workout.detail}</p>}
            </>
          ) : (
            <p className="ft-muted">—</p>
          )}
        </section>

        <div className="ft-meals">
          {lib.MEALS.map((m) => {
            const meal = entry.meals?.[m] || {};
            return (
              <section className="ft-meal" key={m}>
                <h4>{lib.MEAL_INFO[m].icon} {lib.MEAL_INFO[m][lang]}</h4>
                {meal.items && <p className="ft-meal-items">{meal.items}</p>}
                <p className="ft-meal-numbers">
                  <strong>{meal.kcal != null ? meal.kcal : "—"}</strong> kcal
                  <i aria-hidden="true" />
                  <strong>{meal.protein != null ? meal.protein : "—"}</strong> g {zh ? "蛋白质" : "protein"}
                </p>
                {meal.photos?.length > 0 && (
                  <div className="ft-thumbs">
                    {meal.photos.map((src) => (
                      <button key={src} type="button" className="ft-thumb" onClick={() => onZoom(src)}>
                        <img src={src} alt={`${lib.MEAL_INFO[m][lang]} · ${entry.date}`} loading="lazy" />
                      </button>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
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
    </article>
  );
}

function StatsRow({ stats, start, config, t }) {
  const s = t.stats;
  const dayNum = Math.min(Math.max(lib.dayNumber(lib.todayKey(), start), 0), config.durationDays);
  const cards = [
    { label: s.day, value: `Day ${dayNum}`, sub: `${s.logged} ${stats.logged}`, unit: config.durationDays },
    { label: s.streak, value: stats.streak, unit: t.min === "分钟" ? "天" : "days" },
    {
      label: s.weight,
      value: stats.weightLast != null ? stats.weightLast : "—",
      sub: stats.delta != null ? `${stats.delta > 0 ? "+" : ""}${stats.delta} kg` : "—",
      spark: stats.series,
    },
    { label: s.kcal7, value: stats.kcal7 ?? "—", unit: `/ ${config.calorieTarget} kcal` },
    { label: s.protein7, value: stats.protein7 ?? "—", unit: `/ ${config.proteinMin}–${config.proteinMax} g` },
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
  const [zoom, setZoom] = useState(null);
  const t = T[lang];

  useEffect(() => {
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    localStorage.setItem(LANG_KEY, lang);
  }, [lang]);

  const { start, keys } = useMemo(() => lib.buildRange(rawEntries, config), []);
  const real = useMemo(() => lib.sortByDate(lib.realEntries(rawEntries), "desc"), []);
  const stats = useMemo(() => lib.computeStats(rawEntries, config), []);
  const demoEntries = real.length === 0 ? lib.sortByDate(rawEntries.filter((e) => e.demo), "desc") : [];

  return (
    <div className={`ft-shell language-${lang}`}>
      <header className="ft-header">
        <a className="ft-wordmark" href="/">linhongjin.com</a>
        <div className="ft-nav">
          <a href="/">← {t.backHome}</a>
          <div className="ft-lang" aria-label="Language">
            <button type="button" className={lang === "en" ? "active" : ""} onClick={() => setLang("en")} aria-pressed={lang === "en"}>EN</button>
            <span aria-hidden="true">/</span>
            <button type="button" className={lang === "zh" ? "active" : ""} onClick={() => setLang("zh")} aria-pressed={lang === "zh"}>中文</button>
          </div>
        </div>
      </header>

      <main className="ft-main">
        <section className="ft-hero">
          <p className="ft-eyebrow"><span aria-hidden="true" /> {t.eyebrow}</p>
          <h1>{t.title}</h1>
          <p className="ft-sub">{t.subtitle(config)}</p>
        </section>

        <StatsRow stats={stats} start={start} config={config} t={t} />

        <section className="ft-section">
          <h2>{t.calendarTitle}</h2>
          <Calendar all={rawEntries} start={start} keys={keys} lang={lang} t={t} />
        </section>

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
              <DayCard key={entry.date} entry={entry} start={start} lang={lang} t={t} onZoom={setZoom} />
            ))}
            {demoEntries.map((entry) => (
              <div key={entry.date} className="ft-demo-wrap">
                <span className="ft-chip ft-chip--demo">{t.demoBadge}</span>
                <DayCard entry={entry} start={entry.date} lang={lang} t={t} onZoom={setZoom} hideDayNumber />
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="ft-footer">
        <p>{t.deployNote}</p>
        <button type="button" className="ft-btn ft-btn--primary" onClick={() => setEditorOpen(true)}>✎ {t.edit}</button>
      </footer>

      <Editor open={editorOpen} onClose={() => setEditorOpen(false)} entries={rawEntries} lang={lang} />

      {zoom && (
        <div className="ft-lightbox" role="dialog" aria-modal="true" aria-label={t.lightboxClose} onClick={() => setZoom(null)}>
          <img src={zoom} alt="" />
        </div>
      )}
    </div>
  );
}
