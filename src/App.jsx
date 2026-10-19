import { useEffect, useState } from "react";
import { EnvelopeSimpleIcon as EnvelopeSimple } from "@phosphor-icons/react/dist/csr/EnvelopeSimple";
import { GithubLogoIcon as GithubLogo } from "@phosphor-icons/react/dist/csr/GithubLogo";
import { LinkedinLogoIcon as LinkedinLogo } from "@phosphor-icons/react/dist/csr/LinkedinLogo";
import { MoonIcon as Moon } from "@phosphor-icons/react/dist/csr/Moon";
import { SunIcon as Sun } from "@phosphor-icons/react/dist/csr/Sun";

const ACCENTS = ["#b12d6c", "#2456c8", "#2e7d46", "#c26a1f", "#7a4fc9", "#1f7a78"];

// 共享侧边栏文案（首页 / About 页统一引用，保证一致）
export const SIDEBAR = {
  en: {
    intro: "I am Hongjin, welcome to my personal website!",
    labels: { projects: "Projects", fitness: "Fitness", about: "About me", resume: "Resume" },
  },
  zh: {
    intro: "你好，我是泓进，欢迎来到我的个人网站！",
    labels: { projects: "项目", fitness: "健身", about: "个人介绍", resume: "简历" },
  },
};
const ACCENT_NAMES = ["Rose", "Blue", "Green", "Amber", "Violet", "Teal"];

