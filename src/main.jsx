import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Anchor, ArrowDown, ArrowRight, ArrowUpRight, Award, BriefcaseBusiness,
  ChevronLeft, ChevronRight, Compass, HardHat, Mail, MapPin, Menu,
  Phone, ShieldCheck, Ship, X
} from "lucide-react";
import "./style.css";

const profile = {
  name: "Farazul Haque",
  role: "Maritime • Fire & Safety Professional",
  location: "[City, Country]",
  email: "[your.email@example.com]",
  phone: "[+91 XXXXX XXXXX]",
  summary: "A safety-focused professional with an interest in maritime operations, emergency response, and operational readiness. Replace this introduction with a short, authentic summary of your experience, strengths, and career goals.",
  availability: "OPEN TO PROFESSIONAL OPPORTUNITIES"
};

const experience = [
  { period: "[Month YYYY – Present]", title: "[Current role / designation]", company: "[Company / Organization]", detail: "Add a concise description of your responsibilities, operational environment, and measurable contributions." },
  { period: "[Month YYYY – Month YYYY]", title: "[Previous role / training]", company: "[Company / Institution]", detail: "Describe relevant duties, practical exposure, projects, or training completed." }
];

const qualifications = [
  { title: "[Qualification / Degree]", place: "[Institution]", year: "[Year]" },
  { title: "[Professional Certificate]", place: "[Training provider]", year: "[Year]" },
  { title: "[Safety / Maritime Training]", place: "[Training provider]", year: "[Year]" }
];

const skills = [
  { icon: ShieldCheck, title: "Fire & Safety", items: ["Fire prevention", "Emergency response", "PPE & SCBA", "Risk awareness"] },
  { icon: Ship, title: "Maritime Operations", items: ["Shipboard familiarization", "Deck operations", "Safety procedures", "Operational discipline"] },
  { icon: HardHat, title: "Professional Skills", items: ["Team coordination", "Situational awareness", "Communication", "Safety documentation"] }
];

// Add image files to public/gallery and update these paths and captions.
// The first three entries are placeholders until Farazul's final photo selection is confirmed.
const gallery = [
  { src: "/images/hero-firefighter.jpg", title: "Fire & Rescue Protective Equipment", category: "FIRE & SAFETY" },
  { src: "/gallery/orange-uniform-portrait.jpg", title: "Professional Portrait", category: "PROFILE" },
  { src: "/gallery/ship-deck.jpg", title: "Maritime Ship Visit", category: "MARITIME" },
  { src: "/gallery/white-cap.jpg", title: "Maritime Uniform & Cap", category: "UNIFORM" },
  { src: "/gallery/bridge-operations.png", title: "Bridge & Navigation Familiarization", category: "OPERATIONS" }
];

function Header() {
  const [open, setOpen] = useState(false);
  const links = ["About", "Experience", "Expertise", "Gallery", "Contact"];
  return <header className="site-header">
    <a className="brand" href="#home" aria-label="Farazul Haque home">FH<span>.</span></a>
    <button className="mobile-menu" onClick={() => setOpen(!open)} aria-label="Toggle menu">{open ? <X/> : <Menu/>}</button>
    <nav className={open ? "navigation is-open" : "navigation"}>
      {links.map(label => <a key={label} href={`#${label.toLowerCase()}`} onClick={() => setOpen(false)}>{label}</a>)}
      <a className="nav-contact" href={`mailto:${profile.email}`}>Get in touch <ArrowUpRight size={14}/></a>
    </nav>
  </header>;
}

function Reveal({ children, className = "" }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = document.getElementById(children?.props?.id || "");
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div className={`reveal ${visible ? "revealed" : ""} ${className}`}>{children}</div>;
}

function SectionHeading({ index, eyebrow, title, note }) {
  return <div className="section-heading">
    <div><span className="eyebrow">{index} / {eyebrow}</span><h2>{title}</h2></div>
    {note && <p>{note}</p>}
  </div>;
}

function Hero() {
  return <section className="hero section-wrap" id="home">
    <div className="hero-copy">
      <div className="availability"><i/> {profile.availability}</div>
      <p className="hero-kicker">PROFESSIONAL PORTFOLIO <span>— 2026</span></p>
      <h1>Farazul<br/><em>Haque.</em></h1>
      <p className="hero-role">{profile.role}</p>
      <p className="hero-intro">{profile.summary}</p>
      <div className="hero-actions">
        <a className="button button-primary" href="#experience">Explore profile <ArrowDown size={16}/></a>
        <a className="text-link" href={`mailto:${profile.email}`}>Contact me <ArrowUpRight size={16}/></a>
      </div>
      <div className="hero-meta"><span><MapPin size={14}/> {profile.location}</span><span><Anchor size={14}/> SAFETY • DISCIPLINE • READINESS</span></div>
    </div>
    <div className="hero-visual">
      <div className="visual-frame">
        <img src="/images/hero-firefighter.jpg" alt="Farazul in fire and rescue protective equipment" onError={e => {e.currentTarget.style.display="none";}}/>
        <div className="image-fallback"><ShieldCheck size={54}/><span>ADD HERO PHOTOGRAPH</span><small>Replace public/images/hero-firefighter.jpg</small></div>
        <div className="visual-stamp"><span>FH</span><small>PROFESSIONAL<br/>PROFILE</small></div>
      </div>
      <div className="visual-caption"><span>01 — FIELD EXPERIENCE</span><span>SCROLL TO EXPLORE ↓</span></div>
      <div className="orbit orbit-one"></div><div className="orbit orbit-two"></div>
    </div>
  </section>;
}

