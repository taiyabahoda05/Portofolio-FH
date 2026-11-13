import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const profile = {
  name: "Farazul Haque",
  designation: "TRAINEE OS • GP RATING",
  merit: "[MERIT / RANKING]",
  headline: "Disciplined Deck Hand Ready to Excel in Global Waters",
  summary: "Trained in maritime safety and seamanship. Add a concise, accurate introduction covering your training, practical skills, career goals and readiness for vessel opportunities.",
  location: "[City, Country]",
  email: "[your.email@example.com]",
  phone: "[+91 XXXXX XXXXX]",
  availability: "AVAILABLE FOR OPPORTUNITIES"
};

// Replace bracketed values with verified information before publishing.
// Do not add real passport, CDC or SID numbers to a public website.
const highlights = [
  { icon: "✦", title: "Merit Standing", value: "[Rank / Merit]", detail: "Add the verified GP Rating examination result or merit achievement." },
  { icon: "▤", title: "Documentation Ready", value: "[Document status]", detail: "Summarise document readiness without displaying sensitive ID numbers." },
  { icon: "✓", title: "STCW Training", value: "[Certification status]", detail: "List only completed and valid STCW courses." }
];

const documents = [
  { label: "Biometric Verified", title: "Seafarers Identity Document (SID)", fields: [["DOCUMENT STATUS", "[Verified / Pending]"], ["PLACE OF ISSUE", "[City]"], ["DATE OF ISSUE", "[DD.MM.YYYY]"], ["VALID UNTIL", "[DD.MM.YYYY]"]] },
  { label: "International Clearance", title: "Passport", fields: [["DOCUMENT STATUS", "[Available / Pending]"], ["PLACE OF ISSUE", "[City]"], ["DATE OF ISSUE", "[DD.MM.YYYY]"], ["VALID UNTIL", "[DD.MM.YYYY]"]] },
  { label: "Seafarer Record", title: "Continuous Discharge Certificate (CDC)", fields: [["DOCUMENT STATUS", "[Available / Pending]"], ["ISSUING AUTHORITY", "[Authority]"], ["DATE OF ISSUE", "[DD.MM.YYYY]"], ["VALID UNTIL", "[DD.MM.YYYY]"]] }
];

const education = [
  { eyebrow: "MARITIME ACADEMY EDUCATION", title: "General Purpose Rating (G.P. Rating)", place: "[AMET / Training Institute]", period: "[Year – Year]", detail: "Add course duration, training modules and practical seamanship exposure." },
  { eyebrow: "ACADEMIC BACKGROUND", title: "[School / Higher Secondary Qualification]", place: "[Institution]", period: "[Year]", detail: "Add the qualification and institution details." }
];

const certifications = [
  { code: "01", title: "Elementary First Aid (EFA)", status: "[Completed / In progress]" },
  { code: "02", title: "Personal Survival Techniques (PST)", status: "[Completed / In progress]" },
  { code: "03", title: "Personal Safety & Social Responsibilities (PSSR)", status: "[Completed / In progress]" },
  { code: "04", title: "Fire Prevention & Fire Fighting (FPFF)", status: "[Completed / In progress]" },
  { code: "05", title: "Security Awareness", status: "[Completed / In progress]" },
  { code: "06", title: "[Additional course / certificate]", status: "[Status]" }
];

const competencies = [
  { title: "Deck & Seamanship", items: ["Deck maintenance", "Rope work & knots", "Mooring operations", "Basic seamanship"] },
  { title: "Safety & Emergency", items: ["PPE awareness", "Fire safety", "Emergency response", "Survival procedures"] },
  { title: "Professional Strengths", items: ["Team coordination", "Discipline", "Communication", "Situational awareness"] }
];

const gallery = [
  { src: "/images/hero-firefighter.jpg", title: "Fire & Safety Training", type: "SAFETY" },
  { src: "/gallery/orange-uniform-portrait.jpg", title: "Professional Portrait", type: "PROFILE" },
  { src: "/gallery/ship-deck.jpg", title: "Maritime Environment", type: "MARITIME" },
  { src: "/gallery/white-cap.jpg", title: "Professional Uniform", type: "PROFILE" },
  { src: "/gallery/bridge-operations.png", title: "Bridge Familiarization", type: "OPERATIONS" }
];

function Header() {
  const [open, setOpen] = useState(false);
  const links = [["About", "about"], ["Documents & CDC", "documents"], ["AMET GP Rating", "education"], ["STCW Certifications", "certifications"], ["Competencies", "competencies"], ["Contact", "contact"]];
  return <header className="header">
    <a className="identity" href="#home"><span className="identity-mark">⚓</span><span><b>{profile.name}<i className="online-dot" /></b><small>{profile.designation} <span>({profile.merit})</span></small></span></a>
    <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? "✕" : "☰"}</button>
    <nav className={open ? "nav nav-open" : "nav"}>{links.map(([label,id]) => <a key={id} href={"#"+id} onClick={() => setOpen(false)}>{label}</a>)}<a className="hire-button" href="#contact">⚓ &nbsp; Hire for Vessel</a></nav>
  </header>;
}

function SectionTitle({ eyebrow, title, note }) {
  return <div className="section-title"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{note && <p>{note}</p>}</div>;
}

function Hero() {
  return <section className="hero page-width" id="home">
    <div className="hero-copy"><span className="eyebrow">PROFESSIONAL PROFILE</span><h1>{profile.headline}</h1><p>{profile.summary}</p>
      <div className="hero-actions"><a className="primary-button" href="#documents">View Documents <span>↗</span></a><a className="secondary-link" href="#contact">Contact / Hire <span>→</span></a></div>
      <div className="hero-meta"><span>⌖ &nbsp;{profile.location}</span><span>● &nbsp;{profile.availability}</span></div>
    </div>
    <div className="hero-photo"><img src="/images/hero-firefighter.jpg" alt="Farazul in professional protective equipment" /><div className="photo-caption"><b>FARAZUL HAQUE</b><span>MARITIME PROFESSIONAL PROFILE</span></div></div>
  </section>;
}

