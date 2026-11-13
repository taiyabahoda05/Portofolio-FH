import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Anchor, Mail, Phone, MapPin, CalendarDays, ShieldCheck, BadgePercent, Award,
  FileText, Compass, CheckCircle2, GraduationCap, Lock,
  Menu, X, Send, ChevronLeft, ChevronRight
} from "lucide-react";
import "./style.css";

/* ------------------------------------------------------------------ */
/*  CONTENT — everything on the page is edited here                    */
/* ------------------------------------------------------------------ */

const profile = {
  name: "Farazul Haque",
  role: "Trainee Ordinary Seaman (OS)",
  designation: "TRAINEE OS • GP RATING",
  merit: "MERIT TOP 25%",
  email: "mdfaraz247@gmail.com",
  phone: "+91 8235024445",
  location: "Bokaro Steel City, Jharkhand",
  dob: "10 Aug 2003 (Age 22)"
};

// Image paths — change these if your files are named differently.
const IMAGES = {
  hero: "/gallery/white-cap.jpg",        // portrait used in the hero card
  ship: "/gallery/ship-deck.jpg",        // container-ship photo in the GP Rating section
  contact: "/gallery/contact-bg.jpeg"
};

const stats = [
  ["INDIAN CDC NO.", "MUM 649873", "mono"],
  ["INDOS NO.", "26GM2070", "mono"],
  ["NATIONAL RANK", "313th (Top 25%)", ""],
  ["AVAILABILITY", "Immediate", "green"]
];

const highlights = [
  { icon: Award, title: "Top Tier Merit Standing", text: <>Secured <b>Rank 313th</b> across India in the General Purpose Rating Board Exam, placing within the top 25% of candidates nationally with high scores in practical and oral exams.</> },
  { icon: FileText, title: "100% Documentation Ready", text: "Complete and active official documentation ready for immediate sign-on, including Indian CDC, INDOS registration, Biometric SID card, and a 10-year Indian Passport." },
  { icon: ShieldCheck, title: "STCW-2010 Certified", text: "Trained and certified in all mandatory DG Shipping STCW safety modules including EFA, PST, PSSR, FPFF, and Security Training for Seafarers with Designated Security Duties (STSDSD)." }
];

const documents = [
  { badge: "Valid for 10 Years", title: "Continuous Discharge Certificate (Indian CDC)", fields: [["DOC NUMBER", "MUM 649873"], ["PLACE OF ISSUE", "Mumbai"], ["DATE OF ISSUE", "29.04.2026"], ["VALID UNTIL", "28.04.2036", true]] },
  { badge: "Verified & Active", title: "INDOS (Indian National Database of Seafarers)", fields: [["DOC NUMBER", "26GM2070"], ["PLACE OF ISSUE", "Mumbai"], ["DATE OF ISSUE", "10.01.2026"], ["VALID UNTIL", "Lifetime / Permanent", true]] },
  { badge: "Biometric Verified", title: "Seafarers Identity Document (SID)", fields: [["DOC NUMBER", "K35834251"], ["PLACE OF ISSUE", "Kolkata"], ["DATE OF ISSUE", "29.06.2026"], ["VALID UNTIL", "28.06.2036", true]] },
  { badge: "International Clearance", title: "Republic of India Passport", fields: [["DOC NUMBER", "W7736538"], ["PLACE OF ISSUE", "Ranchi"], ["DATE OF ISSUE", "26.12.2022"], ["VALID UNTIL", "25.12.2032", true]] }
];

const scores = [
  ["Theory Part 1+2+3+6", "69.99", "/ 75", "Pass marks: 45 (Distinction)", true],
  ["Theory Part 4+5+7", "69.00", "/ 75", "Pass marks: 45 (Distinction)", true],
  ["Practical/Oral (Part 1+2+3+6)", "153.0", "/ 175", "Exam: 28.07.2026", false],
  ["Practical/Oral (Part 4+5+7)", "120.0", "/ 175", "Issue: 31.07.2026", false]
];

const schooling = [
  { level: "CLASS 12TH (INTERMEDIATE SCIENCE - PCM)", school: "Kolhan Inter College (JAC Board)", note: "Physics, Chemistry, Mathematics background", score: "69%", sub: "PCM: 67% | Eng: 78%" },
  { level: "CLASS 10TH (MATRICULATION)", school: "M.G.M Higher Secondary School (CBSE Board)", note: "Solid English proficiency and academic foundation", score: "75%", sub: "English: 86%" }
];

