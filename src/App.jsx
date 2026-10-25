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
    labels: { projects: "Projects", about: "About me", resume: "Resume" },
  },
  zh: {
    intro: "你好，我是泓进，欢迎来到我的个人网站！",
    labels: { projects: "项目", about: "个人介绍", resume: "简历" },
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
    briefZh: "在这段实习中我主要的职责是发现员工日常流程中可以用AI提效的地方，并提出相应的解决方案并落地。在公司内部的问卷调查中发现，报销与手动排班占据了店长与普通员工每周半天到一天的时间，于是我提出利用LLM识别附件以及复用常用项的方案重构员工报销流程，并帮助其他员工开发 AI skills （如排班脚本）来帮助他们提高工作效率。",
    detail: "Reimbursement redesign: the legacy flow required manually filling ~10 fields per claim and cross-checking expense categories, costing employees half a day to a full day monthly. With mentor guidance, proposed and shipped an \"AI recognition autofill + frequent-item reuse\" refactor — three-table modeling for recipients, claims and claim details; server-side and admin pages; enterprise-WeChat approval integration; private attachment storage with signed temporary links. LLM: an Aliyun invoice OCR + Qwen structured-extraction pipeline — async recognition of amounts, issuers and expense categories with mixed multi-invoice submission; prompt engineering with dynamic injection of configuration candidate trees so the model only picks from existing categories; results written to drafts, fields below 0.8 confidence routed to human review, amount priorities (per-invoice, multi-ticket sum, replacement actual-pay) decided by code. Practiced OpenSpec spec-driven development, tests-alongside, safe database-migration auditing and PR pre-checks — ~50k lines of AI-generated production code. AI automation skills: finance voucher conversion (WeCom approval data auto-converted to vouchers, saving ~1 working day per month) and store scheduling scripts (per-store scheduling from 30 minutes down to 5 minutes via WorkBuddy self-service).",
    detailZh: "- 核心贡献：梳理旧流程并与财务对齐字段和配置，提出并实现「AI 识别回填 + 复用常用项」重构方案。在 mentor 指导下，完成收款人、报销单、报销明细三表建模，开发服务端与后台页面，打通企业微信审批，实现附件私有存储与按需签发临时链接。 - LLM 应用：接入阿里云发票 OCR 与 Qwen3.7 构建结构化抽取管线，异步识别金额、开票单位与费用科目，一次提交可混合多份材料；每次调用按当前报销配置生成科目候选清单注入提示词，模型只在候选内分类，返回结果由代码回验后采纳。 - 实践规格驱动开发：需求先设计规格与执行计划，再实现，仓库使用OpenSpec管理规格与归档。实习期以 AI 生成代码方式完成约 5 万行生产交付。 - 结果：上线并部分替换旧流程，约 50–100 名员工使用、月均约 200 单，常规提交由约十步压缩至两步。",
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
    briefZh: "该项目为我的毕业论文项目，确立研究方向后，我从零学习了深度学习与图神经网络相关知识，在阅读大量文献后，发现提高模型准确率的主要方向分别是改进模型与丰富每个节点的信息。于是针对深层图神经网络易过平滑问题，我引入残差门控机制与图注意力神经网络，并且通过拼接投影后情感信息的方式来增强节点。在被AAAI拒稿后，目前我在进一步修改论文，以期发表于期刊中。",
    detail: "Model design: tackled over-smoothing in deep graph neural networks with a residual gating mechanism that dynamically fuses original and aggregated node features, and modeled source-node influence and propagation-path response bidirectionally, enhanced by XLM-R semantic features. Experiment design: a modular PyTorch Geometric framework covering data processing, model training, multi-model comparison and ablations. Dataset rebuild: the official Twitter15/16 tweets lack source posts — orchestrated a multi-Agent workflow (task sharding, code leases, PR-review merges) to reconstruct the hydrated tweets and rebuild the two 4-class benchmarks; code open-sourced.",
    detailZh: " - 数据分析：在三个数据集上进行情感分析实证研究，揭露谣言和非谣言在情感模式上的传播差异。 - 模型设计：针对深层图神经网络过平滑问题，引入残差门控机制动态融合节点原始特征与聚合特征；通过拼接投影后的三维情感向量增强节点特征；采用动态注意力机制聚合节点特征，得到最终图特征。 - 实验设计：基于 PyTorch Geometric 开发模块化实验框架，涵盖数据处理、模型训练、多模型对比与消融实验。 - 结果：在受控实验协议下，提出的模型在 Weibo、Twitter15、Twitter16 数据集上达到最高平均准确度。",
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
    briefZh: "该项目为我在英国诺丁汉交换期间软件工程课程。我们承接了 Capital One 银行欧洲总部的一位工程师经理的需求，该经理在每年年终的时候需要人工逐份阅读多位工程师的年终绩效文档从中挖掘可以作为工程师激励或下一年努力方向的insights，耗时数天，于是寻求数据不出内网的AI分析方案。我们小组基于 HuggingFace 开源 AI 模型开发了自动化绩效文档分析工具，实现 PDF 文档转换、文本分割、主题分类、语义排名与匿名化，最终输出工程师能力的可视化分析报告。",
    detail: "As AI team lead, designed a modular NLP pipeline that converts PDF documents into structured analysis — document parsing, sentence splitting, topic classification, composite scoring and topic selection — outputting standardized JSON for frontend visualization. Collected Capital One engineer-annotated data and fine-tuned with LLM-generated synthetic samples, lifting classification accuracy by ~20%. A fine-tuned BERT model performs named entity recognition to automatically anonymize names, organizations and project names, protecting data privacy.",
    detailZh: "- 核心贡献：作为 AI team lead，拆分任务并设计模块化 NLP 流水线，将 PDF 文档转换为结构化分析结果，包含文档解析、句子分割、主题分类、综合评分、主题选择等阶段，输出标准化 JSON 供前端可视化展示。 - 针对部分主题定义模糊导致分类准确率不足的问题，收集 Capital One 工程师标注数据作为测试数据集，支撑模型选型与主题描述文本改写。 - 利用 BERT 微调模型实现命名实体识别，自动替换人名、组织名、项目名等敏感信息，保障数据隐私安全。最终系统满足 Capital One 业务方验收要求。",
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
    bio1: "Hi, I'm Hongjin! Welcome to my website! I'm planning to share some of my thoughts, photos, and interesting projects here.",
    bio2: "I'm currently a Computer Science student, about to join DTU (Technical University of Denmark) for my master's degree.",
    bio3: "I'm very interested in using AI to help people improve their productivity, and I want to master everything from the model side to the application side and put it to work in real projects.",
    bio4: "In my free time I enjoy rock climbing, fitness, traveling, photography, and cycling. I love exploring different corners of the world and capturing the scenery I see along the way.",
    close: "CLOSE ↑", details: "DETAILS ↓",
    career: "Career direction", careerText: "：我的希望未来成为机器学习工程师或 AI 工程师，用技术解决实际问题，打造实用工具，让人们的生活更轻松。",
    appleAlt: "Four green apples holding hands and dancing together",
  },
  zh: {
    intro: "你好，我是泓进，欢迎来到我的个人网站！",
    projects: "项目", fitness: "健身", about: "个人介绍", resume: "简历",
    introAria: "个人介绍", greeting: "Hey, I'm Hongjin!",
    lead: "计算机专业学生、攀岩爱好者、摄影爱好者。",
    bio1: "你好，我是泓进！欢迎来到我的网站！我打算在这里分享一些我的想法、照片和有趣的项目。",
    bio2: "我目前是一名计算机科学专业的学生，即将前往丹麦技术大学（DTU）攻读硕士学位。",
    bio3: "我对用 AI 帮助人们提升效率很感兴趣，我希望掌握从模型端到应用端的知识，并把它们应用到实际工作中。",
    bio4: "闲暇时我喜欢攀岩、健身、旅行、摄影和骑自行车。我喜欢探索世界上不同的角落，并记录下所见的风景。",
    close: "收起 ↑", details: "查看详情 ↓",
    career: "职业方向", careerText: "：我希望未来成为机器学习工程师或 AI 工程师，用技术解决实际问题，打造实用工具，让人们的生活更轻松。",
    appleAlt: "四只牵手跳舞的青苹果",
  },
};

