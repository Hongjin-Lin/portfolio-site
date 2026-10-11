import { useEffect, useState } from "react";
import { EnvelopeSimpleIcon as EnvelopeSimple } from "@phosphor-icons/react/dist/csr/EnvelopeSimple";
import { GithubLogoIcon as GithubLogo } from "@phosphor-icons/react/dist/csr/GithubLogo";
import { LinkedinLogoIcon as LinkedinLogo } from "@phosphor-icons/react/dist/csr/LinkedinLogo";
import { MoonIcon as Moon } from "@phosphor-icons/react/dist/csr/Moon";
import { SunIcon as Sun } from "@phosphor-icons/react/dist/csr/Sun";
import { BrandLogo, LanguageSwitch, SidebarNavIcon } from "../App.jsx";

const ACCENTS = ["#b12d6c", "#2456c8", "#2e7d46", "#c26a1f", "#7a4fc9", "#1f7a78"];
const NAMES = ["Rose", "Blue", "Green", "Amber", "Violet", "Teal"];

const COPY = {
  en: {
    projects: "Projects", fitness: "Fitness", about: "About me", resume: "Resume",
    intro: "I am Hongjin, an incoming MSc Computer Science & Engineering student at the Technical University of Denmark 📖.",
    eyebrow: "A LITTLE ABOUT ME", title: "Hey, I'm Hongjin.",
    opening: "I’m an incoming MSc Computer Science & Engineering student at the Technical University of Denmark. I studied Computer Science at the University of Nottingham, where I became especially interested in the systems that make software dependable and useful.",
    second: "I like working across backend engineering and machine learning: understanding a problem, building the pieces behind it, and writing down what I learn along the way.",
    caption: "University of Nottingham · graduation day",
    now: "What I’m doing now", nowText: "Getting ready for my next chapter at DTU, and continuing to explore backend systems, distributed computing, and applied machine learning.",
    background: "A bit of background",
    timeline: [
      { year: "2003–2021", title: "Ningbo, China", text: "Grew up curious about computers, games, and how things work." },
      { year: "2021–2026", title: "University of Nottingham", text: "Studied Computer Science and graduated with a foundation in computing and software engineering." },
      { year: "2026–now", title: "Technical University of Denmark", text: "Preparing to begin an MSc in Computer Science & Engineering." },
    ],
    interests: "Away from the keyboard", interestsText: "I enjoy exploring cities, lifting weights, building with bricks, drinking tea, and keeping this little corner of the internet growing.",
    sayHello: "Say hello", contact: "I’m always happy to talk about software, machine learning, or a good cup of tea.",
    email: "Email me", photoAlt: "Hongjin at his University of Nottingham graduation",
  },
  zh: {
    projects: "项目", fitness: "健身打卡", about: "关于我", resume: "简历",
    intro: "你好，我是泓进，即将入读丹麦技术大学计算机科学与工程硕士项目。📖",
    eyebrow: "关于我", title: "你好，我是泓进。",
    opening: "我即将入读丹麦技术大学计算机科学与工程硕士项目。本科就读于诺丁汉大学计算机科学专业，在学习过程中逐渐对那些让软件可靠、实用的系统产生了浓厚兴趣。",
    second: "我喜欢在后端工程与机器学习之间探索：理解问题、搭建背后的系统，也把一路学到的东西记录下来。",
    caption: "诺丁汉大学 · 毕业日",
    now: "最近在做什么", nowText: "正在为 DTU 的新阶段做准备，也会继续探索后端系统、分布式计算和应用机器学习。",
    background: "我的一些经历",
    timeline: [
      { year: "2003–2021", title: "中国宁波", text: "在好奇心的驱动下长大，喜欢电脑、游戏和研究事物的运行方式。" },
      { year: "2021–2026", title: "诺丁汉大学", text: "学习计算机科学，打下计算与软件工程方面的基础。" },
      { year: "2026–现在", title: "丹麦技术大学", text: "准备开始计算机科学与工程硕士阶段的学习。" },
    ],
    interests: "离开键盘之后", interestsText: "我喜欢在城市里漫游、举铁、拼积木、喝茶，也喜欢慢慢打理这个小小的网络角落。",
    sayHello: "欢迎联系我", contact: "很乐意聊聊软件、机器学习，或者一杯好茶。",
    email: "给我发邮件", photoAlt: "泓进在诺丁汉大学毕业典礼上的照片",
  },
};