function About() {
  return <section className="section-wrap section-block" id="about">
    <SectionHeading index="01" eyebrow="ABOUT" title={<>Prepared for<br/><em>what matters.</em></>} note="A personal introduction grounded in professional values, practical experience and a commitment to safety."/>
    <div className="about-grid">
      <div className="about-mark"><Compass size={42}/><span>FOCUS / 001</span></div>
      <div className="about-content"><p className="lead">{profile.summary}</p><p>Use this space to explain your professional journey, the environments you have worked in, the training that shaped you, and the kind of opportunities you are looking for. Keep the final version factual and personal.</p><div className="fact-row"><div><small>BASED IN</small><b>{profile.location}</b></div><div><small>FIELD</small><b>Maritime & Safety</b></div><div><small>PROFILE</small><b>Professional</b></div></div></div>
    </div>
  </section>;
}

function Experience() {
  return <section className="section-wrap section-block" id="experience">
    <SectionHeading index="02" eyebrow="CAREER JOURNEY" title={<>Experience &<br/><em>training.</em></>} note="A clear timeline of professional roles, practical training and milestones."/>
    <div className="timeline">{experience.map((item, i) => <article className="timeline-item" key={i}><div className="timeline-date">{item.period}</div><div className="timeline-dot"></div><div className="timeline-copy"><span className="eyebrow">0{i+1} — EXPERIENCE</span><h3>{item.title}</h3><h4>{item.company}</h4><p>{item.detail}</p></div></article>)}</div>
    <div className="qualifications"><h3>Qualifications & certifications</h3><div className="qualification-grid">{qualifications.map((q,i)=><div className="qualification" key={i}><Award size={18}/><div><b>{q.title}</b><span>{q.place}</span></div><small>{q.year}</small></div>)}</div></div>
  </section>;
}

function Expertise() {
  return <section className="section-wrap section-block" id="expertise">
    <SectionHeading index="03" eyebrow="CORE CAPABILITIES" title={<>Knowledge in<br/><em>practice.</em></>} note="Edit these capability groups to accurately reflect completed courses, certifications and demonstrated skills."/>
    <div className="skill-grid">{skills.map((group,i)=>{const Icon=group.icon;return <article className="skill-card" key={group.title}><div className="skill-top"><span>0{i+1}</span><Icon size={25}/></div><h3>{group.title}</h3><div className="skill-tags">{group.items.map(item=><span key={item}>{item}</span>)}</div></article>})}</div>
  </section>;
}

function Gallery() {
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("ALL");
  const categories = ["ALL", ...new Set(gallery.map(x=>x.category))];
  const shown = filter === "ALL" ? gallery : gallery.filter(x=>x.category===filter);
  useEffect(() => {
    const onKey = e => { if(e.key==="Escape") setSelected(null); };
    window.addEventListener("keydown",onKey); return ()=>window.removeEventListener("keydown",onKey);
  }, []);
  return <section className="section-wrap section-block" id="gallery">
    <SectionHeading index="04" eyebrow="PHOTO JOURNAL" title={<>Moments from<br/><em>the field.</em></>} note="A curated collection of training, maritime environments and professional moments."/>
    <div className="gallery-filters">{categories.map(c=><button className={filter===c?"active":""} key={c} onClick={()=>setFilter(c)}>{c}</button>)}</div>
    <div className="gallery-grid">{shown.map((item,i)=><button className={`gallery-item gallery-item-${i%3}`} key={item.src} onClick={()=>setSelected(item)}><img src={item.src} alt={item.title} onError={e=>{e.currentTarget.style.display="none";}}/><div className="gallery-placeholder"><span>{item.category}</span><b>{item.title}</b><small>ADD PHOTO: {item.src}</small></div><div className="gallery-overlay"><span>{item.category}</span><b>{item.title}</b><ArrowUpRight size={20}/></div></button>)}</div>
    {selected && <div className="lightbox" role="dialog" aria-modal="true" onClick={()=>setSelected(null)}><button aria-label="Close image" className="lightbox-close"><X/></button><img src={selected.src} alt={selected.title}/><p>{selected.title}</p></div>}
  </section>;
}

function Contact() {
  return <section className="contact-section" id="contact">
    <div className="contact-background"><img src="/images/contact-background.jpg" alt="" onError={e=>{e.currentTarget.style.display="none";}}/></div>
    <div className="contact-shade"></div>
    <div className="section-wrap contact-content">
      <span className="eyebrow">05 / CONTACT</span>
      <h2>Let's connect<br/><em>with purpose.</em></h2>
      <p>For professional opportunities, collaboration or further information, feel free to get in touch.</p>
      <div className="contact-links"><a href={`mailto:${profile.email}`}><Mail size={18}/>{profile.email}<ArrowUpRight size={16}/></a><a href={`tel:${profile.phone.replace(/[^\d+]/g,"")}`}><Phone size={18}/>{profile.phone}<ArrowUpRight size={16}/></a><span><MapPin size={18}/>{profile.location}</span></div>
      <div className="contact-note">REPLACE <code>public/images/contact-background.jpg</code> WITH YOUR CHOSEN PHOTOGRAPH</div>
    </div>
  </section>;
}

function Footer() {
  return <footer className="footer section-wrap"><a className="brand" href="#home">FH<span>.</span></a><span>© {new Date().getFullYear()} Farazul Haque. All rights reserved.</span><a href="#home">BACK TO TOP ↑</a><a className="admin-link" href="/analytics.html">ADMIN</a></footer>;
}

function App() {
  return <><div className="top-line"></div><Header/><main><Hero/><About/><Experience/><Expertise/><Gallery/><Contact/></main><Footer/></>;
}

createRoot(document.getElementById("root")).render(<App/>);
