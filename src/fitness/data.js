export const MEALS = ["breakfast", "lunch", "dinner"];

export const MEAL_INFO = {
  breakfast: { zh: "早餐", en: "Breakfast", icon: "☀" },
  lunch: { zh: "午餐", en: "Lunch", icon: "◐" },
  dinner: { zh: "晚餐", en: "Dinner", icon: "☾" },
};

export function dateKey(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayKey() {
  return dateKey(new Date());
}

export function parseKey(key) {
  const [y, m, d] = key.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(key, n) {
  const d = parseKey(key);
  d.setDate(d.getDate() + n);
  return dateKey(d);
}

export function mondayOf(key) {
  const d = parseKey(key);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return dateKey(d);
}

export function realEntries(all) {
  return (all || []).filter((e) => e && !e.demo && e.date);
}

export function mealHasData(meal) {
  if (!meal) return false;
  return Boolean(meal.items || meal.kcal != null || (meal.photos?.length ?? 0) > 0);
}

export function mealComplete(meal) {
  return Boolean(meal && meal.kcal != null && mealHasData(meal));
}

export function dayTotals(entry) {
  let kcal = 0, protein = 0, complete = 0, photos = 0;
  for (const m of MEALS) {
    const meal = entry?.meals?.[m];
    if (mealComplete(meal)) complete += 1;
    if (meal?.kcal != null) kcal += Number(meal.kcal) || 0;
    if (meal?.protein != null) protein += Number(meal.protein) || 0;
    photos += meal?.photos?.length || 0;
  }
  return { kcal, protein, complete, photos };
}

export function dayComplete(entry) {
  return dayTotals(entry).complete === 3 && entry?.weightKg != null;
}

export function sortByDate(entries, dir = "asc") {
  const sign = dir === "asc" ? 1 : -1;
  return [...entries].sort((a, b) => ((a.date < b.date ? -1 : a.date > b.date ? 1 : 0)) * sign);
}

export function deriveStart(all, config) {
  if (config.startDate) return mondayOf(config.startDate);
  const real = sortByDate(realEntries(all));
  if (real.length) return mondayOf(real[0].date);
  return mondayOf(todayKey());
}

export function buildRange(all, config) {
  const start = deriveStart(all, config);
  const days = config.durationDays || 60;
  const keys = [];
  for (let i = 0; i < days; i += 1) keys.push(addDays(start, i));
  return { start, keys };
}

export function dayNumber(key, start) {
  return Math.floor((parseKey(key) - parseKey(start)) / 86400000) + 1;
}

export function computeStats(all, config) {
  const real = sortByDate(realEntries(all));
  let streak = 0;
  if (real.length) {
    streak = 1;
    for (let i = real.length - 1; i > 0; i -= 1) {
      if (addDays(real[i - 1].date, 1) === real[i].date) streak += 1;
      else break;
    }
  }
  const weights = real.filter((e) => e.weightKg != null);
  const weightFirst = weights[0]?.weightKg ?? null;
  const weightLast = weights.at(-1)?.weightKg ?? null;
  const delta =
    weightFirst != null && weightLast != null
      ? Math.round((weightLast - weightFirst) * 10) / 10
      : null;
  const avg = (sel, pick) =>
    sel.length ? Math.round(sel.reduce((s, e) => s + (pick(e) || 0), 0) / sel.length) : null;
  const last7 = real.slice(-7);
  return {
    logged: real.length,
    streak,
    weightFirst,
    weightLast,
    delta,
    kcal7: avg(last7, (e) => dayTotals(e).kcal) || null,
    protein7: avg(last7, (e) => dayTotals(e).protein) || null,
    onTarget: real.filter((e) => {
      const t = dayTotals(e);
      return (
        t.kcal > 0 &&
        Math.abs(t.kcal - config.calorieTarget) <= config.calorieTarget * 0.1 &&
        t.protein >= config.proteinMin
      );
    }).length,
    series: weights.map((e) => ({ date: e.date, value: Number(e.weightKg) })),
  };
}