export function About() {
  const [accent, setAccent] = useState(() => localStorage.getItem("tn-accent") || ACCENTS[0]);
  const [dark, setDark] = useState(() => localStorage.getItem("tn-dark") === "1");
  const [lang, setLang] = useState(() => localStorage.getItem("ft_lang") || "en");
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
  useEffect(() => { document.title = lang === "zh" ? "关于我 · 泓进" : "About me · Hongjin Lin"; }, [lang]);
  useEffect(() => {
    if (!themeOpen) return undefined;
    const onPointerDown = (event) => {
      if (!event.target.closest(".tn-theme-actions, .tn-mobile-actions")) setThemeOpen(false);
    };
    const onKeyDown = (event) => { if (event.key === "Escape") setThemeOpen(false); };
    document.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [themeOpen]);

  const themePicker = (id) => themeOpen && (
    <div className="tn-theme-picker" id={id} role="group" aria-label="Choose theme color">
      {ACCENTS.map((color, index) => <button key={color} type="button" className={`tn-theme-swatch${accent === color ? " active" : ""}`} style={{ "--swatch-color": color }} aria-label={`Choose ${NAMES[index]} theme`} aria-pressed={accent === color} onClick={() => { setAccent(color); setThemeOpen(false); }}><i /></button>)}
    </div>
  );
  const toggleTheme = () => setThemeOpen((value) => !value);
  const email = "hongjin1125@outlook.com";
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setEmailCopyState("copied");
    } catch {
      const input = document.createElement("textarea");
      input.value = email;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      const copied = document.execCommand("copy");
      input.remove();
      setEmailCopyState(copied ? "copied" : "error");
    }
    window.setTimeout(() => setEmailCopyState("idle"), 1800);
  };
  const navLinks = (mobile = false) => <>
    <a href="/#projects" onClick={() => mobile && setMenuOpen(false)}><SidebarNavIcon type="projects" />{copy.projects}</a>
    <a href="/fitness-tracker/" onClick={() => mobile && setMenuOpen(false)}><SidebarNavIcon type="fitness" />{copy.fitness}</a>
    <a href="/me/" aria-current="page" onClick={() => mobile && setMenuOpen(false)}><SidebarNavIcon type="about" />{copy.about}</a>
    <a href="/#about" onClick={() => mobile && setMenuOpen(false)}><SidebarNavIcon type="resume" />{copy.resume}</a>
  </>;

  return <div className={`tn-shell about-shell${lang === "zh" ? " language-zh" : ""}`}>
    <header className="tn-mobile-nav">
      <BrandLogo />
      <div className="tn-mobile-actions">
        <button className={`tn-dot${themeOpen ? " open" : ""}`} onClick={toggleTheme} aria-label="Choose theme color" aria-haspopup="true" aria-expanded={themeOpen} aria-controls="about-mobile-theme-picker" data-tooltip="Accent color"><i /></button>
        {themePicker("about-mobile-theme-picker")}
        <button className="tn-icon-button" onClick={() => setDark(!dark)} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} data-tooltip="Theme">{dark ? <Sun size={24} /> : <Moon size={24} />}</button>
        <button className="tn-menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation" : "Open navigation"}>{menuOpen ? "×" : "☰"}</button>
      </div>
      {menuOpen && <nav className="tn-mobile-menu" aria-label="Mobile primary">{navLinks(true)}<LanguageSwitch lang={lang} onChange={setLang} mobile /></nav>}
    </header>
    <aside className="tn-side">
      <section className="tn-sec tn-sec--brand"><BrandLogo /><div className="tn-theme-actions">
        <button className={`tn-dot${themeOpen ? " open" : ""}`} onClick={toggleTheme} aria-label="Choose theme color" aria-haspopup="true" aria-expanded={themeOpen} aria-controls="about-desktop-theme-picker" data-tooltip="Accent color"><i /></button>
        {themePicker("about-desktop-theme-picker")}
        <button className="tn-icon-button" onClick={() => setDark(!dark)} aria-label={dark ? "Switch to light theme" : "Switch to dark theme"} data-tooltip="Theme">{dark ? <Sun size={24} /> : <Moon size={24} />}</button>
      </div></section>
      <section className="tn-sec"><p>{copy.intro}</p></section>
      <section className="tn-sec tn-sec--nonav"><nav className="tn-nav" aria-label={lang === "zh" ? "主导航" : "Primary"}>{navLinks()}</nav></section>
      <section className="tn-sec tn-sec--foot"><div className="tn-footer-actions">
        <div className="tn-socials" aria-label="Social links">
          <a href="https://github.com/Hongjin-Lin" target="_blank" rel="noreferrer" aria-label="GitHub" data-tooltip="GitHub"><GithubLogo size={26} /></a>
          <a href="#" aria-label="LinkedIn" data-tooltip="LinkedIn"><LinkedinLogo size={25} /></a>
          <button type="button" className="tn-social-copy" onClick={copyEmail} aria-label="Copy my email" data-tooltip={emailCopyState === "copied" ? "Email copied!" : emailCopyState === "error" ? "Could not copy" : "Copy my email"}><EnvelopeSimple size={25} /></button>
        </div><LanguageSwitch lang={lang} onChange={setLang} inline />
      </div></section>
    </aside>
    <main className="tn-main about-main">
      <article className="about-page">
        <p className="about-eyebrow">{copy.eyebrow}</p>
        <h1>{copy.title}</h1>
        <div className="about-intro">
          <div className="about-copy"><p>{copy.opening}</p><p>{copy.second}</p>
            <a className="about-email" href={`mailto:${email}`}><EnvelopeSimple size={19} />{email}</a>
          </div>
          <figure className="about-portrait"><img src="/images/hongjin-graduation.png" alt={copy.photoAlt} /><figcaption>{copy.caption}</figcaption></figure>
        </div>
        <section className="about-section about-now"><h2>{copy.now}</h2><p>{copy.nowText}</p></section>
        <section className="about-section"><h2>{copy.background}</h2><ol className="about-timeline">{copy.timeline.map((item) => <li key={item.year}><span className="about-year">{item.year}</span><div><h3>{item.title}</h3><p>{item.text}</p></div></li>)}</ol></section>
        <section className="about-section"><h2>{copy.interests}</h2><p>{copy.interestsText}</p></section>
        <section className="about-contact"><h2>{copy.sayHello}</h2><p>{copy.contact}</p><a href={`mailto:${email}`}>{copy.email} <span aria-hidden="true">↗</span></a></section>
      </article>
    </main>
  </div>;
}