const certifications = [
  { code: "EFA", title: "Elementary First Aid (EFA)", status: "STCW-2010 • DG Shipping approved" },
  { code: "PST", title: "Personal Survival Techniques (PST)", status: "STCW-2010 • DG Shipping approved" },
  { code: "PSSR", title: "Personal Safety & Social Responsibilities (PSSR)", status: "STCW-2010 • DG Shipping approved" },
  { code: "FPFF", title: "Fire Prevention & Fire Fighting (FPFF)", status: "STCW-2010 • DG Shipping approved" },
  { code: "STSDSD", title: "Security Training for Seafarers with Designated Security Duties", status: "STCW-2010 • DG Shipping approved" },
  { code: "GP", title: "General Purpose Rating (Pre-Sea)", status: "AMET University, Chennai" }
];

const competencies = [
  { title: "Deck & Seamanship", items: ["Deck maintenance", "Rope work & knots", "Mooring operations", "Bridge watchkeeping"] },
  { title: "Safety & Emergency", items: ["PPE awareness", "Fire fighting", "Emergency response", "Survival procedures"] },
  { title: "Professional Strengths", items: ["Team coordination", "Discipline", "Communication", "Situational awareness"] }
];

const gallery = [
  { src: "/images/hero-firefighter.jpg", title: "Fire & Safety Training" },
  { src: "/gallery/orange-uniform-portrait.jpg", title: "Professional Portrait" },
  { src: "/gallery/bridge-operations.png", title: "Bridge Familiarization" }
];

/* ------------------------------------------------------------------ */
/*  Small pieces                                                       */
/* ------------------------------------------------------------------ */

function Header() {
  const [open, setOpen] = useState(false);
  const links = [["About", "about"], ["Documents & CDC", "documents"], ["AMET GP Rating", "education"], ["STCW Certifications", "certifications"], ["Competencies", "competencies"]];
  const highlightSection = id => {
    setOpen(false);
    const section = document.getElementById(id);
    if (!section) return;
    section.classList.remove("section-highlight");
    void section.offsetWidth;
    section.classList.add("section-highlight");
  };

  useEffect(() => () => {
    document.querySelectorAll(".section-highlight").forEach(section => section.classList.remove("section-highlight"));
  }, []);

  return (
    <header className="header">
      <a className="identity" href="#home">
        <span className="identity-mark"><Anchor size={22} strokeWidth={2.4} /></span>
        <span className="identity-text">
          <b>FH<i className="online-dot" /></b>
          <small>{profile.designation} ({profile.merit})</small>
        </span>
      </a>
      <button className="menu-toggle" onClick={() => setOpen(!open)} aria-label="Toggle navigation">{open ? <X size={24} /> : <Menu size={24} />}</button>
      <nav className={open ? "nav nav-open" : "nav"}>
        {links.map(([label, id]) => <a key={id} href={"#" + id} onClick={() => highlightSection(id)}>{label}</a>)}
        <a href="#gallery" onClick={() => highlightSection("gallery")}>Gallery</a>
        <a className="hire-button" href="#contact" onClick={() => highlightSection("contact")}><Lock size={14} /> Hire for Vessel</a>
      </nav>
    </header>
  );
}

function SectionTitle({ eyebrow, title, note, aside }) {
  return (
    <div className="section-title">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {note && <p>{note}</p>}
      </div>
      {aside}
    </div>
  );
}

