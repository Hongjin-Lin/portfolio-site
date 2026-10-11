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
    intro: "I am Hongjin, an incoming MSc Computer Science & Engineering student at the Technical University of Denmark 📖.",
    projects: "Projects", fitness: "Fitness", about: "About me", resume: "Resume",
    introAria: "Introduction", greeting: "Hey, I'm Hongjin!",
    lead: "CS student, climber, landscape photographer.",
    introHeading: "A brief introduction", close: "CLOSE ↑", details: "DETAILS ↓",
    timeline: [
      { year: "2004–2022", title: "Shenzhen, China", text: " — Grew up reading widely and staying curious about how things work." },
      { year: "2022–2026", title: "BSc in Computer Science, University of Nottingham", text: " — Built a strong foundation in computer science, with particular interests in software engineering and applied machine learning." },
      { year: "2026–now", title: "Incoming MSc student in Computer Science & Engineering, Technical University of Denmark", text: " — Looking forward to deepening my knowledge of AI and machine learning, and exploring how to bring AI models into practical, real-world applications." },
    ],
    career: "Career direction", careerText: ": I aspire to become a Machine Learning Engineer or AI Engineer, applying technology to real-world problems and building useful tools that make people’s lives easier.",
    outside: "Outside tech", outsideText: ": Travelling, cycling, climbing, and landscape photography.",
    shelves: "Shelves", shelvesDescription: "Hand-picked paths through my notes, projects, and things I keep learning.",
    appleAlt: "Four green apples holding hands and dancing together",
  },
  zh: {
    intro: "你好，我是泓进，即将入读丹麦技术大学计算机科学与工程硕士项目。这里是我的数字花园。🌱",
    projects: "项目", fitness: "健身打卡", about: "关于我", resume: "简历",
    introAria: "个人介绍", greeting: "嗨，我是泓进！",
    lead: "计算机专业学生、攀岩爱好者、风光摄影爱好者。",
    introHeading: "简单介绍", close: "收起 ↑", details: "查看详情 ↓",
    timeline: [
      { year: "2004–2022", title: "中国深圳", text: " — 在阅读中长大，也一直好奇事物如何运作。" },
      { year: "2022–2026", title: "诺丁汉大学计算机科学学士", text: " — 打下了扎实的计算机科学基础，并逐渐对软件工程与应用机器学习产生兴趣。" },
      { year: "2026–现在", title: "丹麦技术大学计算机科学与工程硕士新生", text: " — 希望进一步深入学习人工智能与机器学习，并探索如何将 AI 模型应用于真实场景。" },
    ],
    career: "职业方向", careerText: "：我希望未来成为机器学习工程师或 AI 工程师，用技术解决实际问题，打造实用工具，让人们的生活更轻松。",
    outside: "工作之外", outsideText: "：旅行、骑行、攀岩和风光摄影。",
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

export function BrandLogo() {
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

export function LanguageSwitch({ lang, onChange, mobile = false, inline = false }) {
  return (
    <div className={`tn-lang-switch${mobile ? " tn-lang-switch--mobile" : ""}${inline ? " tn-lang-switch--inline" : ""}`} role="group" aria-label="Language">
      <button type="button" className={lang === "en" ? "active" : ""} onClick={() => onChange("en")} aria-pressed={lang === "en"}>EN</button>
      <span aria-hidden="true">/</span>
      <button type="button" className={lang === "zh" ? "active" : ""} onClick={() => onChange("zh")} aria-pressed={lang === "zh"}>中</button>
    </div>
  );
}

export function SidebarNavIcon({ type }) {
  if (type === "about") return <img className="tn-nav-icon tn-nav-icon--nalong" src="/icons/nalong-thinking.png" alt="" aria-hidden="true" decoding="async" />;
  const common = { className: "tn-nav-icon", viewBox: "0 0 28 28", "aria-hidden": true, focusable: false, fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round", strokeLinejoin: "round" };
  if (type === "projects") return <svg {...common}>
    <path d="M4.1 4.3q0-1.1 1.2-1.1h17.4q1.2 0 1.2 1.2v18.8q0 1.1-1.2 1.1H5.3q-1.2 0-1.2-1.2z" fill="#e8e4f2" />
    <path d="M4.2 8.2h19.5" />
    <circle cx="7.2" cy="6.1" r=".8" fill="#dc816d" stroke="none" />
    <circle cx="10" cy="6.1" r=".8" fill="#edc366" stroke="none" />
    <circle cx="12.8" cy="6.1" r=".8" fill="#85b58c" stroke="none" />
    <path d="M8 12.4v8.2m3.5-7.3-2.1 2.1 2.1 2.1m6.8-4.2 2.1 2.1-2.1 2.1m-1.6-5.2-2.1 6.2" stroke="#547d94" strokeWidth="1.4" />
    <path d="M12.8 12.3h2.3m-2.3 7h3.4" stroke="#d68a63" strokeWidth="1.2" />
  </svg>;
  if (type === "fitness") return <svg {...common}>
    <path d="M5.1 10.1q1.1-.7 2.3-.1l1.1.8v6.4l-1.2.8q-1.2.6-2.2-.2z" fill="#edaa65" />
    <path d="M19.5 10.6 20.7 10q1.2-.6 2.2.2v7.7q-1.1.7-2.3.1l-1.1-.8z" fill="#8fb8bd" />
    <path d="M8.5 13.2q4.6-.8 11.1 0v2.5q-6.3.9-11.1 0z" fill="#f3d57b" />
    <path d="M5.1 10.1q1.1-.7 2.3-.1l1.1.8v6.4l-1.2.8q-1.2.6-2.2-.2zM19.5 10.6 20.7 10q1.2-.6 2.2.2v7.7q-1.1.7-2.3.1l-1.1-.8zM8.5 13.2q4.6-.8 11.1 0v2.5q-6.3.9-11.1 0z" />
    <path d="M4.1 11.3v5.4m19.7-5.4v5.4" />
  </svg>;
  return <svg {...common}>
    <path d="M7 3.8h9.2l5.1 5.1v14.3q0 1.1-1.2 1.1H7q-1.1 0-1.1-1.2V5q0-1.2 1.1-1.2Z" fill="#f6e6b8" />
    <path d="M16.1 3.9v4q0 1.1 1.1 1.1h4" fill="#e8ad67" />
    <path d="M9.3 12.4q4.2-.5 8.8 0M9.3 15.9q2.9-.4 6.2 0m-6.2 3.5q4.3-.4 8.7 0" />
    <path d="m4.8 20.6 1.8-1.1 1.1 1.8-1.9 1.1-1.4.3z" fill="#dc8b6c" />
    <path d="M7 3.8h9.2l5.1 5.1v14.3q0 1.1-1.2 1.1H7q-1.1 0-1.1-1.2V5q0-1.2 1.1-1.2Z" />
  </svg>;
}

export function App() {
  const [accent, setAccent] = useState(() => localStorage.getItem("tn-accent") || ACCENTS[0]);
  const [dark, setDark] = useState(() => localStorage.getItem("tn-dark") === "1");
  const [lang, setLang] = useState(() => localStorage.getItem("ft_lang") || "en");
  const [openProject, setOpenProject] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [emailCopyState, setEmailCopyState] = useState("idle");
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

  useEffect(() => {
    if (!themeOpen) return undefined;
    const onPointerDown = (event) => {
      if (!event.target.closest(".tn-theme-actions, .tn-mobile-actions")) setThemeOpen(false);
    };
    const onKeyDown = (event) => {
      if (event.key === "Escape") setThemeOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [themeOpen]);

  const copyEmail = async () => {
    const email = "hongjin1125@outlook.com";
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const input = document.createElement("textarea");
      input.value = email;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      const copied = document.execCommand("copy");
      input.remove();
      if (!copied) {
        setEmailCopyState("error");
        window.setTimeout(() => setEmailCopyState("idle"), 1800);
        return;
      }
    }
    setEmailCopyState("copied");
    window.setTimeout(() => setEmailCopyState("idle"), 1800);
  };

  const renderThemePicker = (id) => themeOpen && (
    <div className="tn-theme-picker" id={id} role="group" aria-label="Choose theme color">
      {ACCENTS.map((color, index) => (
        <button
          key={color}
          type="button"
          className={`tn-theme-swatch${accent === color ? " active" : ""}`}
          style={{ "--swatch-color": color }}
          title={`${ACCENT_NAMES[index]} theme`}
          aria-label={`Choose ${ACCENT_NAMES[index]} theme`}
          aria-pressed={accent === color}
          onClick={() => { setAccent(color); setThemeOpen(false); }}
        ><i /></button>
      ))}
    </div>
  );

  return (
    <div className={`tn-shell${lang === "zh" ? " language-zh" : ""}`}>
      <header className="tn-mobile-nav">
        <BrandLogo />
        <div className="tn-mobile-actions">
          <button className={`tn-dot${themeOpen ? " open" : ""}`} onClick={() => setThemeOpen(!themeOpen)} aria-label="Choose theme color" aria-haspopup="true" aria-expanded={themeOpen} aria-controls="mobile-theme-picker" data-tooltip="Accent color"><i /></button>
          {renderThemePicker("mobile-theme-picker")}
          <button className="tn-icon-button" onClick={() => setDark(!dark)} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} data-tooltip="Theme">{dark ? <Sun size={24} weight="regular" /> : <Moon size={24} weight="regular" />}</button>
          <button className="tn-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>{menuOpen ? "×" : "☰"}</button>
        </div>
        {menuOpen && <nav className="tn-mobile-menu" aria-label="Mobile primary">
          <a href="#projects" onClick={() => setMenuOpen(false)}><SidebarNavIcon type="projects" />{copy.projects}</a>
          <a href="/fitness-tracker/"><SidebarNavIcon type="fitness" />{copy.fitness}</a>
          <a href="/me/" onClick={() => setMenuOpen(false)}><SidebarNavIcon type="about" />{copy.about}</a>
          <a href="#about" onClick={() => setMenuOpen(false)}><SidebarNavIcon type="resume" />{copy.resume}</a>
          <LanguageSwitch lang={lang} onChange={setLang} mobile />
        </nav>}
      </header>
      <aside className="tn-side">
        <section className="tn-sec tn-sec--brand">
          <BrandLogo />
          <div className="tn-theme-actions">
            <button className={`tn-dot${themeOpen ? " open" : ""}`} onClick={() => setThemeOpen(!themeOpen)} aria-label="Choose theme color" aria-haspopup="true" aria-expanded={themeOpen} aria-controls="desktop-theme-picker" data-tooltip="Accent color"><i /></button>
            {renderThemePicker("desktop-theme-picker")}
            <button className="tn-icon-button" onClick={() => setDark(!dark)} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} data-tooltip="Theme">{dark ? <Sun size={24} weight="regular" /> : <Moon size={24} weight="regular" />}</button>
          </div>
        </section>
        <section className="tn-sec">
          <p>{copy.intro}</p>
        </section>
        <section className="tn-sec tn-sec--nonav">
          <nav className="tn-nav" aria-label={lang === "zh" ? "主导航" : "Primary"}>
            <a href="#projects"><SidebarNavIcon type="projects" />{copy.projects}</a>
            <a href="/fitness-tracker/"><SidebarNavIcon type="fitness" />{copy.fitness}</a>
            <a href="/me/"><SidebarNavIcon type="about" />{copy.about}</a>
            <a href="#about"><SidebarNavIcon type="resume" />{copy.resume}</a>
          </nav>
        </section>
        <section className="tn-sec tn-sec--foot">
          <div className="tn-footer-actions">
            <div className="tn-socials" aria-label="Social links">
              <a href="https://github.com/Hongjin-Lin" target="_blank" rel="noreferrer" aria-label="GitHub" data-tooltip="GitHub"><GithubLogo size={26} weight="regular" /></a>
              <a href="#" aria-label="LinkedIn" data-tooltip="LinkedIn"><LinkedinLogo size={25} weight="regular" /></a>
              <button type="button" className="tn-social-copy" onClick={copyEmail} aria-label={emailCopyState === "copied" ? "Email copied" : "Copy my email"} data-tooltip={emailCopyState === "copied" ? "Email copied!" : emailCopyState === "error" ? "Could not copy" : "Copy my email"}><EnvelopeSimple size={25} weight="regular" /></button>
            </div>
            <LanguageSwitch lang={lang} onChange={setLang} inline />
          </div>
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
          <p className="tn-also"><b>{copy.career}</b>{copy.careerText}</p>
          <p className="tn-also"><b>{copy.outside}</b>{copy.outsideText}</p>
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