function ProjectRow({ project, open, onToggle, lang, copy, onZoom }) {
  const localized = (key) => lang === "zh" ? project[`${key}Zh`] || project[key] : project[key];
  return (
    <article className={`tn-proj${open ? " open" : ""}`} onClick={onToggle}>
      <button type="button" className="thumb" onClick={(e) => { e.stopPropagation(); onZoom(project.image); }} aria-label="View larger image">
        <img src={project.image} alt="" loading="lazy" />
      </button>
      <div className="body">
        <div className="titlerow">
          <h3>{localized("title")}</h3>
          <span className="meta">{localized("meta")}</span>
        </div>
        <p className="brief">{localized("brief")}</p>
      </div>
      <button className="toggle" onClick={(e) => { e.stopPropagation(); onToggle(); }} aria-expanded={open}>{open ? copy.close : copy.details}</button>
      <div className="detail" onClick={(e) => e.stopPropagation()}><div className="inner"><div className="pad">
        {localized("detail").split("- ").map((seg) => seg.trim()).filter(Boolean).map((point, i) => (
          <p className="detail-point" key={i}><span className="dash" aria-hidden="true">-</span>{point}</p>
        ))}
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
          <div className="tn-bio">
            <p>{copy.bio1}</p>
            <p>{copy.bio2}</p>
            <p>{copy.bio3}</p>
            <p>{copy.bio4}</p>
          </div>
          <p className="tn-also"><b>{copy.career}</b>{copy.careerText}</p>
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