function CompassBadge() {
  const compassTicks = Array.from({ length: 64 }, (_, index) => {
    const major = index % 8 === 0;
    const medium = index % 4 === 0;
    return {
      angle: index * 5.625,
      start: major ? 8 : medium ? 10 : 12,
      end: major ? 15 : medium ? 14 : 13.5,
      width: major ? 1.1 : medium ? 0.7 : 0.4
    };
  });
  const rosePoints = Array.from({ length: 32 }, (_, index) => {
    const angle = -Math.PI / 2 + index * Math.PI / 16;
    const radius = index % 2 === 0 ? (index % 4 === 0 ? 23 : 17) : 7;
    return `${(50 + Math.cos(angle) * radius).toFixed(2)},${(50 + Math.sin(angle) * radius).toFixed(2)}`;
  }).join(" ");
  const compassLabels = [
    ["N", 50, 17], ["NE", 73, 27], ["E", 83, 50], ["SE", 73, 73],
    ["S", 50, 83], ["SW", 27, 73], ["W", 17, 50], ["NW", 27, 27]
  ];

  return (
    <div className="compass-badge" role="img" aria-label="Nautical compass">
      <div className="compass-stage">
        <svg viewBox="0 0 100 100" className="compass-dial" aria-hidden="true">
          <defs>
            <radialGradient id="compass-face" cx="32%" cy="28%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="72%" stopColor="#f4f6fb" />
              <stop offset="100%" stopColor="#cbd4e4" />
            </radialGradient>
            <linearGradient id="compass-rose" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#5268a1" />
              <stop offset="48%" stopColor="#17285d" />
              <stop offset="100%" stopColor="#080f2b" />
            </linearGradient>
            <linearGradient id="compass-gold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff0b0" />
              <stop offset="50%" stopColor="#d8b45a" />
              <stop offset="100%" stopColor="#9b7428" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="#0b153a" />
          <circle cx="50" cy="50" r="45" fill="url(#compass-gold)" />
          <circle cx="50" cy="50" r="43" fill="url(#compass-face)" stroke="#17285d" strokeWidth=".8" />
          <circle cx="50" cy="50" r="39" fill="none" stroke="#263b78" strokeWidth=".5" />
          {compassTicks.map(({ angle, start, end, width }, index) => (
            <line
              key={index}
              x1="50"
              y1={start}
              x2="50"
              y2={end}
              stroke={index % 8 === 0 ? "#101b43" : "#77819a"}
              strokeWidth={width}
              transform={`rotate(${angle} 50 50)`}
            />
          ))}
          <g stroke="#66728e" strokeWidth=".35" opacity=".8">
            {[...Array(32).keys()].map(index => (
              <line key={index} x1="50" y1="18" x2="50" y2={index % 4 === 0 ? "35" : "29"} transform={`rotate(${index * 11.25} 50 50)`} />
            ))}
          </g>
          <circle cx="50" cy="50" r="18" fill="url(#compass-face)" stroke="#17285d" strokeWidth=".8" />
          <polygon points={rosePoints} fill="url(#compass-rose)" stroke="#d8b45a" strokeWidth=".55" />
          <g className="compass-needle">
            <polygon points="50,23 53,48 50,50 47,48" fill="#b83235" stroke="#fff" strokeWidth=".35" />
            <polygon points="50,77 53,52 50,50 47,52" fill="#14215c" stroke="#fff" strokeWidth=".35" />
          </g>
          <circle cx="50" cy="50" r="4.3" fill="url(#compass-gold)" stroke="#14215c" strokeWidth=".8" />
          <circle cx="50" cy="50" r="1.4" fill="#fff" />
          <g className="compass-points" fill="#111b40" fontFamily="Manrope, sans-serif" fontWeight="800" textAnchor="middle" dominantBaseline="middle">
            {compassLabels.map(([label, x, y]) => (
              <text key={label} x={x} y={y} fontSize={label.length === 1 ? "5.5" : "3.8"}>{label}</text>
            ))}
          </g>
          <circle cx="50" cy="50" r="43" fill="none" stroke="#fff" strokeWidth=".5" opacity=".75" />
        </svg>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sections                                                           */
/* ------------------------------------------------------------------ */

function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-inner">
        <div className="hero-copy">
          <span className="availability"><i /> Immediately Available for Sea Duty / Vessel Boarding</span>
          <h1>{profile.name}</h1>
          <h2>{profile.role}</h2>
          <p className="hero-summary">
            Pre-Sea General Purpose Rating graduate from <b>AMET University, Chennai</b> with proven academic merit (ranked in the <b className="navy">Top 25% National Merit List - Rank 313th</b>). Completely equipped with verified Indian CDC, INDOS, SID, Passport, and DG Shipping compliant STCW safety certificates.
          </p>
          <div className="stat-row">
            {stats.map(([label, value, kind]) => (
              <div className="stat" key={label}><small>{label}</small><b className={kind}>{value}</b></div>
            ))}
          </div>
          <div className="hero-actions">
            <a className="btn btn-primary" href={"mailto:" + profile.email}><Send size={15} /> Send Placement Inquiry</a>
            <a className="btn btn-outline" href="/CV%20%E2%80%93%20FH.pdf" target="_blank" rel="noopener noreferrer"><FileText size={15} /> View Resume</a>
            <a className="btn btn-outline" href={"tel:" + profile.phone.replace(/[^\d+]/g, "")}><Phone size={14} /> {profile.phone}</a>
            <a className="btn btn-outline btn-small" href={"mailto:" + profile.email}><CheckCircle2 size={13} /> {profile.email}</a>
          </div>
        </div>

        <aside className="hero-side">
          <div className="portrait-card tilt-card">
            <div className="portrait-photo">
              <img src={IMAGES.hero} alt="Farazul Haque in merchant navy uniform on a ship deck" />
              <CompassBadge />
              <div className="portrait-caption">
                <span>MERCHANT NAVY CANDIDATE</span>
                <small>AMET Marine Training College • Chennai</small>
              </div>
              <button className="compass-btn" aria-label="Compass"><Compass size={18} /></button>
            </div>
            <div className="chip-grid">
              <span><MapPin size={13} /> {profile.location}</span>
              <span><CalendarDays size={13} /> DOB: {profile.dob}</span>
              <span><ShieldCheck size={13} /> DG Shipping Compliant</span>
              <span><BadgePercent size={13} /> GP Rating Pre-Sea Certified</span>
            </div>
          </div>

        </aside>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="section" id="about">
      <div className="container">
        <SectionTitle
          eyebrow="PROFESSIONAL PROFILE"
          title="Disciplined Deck Hand Ready to Excel in Global Waters"
          note="Trained in the highest maritime safety standards at AMET Marine Training College in Chennai. Driven by high discipline, physical fitness, and hands-on seamanship skills to support bridge watchkeeping, cargo maintenance, and safe vessel operations."
        />
        <div className="feature-grid">
          {highlights.map(({ icon: Icon, title, text }) => (
            <article className="feature-card tilt-card" key={title}>
              <span className="icon-tile"><Icon size={18} /></span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Documents() {
  return (
    <section className="section tint" id="documents">
      <div className="container">
        <SectionTitle
          eyebrow="OFFICIAL RECORDS"
          title="Seafarer Official Documents"
          note="Verifiable government and maritime authority records with complete identification numbers."
          aside={<span className="verified-pill"><CheckCircle2 size={13} /> Original Documents Available for Immediate Inspection</span>}
        />
        <div className="doc-grid">
          {documents.map(doc => (
            <article className="doc-card tilt-card" key={doc.title}>
              <div className="doc-head">
                <span className="doc-badge">{doc.badge}</span>
              </div>
              <h3>{doc.title}</h3>
              <div className="doc-fields">
                {doc.fields.map(([label, value, accent]) => (
                  <div key={label}><small>{label}</small><b className={accent ? "accent" : ""}>{value}</b></div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Education() {
  return (
    <section className="section" id="education">
      <div className="container edu-layout">
        <div className="edu-left">
          <span className="eyebrow">MARITIME ACADEMY EDUCATION</span>
          <h2>General Purpose Rating (G.P. Rating)</h2>
          <div className="college-box">
            <b>Marine Training College, AMET University</b>
            <small>Chennai, Tamil Nadu, India • Certificate No.: <code>02606M17032/Jun 26/133855</code></small>
          </div>
          <p className="edu-text">Rigorous residential pre-sea training covering deck and engine seamanship, shipboard routine, rope work, splicing, life-saving appliances, fire fighting systems, marine safety regulations, and navigational watch support.</p>

          <div className="score-card">
            <div className="score-head">
              <b>G.P. Rating Board Examination Scores</b>
              <span className="merit-tag">National Merit: 313th Position</span>
            </div>
            <div className="score-grid">
              {scores.map(([label, value, max, foot, green]) => (
                <div className="score tilt-card" key={label}>
                  <small>{label}</small>
                  <b className={green ? "" : "navy"}>{value} <span>{max}</span></b>
                  <em className={green ? "ok" : ""}>{foot}</em>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="edu-right">
          <figure className="ship-photo">
            <img src={IMAGES.ship} alt="Container ship at sea during sunset" />
            <figcaption><span>Ready for Deep-Sea Fleet Deployment</span> • Container / Bulk / Tanker</figcaption>
          </figure>
          <h3 className="school-title"><GraduationCap size={17} /> Secondary &amp; Higher Secondary Education</h3>
          {schooling.map(s => (
            <article className="school-card tilt-card" key={s.level}>
              <div><small>{s.level}</small><b>{s.school}</b><span>{s.note}</span></div>
              <div className="school-score"><b>{s.score}</b><span>{s.sub}</span></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Certifications() {
  return (
    <section className="section tint" id="certifications">
      <div className="container">
        <SectionTitle eyebrow="STCW CERTIFICATIONS" title="Safety Training & Certification" note="Mandatory DG Shipping STCW-2010 safety modules completed during pre-sea training." />
        <div className="cert-grid">
          {certifications.map(c => (
            <article className="cert-card" key={c.code}>
              <span className="cert-code">{c.code}</span>
              <div><h3>{c.title}</h3><small>{c.status}</small></div>
              <a
                className="cert-document"
                href={`/certificates/${c.code.toLowerCase()}.pdf`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${c.title} certificate PDF`}
              >
                <FileText size={17} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Competencies() {
  return (
    <section className="section" id="competencies">
      <div className="container">
        <SectionTitle eyebrow="CORE COMPETENCIES" title="Skills for Safe Vessel Operations" note="Practical abilities developed through pre-sea training and watchkeeping practice." />
        <div className="feature-grid">
          {competencies.map(group => (
            <article className="feature-card tilt-card" key={group.title}>
              <h3>{group.title}</h3>
              <ul className="tick-list">{group.items.map(i => <li key={i}><CheckCircle2 size={14} /> {i}</li>)}</ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Gallery() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const active = gallery[activeIndex];
  const changeSlide = direction => {
    setSlideDirection(direction);
    setActiveIndex(index => (index + direction + gallery.length) % gallery.length);
  };
  const selectSlide = index => {
    setSlideDirection(index >= activeIndex ? 1 : -1);
    setActiveIndex(index);
  };

  return (
    <section className="section tint gallery-section" id="gallery">
      <div className="container gallery-layout">
        <div className="gallery-intro">
          <span className="eyebrow">PHOTO JOURNAL</span>
          <h2>Memories from college and life at sea</h2>
          <p>A few moments from maritime training, campus life, and the journey toward a career at sea.</p>
        </div>
        <div className="gallery-stage" role="region" aria-label="Photo carousel" aria-live="polite">
          <img
            key={active.src}
            className={slideDirection > 0 ? "gallery-image slide-forward" : "gallery-image slide-backward"}
            src={active.src}
            alt={active.title}
          />
          <button className="gallery-arrow gallery-previous" type="button" aria-label="Previous photo" onClick={() => changeSlide(-1)}><ChevronLeft size={22} /></button>
          <button className="gallery-arrow gallery-next" type="button" aria-label="Next photo" onClick={() => changeSlide(1)}><ChevronRight size={22} /></button>
          <div className="gallery-dots" role="group" aria-label="Choose a photo">
            {gallery.map((image, index) => (
              <button
                key={image.src}
                className={index === activeIndex ? "gallery-dot is-active" : "gallery-dot"}
                type="button"
                aria-label={`Show photo ${index + 1}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => selectSlide(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Contact() {
  return (
    <section className="contact" id="contact">
      <div className="contact-image" style={{ backgroundImage: `url(${IMAGES.contact})` }} />
      <div className="contact-overlay" />
      <div className="container contact-content">
        <span className="eyebrow">CONTACT / HIRE FOR VESSEL</span>
        <h2>Ready for the<br /><em>next voyage.</em></h2>
        <p>For vessel hiring, placement inquiries or verification of documents, please get in touch.</p>
        <div className="contact-details">
          <a href={"mailto:" + profile.email}><Mail size={16} /> {profile.email}</a>
          <a href={"tel:" + profile.phone.replace(/[^\d+]/g, "")}><Phone size={16} /> {profile.phone}</a>
          <span><MapPin size={16} /> {profile.location}</span>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <a className="footer-brand" href="#home"><Anchor size={16} /> FARAZUL HAQUE</a>
      <span>© {new Date().getFullYear()} Farazul Haque. All rights reserved.</span>
      <a href="/analytics.html" className="admin-link">PRIVATE ANALYTICS</a>
    </footer>
  );
}

function App() {
  useEffect(() => {
    document.title = "Farazul Haque | Trainee Ordinary Seaman (OS)";

    const sections = document.querySelectorAll("main > section");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || !("IntersectionObserver" in window)) {
      sections.forEach(section => section.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -40px 0px" });

    sections.forEach(section => {
      section.classList.add("section-reveal");
      observer.observe(section);
    });

    const cards = document.querySelectorAll(".tilt-card");
    const onPointerMove = event => {
      if (event.pointerType === "touch") return;
      const card = event.currentTarget;
      const bounds = card.getBoundingClientRect();
      if (!bounds.width || !bounds.height) return;
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      card.style.setProperty("--tilt-x", `${x * 8}deg`);
      card.style.setProperty("--tilt-y", `${y * -8}deg`);
    };
    const resetTilt = event => {
      event.currentTarget.style.removeProperty("--tilt-x");
      event.currentTarget.style.removeProperty("--tilt-y");
    };

    cards.forEach(card => {
      card.addEventListener("pointermove", onPointerMove);
      card.addEventListener("pointerleave", resetTilt);
    });

    return () => {
      observer.disconnect();
      cards.forEach(card => {
        card.removeEventListener("pointermove", onPointerMove);
        card.removeEventListener("pointerleave", resetTilt);
      });
    };
  }, []);
  return (
    <>
      <Header />
      <main><Hero /><About /><Documents /><Education /><Certifications /><Competencies /><Gallery /><Contact /></main>
      <Footer />
    </>
  );
}

createRoot(document.getElementById("root")).render(<App />);
