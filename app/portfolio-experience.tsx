"use client";

import {
  certifications,
  education,
  experiences,
  signalLayers,
  type Project,
  type ProjectDiscipline
} from "@/data/portfolio";
import Image from "next/image";
import {
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  useEffect,
  useRef,
  useState
} from "react";

type Props = {
  projects: Project[];
};

type Filter = "Tous" | ProjectDiscipline;
type ContactState =
  | { phase: "idle" }
  | { phase: "sending" }
  | { phase: "success"; reference?: string }
  | { phase: "error"; message: string };

const filters: Filter[] = [
  "Tous",
  "DCS",
  "SCADA",
  "Instrumentation",
  "Industrie 4.0",
  "IA"
];

const navItems = [
  ["projets", "Projets"],
  ["architecture", "Architecture"],
  ["parcours", "Parcours"],
  ["contact", "Contact"]
] as const;

function Arrow({ direction = "right" }: { direction?: "left" | "right" }) {
  return <span aria-hidden="true">{direction === "right" ? "→" : "←"}</span>;
}

export function PortfolioExperience({ projects }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [filter, setFilter] = useState<Filter>("Tous");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [imageIndex, setImageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [activeSection, setActiveSection] = useState("projets");
  const [localTime, setLocalTime] = useState("--:--");
  const [contactState, setContactState] = useState<ContactState>({
    phase: "idle"
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const dialogRef = useRef<HTMLDialogElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const lastTriggerRef = useRef<HTMLButtonElement | null>(null);

  const featured = projects.find((project) => project.featured) ?? projects[0];
  const visibleProjects = projects.filter(
    (project) =>
      !project.featured &&
      (filter === "Tous" || project.disciplines.includes(filter))
  );

  useEffect(() => {
    const updateTime = () => {
      setLocalTime(
        new Intl.DateTimeFormat("fr-FR", {
          timeZone: "Africa/Casablanca",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false
        }).format(new Date())
      );
    };
    updateTime();
    const timer = window.setInterval(updateTime, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const updateProgress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    updateProgress();
    window.addEventListener("scroll", updateProgress, { passive: true });
    window.addEventListener("resize", updateProgress);
    return () => {
      window.removeEventListener("scroll", updateProgress);
      window.removeEventListener("resize", updateProgress);
    };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.find((entry) => entry.isIntersecting);
        if (visible) setActiveSection(visible.target.id);
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0.01 }
    );
    navItems.forEach(([id]) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !selectedProject || dialog.open) return;
    dialog.showModal();
  }, [selectedProject]);

  useEffect(() => {
    const closeOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape" && menuOpen) setMenuOpen(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen]);

  const openProject = (
    project: Project,
    trigger: HTMLButtonElement | null = null
  ) => {
    lastTriggerRef.current = trigger;
    setImageIndex(0);
    setSelectedProject(project);
  };

  const closeProject = () => {
    if (dialogRef.current?.open) dialogRef.current.close();
    else setSelectedProject(null);
  };

  const stepImage = (direction: number) => {
    if (!selectedProject) return;
    setImageIndex(
      (current) =>
        (current + direction + selectedProject.gallery.length) %
        selectedProject.gallery.length
    );
  };

  const onGalleryKeyDown = (event: ReactKeyboardEvent<HTMLDialogElement>) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      stepImage(-1);
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      stepImage(1);
    }
  };

  const submitContact = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (contactState.phase === "sending") return;
    setContactState({ phase: "sending" });
    setFieldErrors({});

    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = (await response.json()) as {
        ok?: boolean;
        reference?: string;
        error?: {
          message?: string;
          fields?: Record<string, string>;
        };
      };

      if (!response.ok || !result.ok) {
        setFieldErrors(result.error?.fields ?? {});
        setContactState({
          phase: "error",
          message:
            result.error?.message ??
            "La transmission a échoué. Réessayez dans quelques instants."
        });
        return;
      }

      formRef.current?.reset();
      setContactState({
        phase: "success",
        reference: result.reference
      });
    } catch {
      setContactState({
        phase: "error",
        message:
          "Connexion indisponible. Vous pouvez aussi utiliser l'adresse e-mail directe."
      });
    }
  };

  return (
    <>
      <a className="skip-link" href="#contenu">
        Aller au contenu principal
      </a>

      <header className="command-bar">
        <div className="command-inner">
          <a className="brand" href="#top" aria-label="Retour en haut">
            <span>OEM</span>
            <small>I&amp;C / 2026</small>
          </a>

          <div className="system-online" aria-label="Système en ligne">
            <i aria-hidden="true" />
            <span>SYSTEM / ONLINE</span>
            <time>{localTime} MA</time>
          </div>

          <button
            className="menu-button"
            type="button"
            aria-expanded={menuOpen}
            aria-controls="main-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? "Fermer" : "Menu"}
          </button>

          <nav
            id="main-navigation"
            className={menuOpen ? "main-nav is-open" : "main-nav"}
            aria-label="Navigation principale"
          >
            {navItems.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                aria-current={activeSection === id ? "location" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {label}
              </a>
            ))}
            <a className="nav-cv" href="/docs/cv-el-menichi-oussama.pdf" download>
              CV / PDF <Arrow />
            </a>
          </nav>
        </div>
        <div
          className="page-progress"
          style={{ transform: `scaleX(${progress / 100})` }}
          aria-hidden="true"
        />
      </header>

      <main id="contenu">
        <section className="hero dark-grid" id="top">
          <div className="hero-route" aria-hidden="true">
            <span>FIELD</span>
            <i />
            <span>CONTROL</span>
            <i />
            <span>SUPERVISION</span>
            <i />
            <span>AI</span>
          </div>

          <div className="hero-copy">
            <p className="kicker">
              Ingénieur d&apos;État / Génie électrique / Contrôle-commande
            </p>
            <h1>
              Oussama
              <br />
              El Menichi<span>.</span>
            </h1>
            <p className="hero-statement">
              Je rends l&apos;industrie <strong>lisible</strong>,{" "}
              <strong>pilotable</strong> et <strong>intelligente</strong>.
            </p>
            <p className="hero-summary">
              Instrumentation, DCS, SCADA et IA industrielle — du signal terrain
              à la décision opérateur. Actuellement en PFE chez VINCI Energies /
              Actemium sur l&apos;usine pilote d&apos;ammoniac vert GAPP.
            </p>
            <div className="hero-actions">
              <a className="action primary" href="#projets">
                Explorer les systèmes <Arrow />
              </a>
              <a
                className="action secondary"
                href="https://www.linkedin.com/in/oussamaelmenichi/"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn ↗
              </a>
            </div>
          </div>

          <div className="instrument-frame">
            <div className="frame-head">
              <span>CAM / OEM-01</span>
              <span>REC ●</span>
            </div>
            <div className="portrait-wrap">
              <Image
                src="/assets/img/profile-0.jpg"
                alt="Portrait d'Oussama El Menichi"
                width="760"
                height="760"
                priority
              />
              <div className="scan-line" aria-hidden="true" />
              <span className="target-corner corner-a" aria-hidden="true" />
              <span className="target-corner corner-b" aria-hidden="true" />
              <span className="target-corner corner-c" aria-hidden="true" />
              <span className="target-corner corner-d" aria-hidden="true" />
            </div>
            <div className="frame-foot">
              <div>
                <small>STATUS</small>
                <strong>
                  <i aria-hidden="true" /> Disponible
                </strong>
              </div>
              <div>
                <small>MISSION</small>
                <strong>OEM-PFE-2026</strong>
              </div>
            </div>
          </div>

          <dl className="hero-stats">
            <div>
              <dt>6</dt>
              <dd>projets documentés</dd>
            </div>
            <div>
              <dt>4</dt>
              <dd>expériences terrain</dd>
            </div>
            <div>
              <dt>8</dt>
              <dd>certifications</dd>
            </div>
            <div>
              <dt>3</dt>
              <dd>langues</dd>
            </div>
          </dl>
        </section>

        <section className="signal-chain" aria-labelledby="signal-title">
          <div className="section-intro">
            <p className="section-code">PROCESS / 00</p>
            <h2 id="signal-title">Une chaîne de signal. Quatre disciplines.</h2>
          </div>
          <ol>
            {signalLayers.map((layer) => (
              <li key={layer.code}>
                <span className="node" aria-hidden="true" />
                <p>{layer.code}</p>
                <strong>{layer.title}</strong>
                <small>{layer.description}</small>
              </li>
            ))}
          </ol>
        </section>

        <section className="projects-section" id="projets">
          <div className="section-intro split">
            <div>
              <p className="section-code">CASE FILES / 01—06</p>
              <h2>Des systèmes réels. Des preuves visibles.</h2>
            </div>
            <p>
              Rapports, vues opérateur et livrables d&apos;ingénierie issus de
              missions OCP, VINCI Energies, Roca et ENSET.
            </p>
          </div>

          <article className="featured-case">
            <div className="case-rail">
              <span>CASE / {featured.number}</span>
              <span>{featured.period}</span>
              <span>LEAD PROJECT</span>
            </div>
            <div className="featured-content">
              <div className="featured-copy">
                <p className="project-code">{featured.code}</p>
                <h3>{featured.title}</h3>
                <p className="project-org">
                  {featured.organization} · {featured.location}
                </p>
                <p className="featured-summary">{featured.summary}</p>
                <ul className="project-highlights">
                  {featured.highlights.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <div className="tech-list" aria-label="Technologies">
                  {featured.technologies.map((technology) => (
                    <span key={technology}>{technology}</span>
                  ))}
                </div>
                <div className="project-actions">
                  <button
                    className="action primary"
                    type="button"
                    onClick={(event) =>
                      openProject(featured, event.currentTarget)
                    }
                  >
                    Ouvrir le dossier ({featured.gallery.length}) <Arrow />
                  </button>
                  {featured.documents.map((document) => (
                    <a
                      className="text-link"
                      href={document.href}
                      key={document.href}
                      download={document.download}
                      target={document.download ? undefined : "_blank"}
                      rel={document.download ? undefined : "noreferrer"}
                    >
                      {document.label} ↗
                    </a>
                  ))}
                </div>
              </div>

              <div className="featured-visuals">
                <figure className="mosaic-main">
                  <Image
                    src={featured.gallery[1].src}
                    alt={featured.gallery[1].alt}
                    width={1376}
                    height={768}
                    loading="lazy"
                  />
                  <figcaption>HMI / ISA-101</figcaption>
                </figure>
                <figure>
                  <Image
                    src={featured.gallery[3].src}
                    alt={featured.gallery[3].alt}
                    width={1376}
                    height={768}
                    loading="lazy"
                  />
                  <figcaption>VISION / YOLOv11</figcaption>
                </figure>
                <figure>
                  <Image
                    src={featured.gallery[4].src}
                    alt={featured.gallery[4].alt}
                    width={1376}
                    height={768}
                    loading="lazy"
                  />
                  <figcaption>PIPELINE / n8n</figcaption>
                </figure>
              </div>
            </div>
            <dl className="case-metrics">
              {featured.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt>{metric.value}</dt>
                  <dd>{metric.label}</dd>
                </div>
              ))}
            </dl>
          </article>

          <div className="project-toolbar">
            <p>FILTER / DISCIPLINE</p>
            <div className="filter-row" role="group" aria-label="Filtrer les projets">
              {filters.map((item) => (
                <button
                  type="button"
                  key={item}
                  aria-pressed={filter === item}
                  onClick={() => setFilter(item)}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="case-grid" aria-live="polite">
            {visibleProjects.map((project) => (
              <article className={`case-card case-${project.id}`} key={project.id}>
                <button
                  className="case-image"
                  type="button"
                  onClick={(event) => openProject(project, event.currentTarget)}
                  aria-label={`Ouvrir la galerie : ${project.title}`}
                >
                  <Image
                    src={project.cover.src}
                    alt=""
                    width={1376}
                    height={768}
                    loading="lazy"
                  />
                  <span>
                    {project.gallery.length.toString().padStart(2, "0")} VISUELS
                  </span>
                </button>
                <div className="case-body">
                  <div className="case-meta">
                    <span>{project.number}</span>
                    <span>{project.code}</span>
                    <span>{project.period}</span>
                  </div>
                  <h3>{project.title}</h3>
                  <p className="project-org">{project.organization}</p>
                  <p>{project.summary}</p>
                  <div className="tech-list compact">
                    {project.technologies.map((technology) => (
                      <span key={technology}>{technology}</span>
                    ))}
                  </div>
                  <div className="case-card-actions">
                    <button
                      className="text-button"
                      type="button"
                      onClick={(event) =>
                        openProject(project, event.currentTarget)
                      }
                    >
                      Voir le dossier <Arrow />
                    </button>
                    {project.documents.map((document) => (
                      <a
                        href={document.href}
                        key={document.href}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {document.label} ↗
                      </a>
                    ))}
                  </div>
                </div>
              </article>
            ))}
            {visibleProjects.length === 0 && (
              <p className="empty-filter">
                Aucun autre dossier dans cette discipline. Le projet GAPP
                ci-dessus couvre ce domaine.
              </p>
            )}
          </div>
        </section>

        <section className="architecture-section dark-grid" id="architecture">
          <div className="section-intro split on-dark">
            <div>
              <p className="section-code">CONTROL ARCHITECTURE / 04 LAYERS</p>
              <h2>Du terrain jusqu&apos;à l&apos;intelligence.</h2>
            </div>
            <p>
              Une vision système qui relie équipements, logique de contrôle,
              supervision et exploitation des données.
            </p>
          </div>

          <div className="architecture-stack">
            {signalLayers.map((layer, index) => (
              <article key={layer.code}>
                <div className="layer-number">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <i aria-hidden="true" />
                </div>
                <div>
                  <p>{layer.code}</p>
                  <h3>{layer.title}</h3>
                </div>
                <p>{layer.description}</p>
                <ul>
                  {layer.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="career-section" id="parcours">
          <div className="section-intro split">
            <div>
              <p className="section-code">SHIFT LOG / 2023—NOW</p>
              <h2>Quatre immersions. Une progression continue.</h2>
            </div>
            <p>
              De l&apos;électricité BT au DCS et à l&apos;IA, au contact direct
              des procédés et des équipes industrielles.
            </p>
          </div>

          <ol className="shift-log">
            {experiences.map((experience, index) => (
              <li key={experience.period}>
                <span className="shift-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <time>{experience.period}</time>
                <div>
                  <h3>{experience.organization}</h3>
                  <p className="role">{experience.role}</p>
                  <ul>
                    {experience.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>

          <div className="credentials-grid">
            <section aria-labelledby="credentials-title">
              <div className="ledger-head">
                <p className="section-code">CREDENTIAL LEDGER</p>
                <h3 id="credentials-title">Certifications</h3>
              </div>
              <div className="credential-ledger">
                {certifications.map(([issuer, title, year], index) => (
                  <a
                    href="/docs/certificats.pdf"
                    target="_blank"
                    rel="noreferrer"
                    key={`${issuer}-${title}`}
                  >
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{issuer}</strong>
                    <p>{title}</p>
                    <time>{year}</time>
                  </a>
                ))}
              </div>
            </section>

            <section aria-labelledby="education-title">
              <div className="ledger-head">
                <p className="section-code">EDUCATION RECORD</p>
                <h3 id="education-title">Formation</h3>
              </div>
              <div className="education-list">
                {education.map((item) => (
                  <article key={item.period}>
                    <time>{item.period}</time>
                    <h4>{item.degree}</h4>
                    <p>{item.field}</p>
                    <small>{item.school}</small>
                  </article>
                ))}
              </div>
              <article className="activity-card">
                <p className="section-code">TEAM / ENSET</p>
                <h4>Vice-président — Shell Eco-Marathon</h4>
                <p>
                  Planification, logistique et gestion technique d&apos;une
                  conférence internationale sur l&apos;automatisation.
                </p>
              </article>
            </section>
          </div>
        </section>

        <section className="contact-section dark-grid" id="contact">
          <div className="contact-copy">
            <p className="section-code">COMMISSIONING REQUEST / ONLINE</p>
            <h2>Mettons un nouveau système en service.</h2>
            <p>
              Automatisation, supervision, instrumentation ou digitalisation :
              décrivez le besoin, le backend sécurisé enregistre votre demande.
            </p>
            <div className="direct-contact">
              <a href="mailto:elmenichioussama@gmail.com">
                <span>E-MAIL</span>
                elmenichioussama@gmail.com
              </a>
              <a href="tel:+212697729378">
                <span>TÉLÉPHONE</span>
                +212 697 729 378
              </a>
              <a
                href="https://www.linkedin.com/in/oussamaelmenichi/"
                target="_blank"
                rel="noreferrer"
              >
                <span>LINKEDIN</span>
                in/oussamaelmenichi ↗
              </a>
            </div>
          </div>

          <form ref={formRef} className="contact-form" onSubmit={submitContact}>
            <div className="form-header">
              <span>REQ / NEW</span>
              <span>
                <i aria-hidden="true" /> CHANNEL SECURE
              </span>
            </div>
            <div className="field-grid">
              <label>
                <span>Nom *</span>
                <input
                  name="name"
                  autoComplete="name"
                  required
                  minLength={2}
                  maxLength={80}
                  aria-invalid={Boolean(fieldErrors.name)}
                  aria-describedby={fieldErrors.name ? "name-error" : undefined}
                />
                {fieldErrors.name && (
                  <small className="field-error" id="name-error">
                    {fieldErrors.name}
                  </small>
                )}
              </label>
              <label>
                <span>E-mail *</span>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  maxLength={254}
                  aria-invalid={Boolean(fieldErrors.email)}
                  aria-describedby={
                    fieldErrors.email ? "email-error" : undefined
                  }
                />
                {fieldErrors.email && (
                  <small className="field-error" id="email-error">
                    {fieldErrors.email}
                  </small>
                )}
              </label>
            </div>
            <div className="field-grid">
              <label>
                <span>Organisation</span>
                <input
                  name="organization"
                  autoComplete="organization"
                  maxLength={100}
                  aria-invalid={Boolean(fieldErrors.organization)}
                />
              </label>
              <label>
                <span>Type de mission</span>
                <select name="subject" defaultValue="Automatisation / DCS">
                  <option>Automatisation / DCS</option>
                  <option>SCADA / HMI</option>
                  <option>Instrumentation</option>
                  <option>Data / IA industrielle</option>
                  <option>Autre collaboration</option>
                </select>
              </label>
            </div>
            <label>
              <span>Message *</span>
              <textarea
                name="message"
                required
                minLength={10}
                maxLength={3000}
                rows={6}
                placeholder="Contexte, procédé, objectifs, échéance…"
                aria-invalid={Boolean(fieldErrors.message)}
                aria-describedby={
                  fieldErrors.message ? "message-error" : undefined
                }
              />
              {fieldErrors.message && (
                <small className="field-error" id="message-error">
                  {fieldErrors.message}
                </small>
              )}
            </label>
            <label className="honeypot" aria-hidden="true">
              Site web
              <input
                name="website"
                tabIndex={-1}
                autoComplete="off"
                defaultValue=""
              />
            </label>
            <button
              className="transmit-button"
              type="submit"
              disabled={contactState.phase === "sending"}
            >
              {contactState.phase === "sending"
                ? "Transmission…"
                : "Transmettre la demande"}
              <Arrow />
            </button>
            <div className="form-status" aria-live="polite">
              {contactState.phase === "success" && (
                <p className="status-success">
                  Signal reçu. Merci — je vous répondrai rapidement.
                  {contactState.reference && (
                    <small>Référence : {contactState.reference}</small>
                  )}
                </p>
              )}
              {contactState.phase === "error" && (
                <p className="status-error">{contactState.message}</p>
              )}
            </div>
          </form>
        </section>
      </main>

      <footer className="site-footer">
        <div>
          <strong>OEM / I&amp;C ENGINEER</strong>
          <p>Automatisation · Instrumentation · DCS · SCADA · IA industrielle</p>
        </div>
        <p>© 2026 Oussama El Menichi</p>
        <a href="#top">
          Retour en haut <Arrow />
        </a>
      </footer>

      <dialog
        ref={dialogRef}
        className="project-dialog"
        aria-labelledby="dialog-title"
        onKeyDown={onGalleryKeyDown}
        onClose={() => {
          setSelectedProject(null);
          lastTriggerRef.current?.focus();
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) closeProject();
        }}
      >
        {selectedProject && (
          <div className="dialog-shell">
            <div className="dialog-head">
              <div>
                <p>
                  CASE / {selectedProject.number} · {selectedProject.code}
                </p>
                <h2 id="dialog-title">{selectedProject.title}</h2>
              </div>
              <button type="button" onClick={closeProject} aria-label="Fermer">
                Fermer ×
              </button>
            </div>
            <figure className="dialog-figure">
              <Image
                src={selectedProject.gallery[imageIndex].src}
                alt={selectedProject.gallery[imageIndex].alt}
                width={1376}
                height={768}
              />
              <figcaption>
                <span>
                  {String(imageIndex + 1).padStart(2, "0")} /{" "}
                  {String(selectedProject.gallery.length).padStart(2, "0")}
                </span>
                {selectedProject.gallery[imageIndex].alt}
              </figcaption>
            </figure>
            <div className="dialog-controls">
              <button type="button" onClick={() => stepImage(-1)}>
                <Arrow direction="left" /> Précédente
              </button>
              <button type="button" onClick={() => stepImage(1)}>
                Suivante <Arrow />
              </button>
            </div>
            <div className="thumbnail-rail" aria-label="Images du projet">
              {selectedProject.gallery.map((galleryImage, index) => (
                <button
                  type="button"
                  key={`${galleryImage.src}-${index}`}
                  aria-current={imageIndex === index ? "true" : undefined}
                  aria-label={`Afficher l'image ${index + 1}`}
                  onClick={() => setImageIndex(index)}
                >
                  <Image
                    src={galleryImage.src}
                    alt=""
                    width={160}
                    height={90}
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
