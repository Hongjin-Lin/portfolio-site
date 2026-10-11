import { useEffect, useState } from "react";

const ACCENTS = ["#b12d6c", "#2456c8", "#2e7d46", "#c26a1f", "#7a4fc9", "#1f7a78"];
const ACCENT_NAMES = ["Rose", "Blue", "Green", "Amber", "Violet", "Teal"];

const PROJECTS = [
  {
    title: "RAG Knowledge Assistant",
    meta: "2026 · LLM Systems",
    image: "/assets/rag-evaluation.png",
    brief: "A retrieval-augmented assistant answering over private documents with citations.",
    note: "* MODULAR INGESTION · HYBRID RETRIEVAL",
    detail: "Modular ingestion pipeline, hybrid retrieval (BM25 + vector), and an evaluation harness with citation-level scoring.",
    result: "Reduced hallucinations by 38% on a curated evaluation set.",
    stack: "Python · FastAPI · PostgreSQL · pgvector · LangChain · Docker",
  },
  {
    title: "Real-time Recommendation API",
    meta: "2025 · API · ML",
    image: "/assets/recommendation-api.png",
    brief: "Low-latency recommendations with collaborative filtering and content signals.",
    note: "* STREAMING UPDATES · BUILT-IN EXPERIMENTS",
    detail: "Typed API with streaming updates and built-in experiment tooling for online learning loops.",
    result: "Kept P99 latency at 128ms while serving 2.5k requests per second.",
    stack: "Python · gRPC · Redis · ClickHouse · Prometheus · Kubernetes",
  },
  {
    title: "Distributed Task Queue",
    meta: "2025 · Infrastructure",
    image: "/assets/task-queue.png",
    brief: "Fault-tolerant queueing with delayed scheduling, retries and rate limiting.",
    note: "* HORIZONTAL SCALE · OBSERVABLE BY DEFAULT",
    detail: "Designed for horizontal scale — delayed scheduling, automatic retries, and rate limiting.",
    result: "Achieved 99.95% successful completion across a three-node cluster.",
    stack: "Go · NATS · PostgreSQL · Redis · Docker · Kubernetes",
  },
];

function ProjectRow({ project, index, open, onToggle }) {
  return (
    <article className={`tn-proj${open ? " open" : ""}`}>
      <span className="no">{String(index + 1).padStart(2, "0")}</span>
      <div className="thumb"><img src={project.image} alt="" loading="lazy" /></div>
      <div className="body">
        <div className="meta">{project.meta}</div>
        <h3>{project.title}</h3>
        <p className="brief">{project.brief}</p>
        <p className="note">{project.note}</p>
      </div>
      <button className="toggle" onClick={onToggle} aria-expanded={open}>{open ? "CLOSE ↑" : "DETAILS ↓"}</button>
      <div className="detail"><div className="inner"><div className="pad">
        <p>{project.detail}</p>
        <p className="res">{project.result}</p>
        <div className="stack">{project.stack}</div>
      </div></div></div>
    </article>
  );
}

export function App() {
  const [accent, setAccent] = useState(() => localStorage.getItem("tn-accent") || ACCENTS[0]);
  const [dark, setDark] = useState(() => localStorage.getItem("tn-dark") === "1");
  const [openProject, setOpenProject] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

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
      <header className="tn-mobile-nav">
        <a className="tn-brand" href="/"><span className="tn-floppy">💾</span>hongjinlin.com</a>
        <div className="tn-mobile-actions">
          <button className="tn-dot" onClick={cycleAccent} aria-label="Cycle theme color"><i /></button>
          <button className="tn-moon" onClick={() => setDark(!dark)} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}>{dark ? "☀️" : "🌙"}</button>
          <button className="tn-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>{menuOpen ? "×" : "☰"}</button>
        </div>
        {menuOpen && <nav className="tn-mobile-menu" aria-label="Mobile primary">
          <a href="#" onClick={() => setMenuOpen(false)}>📝 Blog</a>
          <a href="#shelves" onClick={() => setMenuOpen(false)}>🔎 Shelves</a>
          <a href="#projects" onClick={() => setMenuOpen(false)}>💻 Projects</a>
          <a href="/fitness-tracker/">🏋️ Fitness</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>💾 About me</a>
        </nav>}
      </header>
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
            <a href="#shelves"><span className="em">🔎</span>Shelves</a>
            <a href="#projects"><span className="em">💻</span>Projects</a>
            <a href="/fitness-tracker/"><span className="em">🏋️</span>Fitness</a>
            <a href="#about"><span className="em">💾</span>About me</a>
          </nav>
        </section>
        <section className="tn-sec tn-sec--foot">
          <div className="tn-socials" aria-label="Social links">
            <a href="#" aria-label="Email">✉</a>
            <a href="https://github.com/Hongjin-Lin" target="_blank" rel="noreferrer" aria-label="GitHub">⌘</a>
            <a href="#" aria-label="Bluesky">🦋</a>
            <a href="#" aria-label="RSS feed">◔</a>
          </div>
          <div className="tn-footer-links"><a href="#">Resume</a><a href="#shelves">Topics</a><a href="https://github.com/Hongjin-Lin/portfolio-site" target="_blank" rel="noreferrer">Source</a></div>
          <button className="tn-moon" onClick={() => setDark(!dark)} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}>{dark ? "☀️" : "🌙"}</button>
        </section>
      </aside>

      <main className="tn-main">
        <section className="tn-hero-section" aria-label="Introduction">
          <div className="tn-hero-inner">
          <div className="tn-col" id="about">
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
          <aside className="tn-hero-art" aria-label="Four dancing green apples">
            <img className="apple-ensemble" src="/assets/apples/apple-ensemble.png" alt="Four green apples holding hands and dancing together" />
            <p className="tn-apple-caption">A little green energy for your day 🍏</p>
          </aside>
          </div>
        </section>
        <div className="tn-lower-sections">
          <section id="shelves" className="tn-shelves">
            <h2>Shelves</h2>
            <p>Hand-picked paths through my notes, projects, and things I keep learning.</p>
          </section>
          <section id="projects" className="tn-projects">
            <h2>Projects</h2>
            {PROJECTS.map((p, i) => (
              <ProjectRow key={p.title} project={p} index={i} open={openProject === i} onToggle={() => setOpenProject((v) => (v === i ? null : i))} />
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