const PROJECTS = [
  {
    title: "Banana Climbing — AI Efficiency Engineer",
    titleZh: "香蕉攀岩 · AI 提效工程师",
    meta: "2026.4 – 2026.8",
    metaZh: "2026.4 – 2026.8",
    image: "/assets/banana-ai.png",
    brief: "Rebuilt and simplified the company reimbursement process with AI — Aliyun invoice OCR + Qwen structured extraction, enterprise-WeChat approval flow, and ~50k lines of AI-generated production code.",
    briefZh: "利用 AI 能力重构并简化报销流程：接入阿里云发票 OCR 与 Qwen 构建结构化抽取管线，打通企业微信审批，约 5 万行 AI 生成代码生产交付。",
    detail: "Reimbursement redesign: the legacy flow required manually filling ~10 fields per claim and cross-checking expense categories, costing employees half a day to a full day monthly. With mentor guidance, proposed and shipped an \"AI recognition autofill + frequent-item reuse\" refactor — three-table modeling for recipients, claims and claim details; server-side and admin pages; enterprise-WeChat approval integration; private attachment storage with signed temporary links. LLM: an Aliyun invoice OCR + Qwen structured-extraction pipeline — async recognition of amounts, issuers and expense categories with mixed multi-invoice submission; prompt engineering with dynamic injection of configuration candidate trees so the model only picks from existing categories; results written to drafts, fields below 0.8 confidence routed to human review, amount priorities (per-invoice, multi-ticket sum, replacement actual-pay) decided by code. Practiced OpenSpec spec-driven development, tests-alongside, safe database-migration auditing and PR pre-checks — ~50k lines of AI-generated production code. AI automation skills: finance voucher conversion (WeCom approval data auto-converted to vouchers, saving ~1 working day per month) and store scheduling scripts (per-store scheduling from 30 minutes down to 5 minutes via WorkBuddy self-service).",
    detailZh: "报销流程重构：旧流程每笔报销需手动填写约 10 个字段并自查科目，员工每月花费半天到一天。在 mentor 指导下提出并实现「AI 识别回填 + 复用常用项」重构方案：收款人、报销单、报销明细三表建模，开发服务端与后台页面，打通企业微信审批，实现附件私有存储与按需签发临时链接。LLM 应用：接入阿里云发票 OCR 与 Qwen 构建结构化抽取管线，异步识别金额、开票单位与费用科目，一次提交可混合多份材料；通过 prompt engineering 实现提示词动态注入配置候选树，模型只在既有科目内选；识别结果只写入草稿，字段置信度低于 0.8 转人工确认，金额优先级由代码裁决。实践 OpenSpec 规格驱动开发、测试随行、数据库迁移安全审计与 PR 预检，以 AI 生成代码方式完成约 5 万行生产交付。AI 自动化 skills：财务凭证转换（企微审批数据自动转凭证，每月省约 1 个工作日）与门店排班脚本（WorkBuddy 自助生成，单店排班从半小时降到 5 分钟）。",
    result: "Shipped and partially replaced the legacy flow — ~50–100 employees onboard, ~200 orders per month, routine submissions compressed from ~10 steps to 2.",
    resultZh: "上线并部分替换旧流程：约 50–100 名员工使用，月均约 200 单，常规提交由约十步压缩至两步。",
    stack: "Aliyun OCR · Qwen · Prompt Engineering · OpenSpec · Enterprise WeChat · WorkBuddy",
  },
  {
    title: "SEBiGAT — Rumor Detection Research",
    titleZh: "SEBiGAT 谣言检测研究",
    meta: "2025.9 – 2026.8",
    metaZh: "2025.9 – 2026.8",
    image: "/assets/sebigat-architecture.png",
    brief: "A residual gated graph-attention model for rumor detection on Twitter15/16, with XLM-R-enhanced node representations and multi-Agent-rebuilt benchmarks.",
    briefZh: "针对深层图神经网络过平滑问题，引入残差门控机制与双向传播建模，结合 XLM-R 语义增强，并重建 Twitter15/16 缺失原文基准。",
    detail: "Model design: tackled over-smoothing in deep graph neural networks with a residual gating mechanism that dynamically fuses original and aggregated node features, and modeled source-node influence and propagation-path response bidirectionally, enhanced by XLM-R semantic features. Experiment design: a modular PyTorch Geometric framework covering data processing, model training, multi-model comparison and ablations. Dataset rebuild: the official Twitter15/16 tweets lack source posts — orchestrated a multi-Agent workflow (task sharding, code leases, PR-review merges) to reconstruct the hydrated tweets and rebuild the two 4-class benchmarks; code open-sourced.",
    detailZh: "模型设计：针对深层图神经网络过平滑问题，引入残差门控机制动态融合节点原始特征与聚合特征，双向传播建模源节点影响力与传播路径响应，并以 XLM-R 语义特征增强节点表示。实验设计：基于 PyTorch Geometric 开发模块化实验框架，涵盖数据处理、模型训练、多模型对比与消融实验。数据集重建：官方 Twitter15/16 缺失原文，编排多 Agent 工作流（任务分片、代码租约、PR 评审合并）恢复水合推文，重建两个四分类基准；代码开源。",
    result: "Highest average Acc / Macro-F1 among audited methods (95.13 ± 1.30, +2.46pp over BiGCN); reported the non-significant edge over the strongest baseline honestly (p = 0.375).",
    resultZh: "完成审计方法中最高平均 Acc / Macro-F1（95.13±1.30，较 BiGCN +2.46pp）；对最强基线优势未达显著（p=0.375），如实报告。",
    stack: "PyTorch Geometric · XLM-R · Multi-Agent Workflow · Statistical Testing",
  },
  {
    title: "Capital One — AI Performance-Document Analysis",
    titleZh: "Capital One 绩效文档 AI 分析",
    meta: "2024.10 – 2025.6",
    metaZh: "2024.10 – 2025.6",
    image: "/assets/capitalone-ai.jpg",
    brief: "An automated performance-document analysis tool for Capital One UK: PDF conversion, text splitting, topic classification, semantic ranking and anonymization — outputting visualized engineer capability reports.",
    briefZh: "基于 HuggingFace 开源模型为英国 Capital One 总部打造自动化绩效文档分析工具：PDF 转换、文本分割、主题分类、语义排名与匿名化，输出工程师能力可视化分析报告。",
    detail: "As AI team lead, designed a modular NLP pipeline that converts PDF documents into structured analysis — document parsing, sentence splitting, topic classification, composite scoring and topic selection — outputting standardized JSON for frontend visualization. Collected Capital One engineer-annotated data and fine-tuned with LLM-generated synthetic samples, lifting classification accuracy by ~20%. A fine-tuned BERT model performs named entity recognition to automatically anonymize names, organizations and project names, protecting data privacy.",
    detailZh: "作为 AI Team Lead，拆分任务并设计模块化 NLP 流水线，将 PDF 文档转换为结构化分析结果：文档解析、句子分割、主题分类、综合评分、主题选择，输出标准化 JSON 供前端可视化展示。收集 Capital One 工程师标注数据，利用 LLM 生成合成样本微调模型，分类准确率提升约 20%。基于 BERT 微调实现命名实体识别，自动替换人名、组织名、项目名等敏感信息，保障数据隐私安全。",
    result: "The delivered system passed Capital One's business acceptance requirements.",
    resultZh: "最终系统满足 Capital One 业务方验收要求。",
    stack: "HuggingFace · BERT · LLM Fine-tuning · NER · Modular NLP Pipeline",
  },
];

