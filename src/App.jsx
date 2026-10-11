import { useEffect, useState } from "react";

const ACCENTS = ["#b12d6c", "#2456c8", "#2e7d46", "#c26a1f", "#7a4fc9", "#1f7a78"];
const ACCENT_NAMES = ["Rose", "Blue", "Green", "Amber", "Violet", "Teal"];

export function App() {
  const [accent, setAccent] = useState(() => localStorage.getItem("tn-accent") || ACCENTS[0]);
  const [dark, setDark] = useState(() => localStorage.getItem("tn-dark") === "1");

  useEffect(() => {
    localStorage.setItem("tn-accent", accent);
    document.documentElement.style.setProperty("--tn-accent", accent);
  }, [accent]);

  useEffect(() => {
    localStorage.setItem("tn-dark", dark ? "1" : "0");
    if (dark) document.documentElement.dataset.tnDark = "1";
    else delete document.documentElement.dataset.tnDark;
  }, [dark]);

  const cycleAccent = () => {
    const i = ACCENTS.indexOf(accent);
    setAccent(ACCENTS[(i + 1) % ACCENTS.length]);
  };

  return (
    <div className="tn-shell">
      <aside className="tn-side">
        <section className="tn-sec tn-sec--brand">
          <a className="tn-brand" href="/"><span className="tn-floppy">💾</span>hongjinlin.com</a>
          <button className="tn-dot" onClick={cycleAccent} title={"Theme color: " + ACCENT_NAMES[ACCENTS.indexOf(accent)]} aria-label="Cycle theme color"><i /></button>
        </section>
        <section className="tn-sec">
          <p>I'm <b>Hongjin</b>, backend &amp; machine-learning engineer and open-source creator. This is my digital garden. 🌱</p>
        </section>
        <section className="tn-sec tn-sec--nonav">
          <nav className="tn-nav" aria-label="Primary">
            <a href="#"><span className="em">📝</span>Blog</a>
            <a href="#projects"><span className="em">💻</span>Projects</a>
            <a href="/fitness-tracker/"><span className="em">🏋️</span>Fitness</a>
            <a href="#"><span className="em">💾</span>About me</a>
          </nav>
        </section>
        <section className="tn-sec tn-sec--foot">
          <a href="#">Email signup</a>
          <a href="https://github.com/Hongjin-Lin" target="_blank" rel="noreferrer">GitHub</a>
          <a href="#">Bluesky</a>
          <a href="#">RSS feed</a>
          <button className="tn-moon" onClick={() => setDark(!dark)}>{dark ? "☀️ Full Sun" : "🌙 New Moon"}</button>
        </section>
      </aside>

      <main className="tn-main">
        <div className="tn-col">
          <h1>Hey, I'm Hongjin!</h1>
          <p className="tn-lead">Backend &amp; machine-learning engineer, writer, all-around nerd.</p>
          <h2>A brief timeline</h2>
          <ul className="tn-timeline">
            <li>
              <span className="tn-yr">2003–2021</span>
              <span><b>Ningbo kid</b>: forum-goer, gamer, lover of obscure '00s bands.</span>
            </li>
            <li>
              <span className="tn-yr">2021–2026</span>
              <span><b>BSc Computer Science</b>: distributed systems, applied machine learning, and the occasional all-nighter. <a href="#">Wrote some of it down</a> along the way.</span>
            </li>
            <li>
              <span className="tn-yr">2026–now</span>
              <span><b>Backend &amp; ML engineer</b>: building reliable systems, shipping features, and still documenting everything.</span>
            </li>
            <li>
              <span className="tn-yr">Daily</span>
              <span><b>60-day fitness log</b>: meals, workouts, and weight — <a href="/fitness-tracker/">follow along here</a>.</span>
            </li>
          </ul>
          <p className="tn-also"><a href="#">Also</a>: city explorer, weight-lifter, brick-clicker, tea drinker, webmaster.</p>
        </div>
      </main>
    </div>
  );
}