function Highlights() {
  return <section className="highlights page-width">{highlights.map((item,i)=><article className="highlight-card" key={item.title}><span className="highlight-icon">{item.icon}</span><h3>{item.title}</h3><b>{item.value}</b><p>{item.detail}</p></article>)}</section>;
}

function About() {
  return <section className="section page-width" id="about"><SectionTitle eyebrow="ABOUT / PROFILE" title="A professional approach to life at sea" note="A concise overview of maritime training, professional values and career direction."/><div className="about-panel"><div className="about-emblem">⚓<small>FH / PROFILE</small></div><div><h3>Prepared, disciplined and safety focused.</h3><p>{profile.summary}</p><div className="about-facts"><span><small>BASED IN</small><b>{profile.location}</b></span><span><small>DESIGNATION</small><b>{profile.designation}</b></span><span><small>AVAILABILITY</small><b>{profile.availability}</b></span></div></div></div></section>;
}

function Documents() {
  return <section className="section soft-section" id="documents"><div className="page-width"><SectionTitle eyebrow="DOCUMENTS & CDC" title="Essential seafarer documentation" note="A simple overview of document readiness. Sensitive document numbers should never be published on this page."/><div className="document-grid">{documents.map(doc=><article className="document-card" key={doc.title}><div className="document-head"><span>{doc.label}</span><b>▤</b></div><h3>{doc.title}</h3><div className="document-fields">{doc.fields.map(([label,value])=><div key={label}><small>{label}</small><b>{value}</b></div>)}</div></article>)}</div></div></section>;
}

function Education() {
  return <section className="section page-width" id="education"><SectionTitle eyebrow="MARITIME ACADEMY EDUCATION" title="General Purpose Rating (G.P. Rating)" note="Training, practical learning and academic milestones."/><div className="education-layout"><div className="education-copy"><span className="eyebrow">01 / CORE MARITIME TRAINING</span><h3>{education[0].title}</h3><h4>{education[0].place}</h4><span className="period">{education[0].period}</span><p>{education[0].detail}</p></div><img src="/gallery/ship-deck.jpg" alt="Ship at sea" /></div><div className="education-secondary"><span className="eyebrow">{education[1].eyebrow}</span><h3>{education[1].title}</h3><p>{education[1].place} <span>{education[1].period}</span></p><small>{education[1].detail}</small></div></section>;
}

function Certifications() {
  return <section className="section soft-section" id="certifications"><div className="page-width"><SectionTitle eyebrow="STCW CERTIFICATIONS" title="Safety training & certification" note="Update each item to reflect the actual certificates held and their current validity."/><div className="cert-grid">{certifications.map(c=><article className="cert-card" key={c.code}><span>{c.code}</span><div><h3>{c.title}</h3><small>{c.status}</small></div><b>↗</b></article>)}</div></div></section>;
}

function Competencies() {
  return <section className="section page-width" id="competencies"><SectionTitle eyebrow="CORE COMPETENCIES" title="Skills for safe vessel operations" note="Edit these areas to reflect demonstrated skills and completed training."/><div className="competency-grid">{competencies.map((group,i)=><article className="competency-card" key={group.title}><span>0{i+1} / CAPABILITY</span><h3>{group.title}</h3><ul>{group.items.map(item=><li key={item}>{item}</li>)}</ul></article>)}</div></section>;
}

function Gallery() {
  const [active,setActive] = useState(null);
  return <section className="section soft-section" id="gallery"><div className="page-width"><SectionTitle eyebrow="PHOTO JOURNAL" title="A closer look at the journey" note="Professional photographs and maritime training moments."/><div className="gallery-grid">{gallery.map(item=><button className="gallery-card" key={item.src} onClick={()=>setActive(item)}><img src={item.src} alt={item.title}/><span>{item.type}</span><b>{item.title}</b></button>)}</div></div>{active && <div className="lightbox" onClick={()=>setActive(null)}><button aria-label="Close">×</button><img src={active.src} alt={active.title}/><p>{active.title}</p></div>}</section>;
}

function Contact() {
  return <section className="contact" id="contact"><div className="contact-image" /><div className="contact-overlay" /><div className="page-width contact-content"><span className="eyebrow">CONTACT / HIRE FOR VESSEL</span><h2>Ready for the<br/><em>next voyage.</em></h2><p>For vessel hiring, professional opportunities or further information, please get in touch.</p><div className="contact-details"><a href={"mailto:"+profile.email}>✉ &nbsp;{profile.email}</a><a href={"tel:"+profile.phone.replace(/[^\d+]/g,"")}>☎ &nbsp;{profile.phone}</a><span>⌖ &nbsp;{profile.location}</span></div><small className="contact-placeholder">CONTACT BACKGROUND IMAGE: public/images/contact-background.jpg</small></div></section>;
}

function Footer() {
  return <footer className="footer page-width"><a className="footer-brand" href="#home">⚓ &nbsp; FARAZUL HAQUE</a><span>© {new Date().getFullYear()} Farazul Haque. All rights reserved.</span><a href="#home">BACK TO TOP ↑</a><a href="/analytics.html">PRIVATE ANALYTICS</a></footer>;
}

function App() {
  useEffect(()=>{document.title="Farazul Haque | Maritime Professional";},[]);
  return <><Header/><main><Hero/><Highlights/><About/><Documents/><Education/><Certifications/><Competencies/><Gallery/><Contact/></main><Footer/></>;
}

createRoot(document.getElementById("root")).render(<App/>);
