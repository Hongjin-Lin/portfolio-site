import { useEffect, useState } from "react";
import { EnvelopeSimpleIcon as EnvelopeSimple } from "@phosphor-icons/react/dist/csr/EnvelopeSimple";
import { GithubLogoIcon as GithubLogo } from "@phosphor-icons/react/dist/csr/GithubLogo";
import { LinkedinLogoIcon as LinkedinLogo } from "@phosphor-icons/react/dist/csr/LinkedinLogo";
import { MoonIcon as Moon } from "@phosphor-icons/react/dist/csr/Moon";
import { SunIcon as Sun } from "@phosphor-icons/react/dist/csr/Sun";
import { BrandLogo, LanguageSwitch, SidebarNavIcon, SIDEBAR } from "../App.jsx";

const ACCENTS = ["#b12d6c", "#2456c8", "#2e7d46", "#c26a1f", "#7a4fc9", "#1f7a78"];
const NAMES = ["Rose", "Blue", "Green", "Amber", "Violet", "Teal"];

const COPY = {
  en: {
    pageTitle: "About me",
    bio1: "Hi, I'm Hongjin! Welcome to my website! I'm planning to share some of my thoughts, photos, and interesting projects here.",
    bio2: "I'm currently a Computer Science student, about to join DTU (Technical University of Denmark) for my master's degree.",
    bio3: "I'm enthusiastic about using AI to help people boost their productivity — I want to understand everything from the model side to the application side and put it to work in real projects.",
    bio4: "In my free time I enjoy rock climbing, fitness, traveling, photography, and cycling. I love exploring different corners of the world and capturing the scenery I see along the way.",
    contactHeading: "Contact",
    contactText: "Feel free to send me an email :)",
    email: "Email me",
    githubLabel: "GitHub",
    photoAlt: "Hongjin at his University of Nottingham graduation",
  },
  zh: {
    pageTitle: "个人介绍",
    bio1: "你好，我是泓进！欢迎来到我的网站！我打算在这里分享一些我的想法、照片和有趣的项目。",
    bio2: "我目前是一名计算机科学专业的学生，即将前往丹麦技术大学（DTU）攻读硕士学位。",
    bio3: "我对用 AI 帮助人们提升效率充满热情——我希望掌握从模型端到应用端的知识，并把它们应用到实际工作中。",
    bio4: "闲暇时我喜欢攀岩、健身、旅行、摄影和骑自行车。我喜欢探索世界上不同的角落，并记录下所见的风景。",
    contactHeading: "联系方式",
    contactText: "欢迎随时给我发邮件 :)",
    email: "给我发邮件",
    githubLabel: "GitHub",
    photoAlt: "泓进在诺丁汉大学毕业典礼上的照片",
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
    <a href="/#projects" onClick={() => mobile && setMenuOpen(false)}><SidebarNavIcon type="projects" />{SIDEBAR[lang].labels.projects}</a>
    <a href="/me/" aria-current="page" onClick={() => mobile && setMenuOpen(false)}><SidebarNavIcon type="about" />{SIDEBAR[lang].labels.about}</a>
    <a href="/#about" onClick={() => mobile && setMenuOpen(false)}><SidebarNavIcon type="resume" />{SIDEBAR[lang].labels.resume}</a>
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
      <section className="tn-sec"><p>{SIDEBAR[lang].intro}</p></section>
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
        <h1 className="about-title"><img className="about-title-icon" src="/icons/nalong-thinking.png" alt="" aria-hidden="true" />{copy.pageTitle}</h1>
        <div className="about-intro">
          <div className="about-copy">
            <p>{copy.bio1}</p>
            <p>{copy.bio2}</p>
            <p>{copy.bio3}</p>
            <p>{copy.bio4}</p>
            <a className="about-email" href={`mailto:${email}`}><EnvelopeSimple size={19} />{email}</a>
          </div>
          <figure className="about-portrait"><img src="/images/hongjin-graduation.png" alt={copy.photoAlt} width="1024" height="1536" fetchPriority="high" /></figure>
        </div>
        <section className="about-contact">
          <h2>{copy.contactHeading}</h2>
          <p>{copy.contactText}</p>
          <ul className="about-contact-list">
            <li><a href={`mailto:${email}`}>{copy.email}: hongjin1125@outlook.com</a></li>
            <li><a href="https://github.com/Hongjin-Lin" target="_blank" rel="noreferrer">{copy.githubLabel}: github.com/Hongjin-Lin <span aria-hidden="true">↗</span></a></li>
          </ul>
        </section>
      </article>
    </main>
  </div>;
}
