import { useEffect, useRef, useState } from "react";

const content = {
  en: {
    nav: { about: "About", projects: "Projects", resume: "Résumé" },
    headline: <>Building the foundations for <em>intelligent</em> products.</>,
    about: [
      [
        "I’m a backend developer and machine learning engineer who enjoys turning ideas into systems people can rely on.",
        "I care about clear design, testable code, and shipping features that make a real impact.",
      ],
      [
        "I recently graduated with a B.S. in Computer Science, where I focused on distributed systems and applied machine learning.",
        "I’m looking for a team where I can contribute, keep learning, and help build products that scale.",
      ],
    ],
    available: "Available",
    availability: "Open to full-time Backend, AI, and ML engineering roles.",
    projectsTitle: "Projects",
    viewProject: "View project",
    footer: "Designed & built by Alex Chen",
  },
  zh: {
    nav: { about: "关于我", projects: "项目", resume: "简历" },
    headline: <>为智能产品，构建<em>可靠基石</em>。</>,
    about: [
      [
        "我是一名后端开发与机器学习工程师，喜欢把想法变成真正可靠、可以持续运行的系统。",
        "我重视清晰的设计、可测试的代码，以及能够带来真实价值的产品体验。",
      ],
      [
        "我刚刚取得计算机科学学士学位，主要关注分布式系统与机器学习的实际应用。",
        "我希望加入一个能够贡献所长、持续学习，并一起打造可规模化产品的团队。",
      ],
    ],
    available: "求职中",
    availability: "正在寻找后端、AI 或机器学习工程师的全职机会。",
    projectsTitle: "项目",
    viewProject: "查看项目",
    footer: "由 Alex Chen 设计并开发",
  },
};

const projects = [
  {
    number: "01",
    category: { en: "LLM Systems", zh: "大语言模型系统" },
    title: { en: "RAG Knowledge Assistant", zh: "RAG 知识助手" },
    description: {
      en: "A retrieval-augmented assistant that answers questions over private documents with citations. Built with a modular ingestion pipeline, hybrid retrieval, and evaluation tooling.",
      zh: "一个面向私有文档、能够提供引用来源的检索增强助手，包含模块化数据管线、混合检索和评估工具。",
    },
    result: { en: "Reduced hallucinations by 38% on a curated evaluation set.", zh: "在自建评估集上将模型幻觉率降低了 38%。" },
    stack: "Python · FastAPI · PostgreSQL · pgvector · LangChain · Docker",
    image: "/assets/rag-evaluation.png",
    alt: { en: "RAG evaluation dashboard showing answer quality scores and evaluation history", zh: "展示回答质量评分与历史记录的 RAG 评估面板" },
  },
  {
    number: "02",
    category: { en: "API & Recommendation", zh: "API 与推荐系统" },
    title: { en: "Real-time Recommendation API", zh: "实时推荐 API" },
    description: {
      en: "A low-latency recommendation service using collaborative filtering and content signals, exposed through a typed API with streaming updates and built-in experiments.",
      zh: "结合协同过滤与内容信号的低延迟推荐服务，通过类型安全的 API 提供流式更新和内置实验能力。",
    },
    result: { en: "Kept P99 latency at 128ms while serving 2.5k requests per second.", zh: "在每秒处理 2,500 次请求时，将 P99 延迟保持在 128ms。" },
    stack: "Python · gRPC · Redis · ClickHouse · Prometheus · Kubernetes",
    image: "/assets/recommendation-api.png",
    alt: { en: "Recommendation API observability dashboard showing latency, requests, and error rate", zh: "展示延迟、请求量和错误率的推荐 API 可观测面板" },
  },
  {
    number: "03",
    category: { en: "Infrastructure", zh: "基础设施" },
    title: { en: "Distributed Task Queue", zh: "分布式任务队列" },
    description: {
      en: "A fault-tolerant task queue with delayed scheduling, retries, and rate limiting. Designed for horizontal scale and observable by default.",
      zh: "支持延迟调度、自动重试和速率限制的容错任务队列，为水平扩展而设计，并默认具备可观测性。",
    },
    result: { en: "Achieved 99.95% successful completion across a three-node cluster.", zh: "在三节点集群中实现了 99.95% 的任务成功完成率。" },
    stack: "Go · NATS · PostgreSQL · Redis · Docker · Kubernetes",
    image: "/assets/task-queue.png",
    alt: { en: "Distributed task queue dashboard showing worker topology, throughput, and queue depth", zh: "展示工作节点拓扑、吞吐量和队列深度的分布式任务面板" },
  },
];