const COPY = {
  en: {
    intro: "I am Hongjin, welcome to my personal website!",
    projects: "Projects", fitness: "Fitness", about: "About me", resume: "Resume",
    introAria: "Introduction", greeting: "Hey, I'm Hongjin!",
    lead: "CS student, climber, landscape photographer.",
    introHeading: "A brief introduction", close: "CLOSE ↑", details: "DETAILS ↓",
    timeline: [
      { year: "2004–2022", title: "Shenzhen, China", text: " — I grew up reading widely and staying curious about how things work." },
      { year: "2022–2026", title: "University of Nottingham, Ningbo China", text: " — Built a strong foundation in computer science, with particular interests in software engineering and applied machine learning." },
      { year: "2026–now", title: "Incoming MSc student in Computer Science & Engineering, Technical University of Denmark", text: " — Looking forward to deepening my knowledge of AI and machine learning, and exploring how to bring AI models into practical, real-world applications." },
    ],
    career: "Career direction", careerText: ": I aspire to become a Machine Learning Engineer or AI Engineer, applying technology to real-world problems and building useful tools that make people’s lives easier.",
    outside: "Outside tech", outsideText: ": Travelling, cycling, climbing, and landscape photography.",
    appleAlt: "Four green apples holding hands and dancing together",
  },
  zh: {
    intro: "你好，我是泓进，欢迎来到我的个人网站！",
    projects: "项目", fitness: "健身", about: "个人介绍", resume: "简历",
    introAria: "个人介绍", greeting: "Hey, I'm Hongjin!",
    lead: "计算机专业学生、攀岩爱好者、摄影爱好者。",
    introHeading: "时间线", close: "收起 ↑", details: "查看详情 ↓",
    timeline: [
      { year: "2004–2022", title: "深圳", text: " — 小时候的我对各种各样的书感兴趣，在知乎上看到" },
      { year: "2022–2026", title: "宁波诺丁汉大学", text: " — 这四年里，我打下了扎实的计算机科学基础，并对用AI推动现实世界的变化产生兴趣。我探索了世界上很多不同的地方，也对自己想要什么变得更加清晰。" },
      { year: "2026–现在", title: "即将入学丹麦科技大学计算机科学与工程硕士项目", text: " — 希望进一步深入学习人工智能与机器学习，并探索如何将 AI 模型应用于真实场景。" },
    ],
    career: "职业方向", careerText: "：我希望未来成为机器学习工程师或 AI 工程师，用技术解决实际问题，打造实用工具，让人们的生活更轻松。",
    outside: "工作之外", outsideText: "：旅行、骑行、攀岩和风光摄影。",
    appleAlt: "四只牵手跳舞的青苹果",
  },
};

function ProjectRow({ project, open, onToggle, lang, copy, onZoom }) {
  const localized = (key) => lang === "zh" ? project[`${key}Zh`] || project[key] : project[key];
  return (
    <article className={`tn-proj${open ? " open" : ""}`}>
      <button type="button" className="thumb" onClick={() => onZoom(project.image)} aria-label="View larger image">
        <img src={project.image} alt="" loading="lazy" />
      </button>
      <div className="body">
        <div className="titlerow">
          <h3>{localized("title")}</h3>
          <span className="meta">{localized("meta")}</span>
        </div>
        <p className="brief">{localized("brief")}</p>
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
  const [zoom, setZoom] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [themeOpen, setThemeOpen] = useState(false);
  const [emailCopyState, setEmailCopyState] = useState("idle");
  const copy = COPY[lang];

  useEffect(() => {
    if (!zoom) return undefined;
    const onKey = (e) => { if (e.key === "Escape") setZoom(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom]);

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
          <a href="#projects" onClick={() => setMenuOpen(false)}><SidebarNavIcon type="projects" />{SIDEBAR[lang].labels.projects}</a>
          <a href="/fitness-tracker/"><SidebarNavIcon type="fitness" />{SIDEBAR[lang].labels.fitness}</a>
          <a href="/me/" onClick={() => setMenuOpen(false)}><SidebarNavIcon type="about" />{SIDEBAR[lang].labels.about}</a>
          <a href="#about" onClick={() => setMenuOpen(false)}><SidebarNavIcon type="resume" />{SIDEBAR[lang].labels.resume}</a>
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
          <p>{SIDEBAR[lang].intro}</p>
        </section>
        <section className="tn-sec tn-sec--nonav">
          <nav className="tn-nav" aria-label={lang === "zh" ? "主导航" : "Primary"}>
            <a href="#projects"><SidebarNavIcon type="projects" />{SIDEBAR[lang].labels.projects}</a>
            <a href="/fitness-tracker/"><SidebarNavIcon type="fitness" />{SIDEBAR[lang].labels.fitness}</a>
            <a href="/me/"><SidebarNavIcon type="about" />{SIDEBAR[lang].labels.about}</a>
            <a href="#about"><SidebarNavIcon type="resume" />{SIDEBAR[lang].labels.resume}</a>
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
          <section id="projects" className="tn-projects">
            <h2>{SIDEBAR[lang].labels.projects}</h2>
            {PROJECTS.map((p, i) => (
              <ProjectRow key={p.title} project={p} open={openProject === i} onToggle={() => setOpenProject((v) => (v === i ? null : i))} lang={lang} copy={copy} onZoom={setZoom} />
            ))}
          </section>
        </div>
      </main>
      {zoom && (
        <div className="tn-lightbox" role="dialog" aria-modal="true" aria-label="Enlarged image" onClick={() => setZoom(null)}>
          <img src={zoom} alt="" />
        </div>
      )}
    </div>
  );
}
