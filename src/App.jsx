import { useEffect, useState } from "react";
import { EnvelopeSimpleIcon as EnvelopeSimple } from "@phosphor-icons/react/dist/csr/EnvelopeSimple";
import { GithubLogoIcon as GithubLogo } from "@phosphor-icons/react/dist/csr/GithubLogo";
import { LinkedinLogoIcon as LinkedinLogo } from "@phosphor-icons/react/dist/csr/LinkedinLogo";
import { MoonIcon as Moon } from "@phosphor-icons/react/dist/csr/Moon";
import { SunIcon as Sun } from "@phosphor-icons/react/dist/csr/Sun";

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
    titleZh: "RAG 知识助手",
    briefZh: "基于私有文档进行检索增强问答，并提供可追溯的引用。",
    noteZh: "* 模块化数据接入 · 混合检索",
    detailZh: "模块化数据处理管线、BM25 与向量混合检索，以及按引用质量评分的评测工具。",
    resultZh: "在精选评测集中将幻觉率降低了 38%。",
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
    titleZh: "实时推荐 API",
    briefZh: "结合协同过滤与内容信号，提供低延迟个性化推荐。",
    noteZh: "* 流式更新 · 内置实验工具",
    detailZh: "提供类型安全的 API、流式更新能力和内置实验工具，支持在线学习迭代。",
    resultZh: "每秒处理 2,500 个请求时，P99 延迟保持在 128 毫秒。",
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
    titleZh: "分布式任务队列",
    briefZh: "具备延迟调度、自动重试与限流能力的高可用任务队列。",
    noteZh: "* 水平扩展 · 默认可观测",
    detailZh: "支持横向扩展、延迟调度、自动重试和速率限制。",
    resultZh: "三节点集群中的任务成功率达到 99.95%。",
  },
];

const COPY = {
  en: {
    intro: "I'm Hongjin, backend & machine-learning engineer and open-source creator. This is my digital garden. 🌱",
    projects: "Projects", fitness: "Fitness", about: "About me", resume: "Resume",
    introAria: "Introduction", greeting: "Hey, I'm Hongjin!",
    lead: "Backend & machine-learning engineer, writer, all-around nerd.",
    introHeading: "A brief introduction", close: "CLOSE ↑", details: "DETAILS ↓",
    timeline: [
      { year: "2003–2021", title: "Ningbo kid", text: ": forum-goer, gamer, lover of obscure '00s bands." },
      { year: "2021–2026", title: "BSc Computer Science", text: ": distributed systems, applied machine learning, and the occasional all-nighter. ", link: "Wrote some of it down", tail: " along the way." },
      { year: "2026–now", title: "Backend & ML engineer", text: ": building reliable systems, shipping features, and still documenting everything." },
      { year: "Daily", title: "60-day fitness log", text: ": meals, workouts, and weight — ", link: "follow along here", href: "/fitness-tracker/", tail: "." },
    ],
    also: "Also", alsoText: ": city explorer, weight-lifter, brick-clicker, tea drinker, webmaster.",
    shelves: "Shelves", shelvesDescription: "Hand-picked paths through my notes, projects, and things I keep learning.",
    appleAlt: "Four green apples holding hands and dancing together",
  },
  zh: {
    intro: "你好，我是泓进，后端与机器学习工程师、开源创作者。这里是我的数字花园。🌱",
    projects: "项目", fitness: "健身打卡", about: "关于我", resume: "简历",
    introAria: "个人介绍", greeting: "嗨，我是泓进！",
    lead: "后端与机器学习工程师、写作者，也是个技术爱好者。",
    introHeading: "简单介绍", close: "收起 ↑", details: "查看详情 ↓",
    timeline: [
      { year: "2003–2021", title: "宁波长大", text: "：逛论坛、玩游戏，喜欢冷门的 00 年代乐队。" },
      { year: "2021–2026", title: "计算机科学学士", text: "：学习分布式系统与应用机器学习，偶尔也会熬夜。一路上", link: "记下了一些经历", tail: "。" },
      { year: "2026–现在", title: "后端与机器学习工程师", text: "：构建可靠的系统、交付功能，也持续记录技术实践。" },
      { year: "日常", title: "60 天健身打卡", text: "：记录饮食、训练和体重，", link: "点这里一起看看", href: "/fitness-tracker/", tail: "。" },
    ],
    also: "还有", alsoText: "：城市漫游、举铁、玩积木、喝茶，也喜欢打理个人网站。",
    shelves: "收藏架", shelvesDescription: "整理我持续学习的主题、笔记与项目。",
    appleAlt: "四只牵手跳舞的青苹果",
  },
};