function Project({ project, language, labels }) {
  return (
    <article className="project">
      <div className="project__number" aria-hidden="true">{project.number}</div>
      <div className="project__copy">
        <p className="eyebrow"><span />{project.category[language]}</p>
        <h3>{project.title[language]}</h3>
        <p>{project.description[language]}</p>
        <p className="project__result">{project.result[language]}</p>
        <div className="project__links">
          <a href="#project-details">{labels.viewProject}</a>
          <a href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
        </div>
        <p className="project__stack">{project.stack}</p>
      </div>
      <a className="project__media" href="#project-details" aria-label={`${labels.viewProject}: ${project.title[language]}`}>
        <img src={project.image} alt={project.alt[language]} />
      </a>
    </article>
  );
}

export function App() {
  const [language, setLanguage] = useState("en");
  const glowRef = useRef(null);
  const text = content[language];

  useEffect(() => {
    document.documentElement.lang = language === "zh" ? "zh-CN" : "en";
  }, [language]);

  useEffect(() => {
    const glow = glowRef.current;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!glow || reducedMotion.matches) return undefined;

    let frame = 0;
    const moveGlow = (event) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        glow.style.transform = `translate3d(${event.clientX - 380}px, ${event.clientY - 380}px, 0)`;
        glow.dataset.active = "true";
      });
    };
    const dimGlow = () => { glow.dataset.active = "false"; };

    window.addEventListener("pointermove", moveGlow, { passive: true });
    document.documentElement.addEventListener("mouseleave", dimGlow);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", moveGlow);
      document.documentElement.removeEventListener("mouseleave", dimGlow);
    };
  }, []);

  return (
    <div className={`site-shell language-${language}`}>
      <div className="side-rail" aria-hidden="true"><i /><i /><i /></div>
      <img className="tech-field" src="/assets/tech-field.png" alt="" aria-hidden="true" />
      <img ref={glowRef} className="cursor-glow" src="/assets/cursor-glow.png" alt="" aria-hidden="true" />
      <img className="path-line" src="/assets/path-line-transparent.png" alt="" aria-hidden="true" />
      <header className="site-header">
        <a className="wordmark" href="#about">Alex Chen</a>
        <nav aria-label={language === "zh" ? "主导航" : "Primary navigation"}>
          <a href="#about">{text.nav.about}</a>
          <a href="#projects">{text.nav.projects}</a>
          <a href="#resume">{text.nav.resume}</a>
          <a className="github-link" href="https://github.com/" target="_blank" rel="noreferrer">GitHub</a>
          <div className="language-toggle" aria-label={language === "zh" ? "语言选择" : "Language selector"}>
            <button type="button" className={language === "en" ? "active" : ""} onClick={() => setLanguage("en")} aria-pressed={language === "en"}>EN</button>
            <span aria-hidden="true">/</span>
            <button type="button" className={language === "zh" ? "active" : ""} onClick={() => setLanguage("zh")} aria-pressed={language === "zh"}>中文</button>
          </div>
        </nav>
      </header>
      <main>
        <section className="about" id="about">
          <h1>{text.headline}</h1>
          <div className="about__copy">
            {text.about.map((column, index) => <div key={index}>{column.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>)}
          </div>
          <div className="availability"><span aria-hidden="true" /><strong>{text.available}</strong><small>{text.availability}</small></div>
        </section>
        <section className="projects" id="projects">
          <h2>{text.projectsTitle}</h2>
          <div className="project-list">{projects.map((project) => <Project key={project.number} project={project} language={language} labels={text} />)}</div>
        </section>
      </main>
      <footer id="resume"><p>{text.footer}</p><a href="mailto:alex.chen@example.com">alex.chen@example.com</a></footer>
      <span id="project-details" className="anchor-target" aria-hidden="true" />
    </div>
  );
}