function ProjectRow({ project, index, open, onToggle, lang, copy }) {
  const localized = (key) => lang === "zh" ? project[`${key}Zh`] || project[key] : project[key];
  return (
    <article className={`tn-proj${open ? " open" : ""}`}>
      <span className="no">{String(index + 1).padStart(2, "0")}</span>
      <div className="thumb"><img src={project.image} alt="" loading="lazy" /></div>
      <div className="body">
        <div className="meta">{project.meta}</div>
        <h3>{localized("title")}</h3>
        <p className="brief">{localized("brief")}</p>
        <p className="note">{localized("note")}</p>
      </div>
      <button className="toggle" onClick={onToggle} aria-expanded={open}>{open ? copy.close : copy.details}</button>
      <div className="detail"><div className="inner"><div className="pad">
        <p>{localized("detail")}</p>
        <p className="res">{localized("result")}</p>
        <div className="stack">{project.stack}</div>
      </div></div></div>
    </article>
  );
}

function BrandLogo() {
  return (
    <a className="tn-brand tn-brand--root" href="/" aria-label="返回 root 主页">
      <span className="tn-brand-mascot" aria-hidden="true">
        <img className="tn-brand-avatar" src="/icons/focus-reader.png" alt="" />
        <span className="tn-image-tint tn-image-tint--mascot" />
      </span>
      <span className="tn-brand-lockup">
        <span className="tn-brand-wordmark">root<span className="tn-brand-slash">/</span></span>
      </span>
    </a>
  );
}

function LanguageSwitch({ lang, onChange, mobile = false }) {
  return (
    <div className={`tn-lang-switch${mobile ? " tn-lang-switch--mobile" : ""}`} role="group" aria-label="Language">
      <button type="button" className={lang === "en" ? "active" : ""} onClick={() => onChange("en")} aria-pressed={lang === "en"}>EN</button>
      <span aria-hidden="true">/</span>
      <button type="button" className={lang === "zh" ? "active" : ""} onClick={() => onChange("zh")} aria-pressed={lang === "zh"}>中</button>
    </div>
  );
}

export function App() {
  const [accent, setAccent] = useState(() => localStorage.getItem("tn-accent") || ACCENTS[0]);
  const [dark, setDark] = useState(() => localStorage.getItem("tn-dark") === "1");
  const [lang, setLang] = useState(() => localStorage.getItem("ft_lang") || "en");
  const [openProject, setOpenProject] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const copy = COPY[lang];

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
    localStorage.setItem("ft_lang", lang);
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
  }, [lang]);

  const cycleAccent = () => {
    const i = ACCENTS.indexOf(accent);
    setAccent(ACCENTS[(i + 1) % ACCENTS.length]);
  };

  return (
    <div className={`tn-shell${lang === "zh" ? " language-zh" : ""}`}>
      <header className="tn-mobile-nav">
        <BrandLogo />
        <div className="tn-mobile-actions">
          <button className="tn-dot" onClick={cycleAccent} aria-label="Cycle theme color"><i /></button>
          <button className="tn-icon-button" onClick={() => setDark(!dark)} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}>{dark ? <Sun size={24} weight="regular" /> : <Moon size={24} weight="regular" />}</button>
          <button className="tn-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>{menuOpen ? "×" : "☰"}</button>
        </div>
        {menuOpen && <nav className="tn-mobile-menu" aria-label="Mobile primary">
          <a href="#projects" onClick={() => setMenuOpen(false)}>💻 {copy.projects}</a>
          <a href="/fitness-tracker/">🏋️ {copy.fitness}</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>💾 {copy.about}</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>📄 {copy.resume}</a>
          <LanguageSwitch lang={lang} onChange={setLang} mobile />
        </nav>}
      </header>
      <aside className="tn-side">
        <section className="tn-sec tn-sec--brand">
          <BrandLogo />
          <div className="tn-theme-actions">
            <button className="tn-dot" onClick={cycleAccent} title={"Theme color: " + ACCENT_NAMES[ACCENTS.indexOf(accent)]} aria-label="Cycle theme color"><i /></button>
            <button className="tn-icon-button" onClick={() => setDark(!dark)} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"}>{dark ? <Sun size={24} weight="regular" /> : <Moon size={24} weight="regular" />}</button>
          </div>
        </section>
        <section className="tn-sec">
          <p>{copy.intro}</p>
        </section>
        <section className="tn-sec tn-sec--nonav">
          <nav className="tn-nav" aria-label={lang === "zh" ? "主导航" : "Primary"}>
            <a href="#projects"><span className="em">💻</span>{copy.projects}</a>
            <a href="/fitness-tracker/"><span className="em">🏋️</span>{copy.fitness}</a>
            <a href="#about"><span className="em">💾</span>{copy.about}</a>
            <a href="#about"><span className="em">📄</span>{copy.resume}</a>
          </nav>
        </section>
        <section className="tn-sec tn-sec--foot">
          <div className="tn-socials" aria-label="Social links">
            <a href="https://github.com/Hongjin-Lin" target="_blank" rel="noreferrer" aria-label="GitHub"><GithubLogo size={26} weight="regular" /></a>
            <a href="#" aria-label="LinkedIn"><LinkedinLogo size={25} weight="regular" /></a>
            <a href="#" aria-label="Email"><EnvelopeSimple size={25} weight="regular" /></a>
          </div>
          <LanguageSwitch lang={lang} onChange={setLang} />
        </section>
      </aside>

      <main className="tn-main">
        <section className="tn-hero-section" aria-label={copy.introAria}>
          <div className="tn-hero-inner">
          <div className="tn-col" id="about">
          <h1>{copy.greeting}</h1>
          <p className="tn-lead">{copy.lead}</p>
          <h2>{copy.introHeading}</h2>
          <ul className="tn-timeline">
            {copy.timeline.map((item) => (
              <li key={item.year}>
                <span className="tn-yr">{item.year}</span>
                <span><b>{item.title}</b>{item.text}{item.link && <a href={item.href || "#"}>{item.link}</a>}{item.tail}</span>
              </li>
            ))}
          </ul>
          <p className="tn-also"><a href="#">{copy.also}</a>{copy.alsoText}</p>
          </div>
          <aside className="tn-hero-art" aria-label="Four dancing green apples">
            <span className="tn-artwork--apples">
              <img className="apple-ensemble" src="/assets/apples/apple-ensemble.png" alt={copy.appleAlt} />
              <span className="tn-image-tint tn-image-tint--apples" aria-hidden="true" />
            </span>
          </aside>
          </div>
        </section>
        <div className="tn-lower-sections">
          <section id="shelves" className="tn-shelves">
            <h2>{copy.shelves}</h2>
            <p>{copy.shelvesDescription}</p>
          </section>
          <section id="projects" className="tn-projects">
            <h2>{copy.projects}</h2>
            {PROJECTS.map((p, i) => (
              <ProjectRow key={p.title} project={p} index={i} open={openProject === i} onToggle={() => setOpenProject((v) => (v === i ? null : i))} lang={lang} copy={copy} />
            ))}
          </section>
        </div>
      </main>
    </div>
  );
}
