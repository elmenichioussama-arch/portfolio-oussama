export type ProjectId =
  | "gapp"
  | "pfa"
  | "scada"
  | "ims"
  | "initiation"
  | "licence";

export type ProjectDiscipline =
  | "DCS"
  | "SCADA"
  | "Instrumentation"
  | "Industrie 4.0"
  | "IA";

export type GalleryImage = {
  src: string;
  alt: string;
};

export type Project = {
  id: ProjectId;
  number: string;
  code: string;
  period: string;
  organization: string;
  location?: string;
  title: string;
  summary: string;
  cover: GalleryImage;
  disciplines: ProjectDiscipline[];
  technologies: string[];
  highlights: string[];
  metrics: Array<{ value: string; label: string }>;
  documents: Array<{
    label: string;
    href: string;
    download?: boolean;
  }>;
  gallery: GalleryImage[];
  featured?: boolean;
};

const image = (file: string, alt: string): GalleryImage => ({
  src: `/assets/img/${file}`,
  alt
});

const scadaShared = [
  image("scada-1.jpg", "Burner & Waste Heat Boiler — vue opérateur"),
  image("scada-2.jpg", "Unité de production d'acide sulfurique"),
  image("scada-3.jpg", "Chaudières SRC"),
  image("scada-4.jpg", "Tour finale — circuit soufre"),
  image("scada-5.jpg", "Circuit air et soufflantes"),
  image("scada-6.jpg", "Injection ammoniac et hydrazine"),
  image("scada-7.jpg", "Dashboard web JFC2 — unité sulfurique"),
  image("scada-8.jpg", "Flux Node-RED et OPC UA")
];

export const projects: Project[] = [
  {
    id: "gapp",
    number: "01",
    code: "OEM-PFE-2026",
    period: "2026",
    organization: "VINCI Energies — Actemium Process",
    location: "UM6P / OCP, Jorf Lasfar",
    title:
      "GAPP — Instrumentation, DCS et plateforme IA pour l'ammoniac vert",
    summary:
      "Étude I&C complète de l'usine pilote d'ammoniac vert GAPP, architecture Honeywell Experion PKS et développement de DigitPlant, une plateforme intelligente de gestion des données techniques.",
    cover: image(
      "gapp-ihm-scada-haute-performance-isa-101.jpg",
      "IHM SCADA haute performance ISA-101 du projet GAPP"
    ),
    disciplines: ["Instrumentation", "DCS", "SCADA", "IA"],
    technologies: [
      "Experion PKS",
      "C300",
      "ATEX",
      "IS / NIS",
      "YOLOv11",
      "n8n",
      "AutoCAD",
      "React"
    ],
    highlights: [
      "Analyse de 24 P&ID et constitution d'une I/O List de 101 signaux",
      "Zonage ATEX H₂ groupe IIC, philosophie IS/NIS et sélection instruments",
      "Architecture DCS C300 redondante, réseau FTE et vues opérateur ISA-101",
      "Détection d'instruments par YOLOv11 et génération de livrables par agents n8n"
    ],
    metrics: [
      { value: "24", label: "P&ID analysés" },
      { value: "101", label: "signaux I/O" },
      { value: "4 MTPD", label: "capacité pilote" },
      { value: "23", label: "livrables visuels" }
    ],
    documents: [
      { label: "Rapport PFE", href: "/docs/rapport-pfe-gapp.pdf" },
      {
        label: "Présentation",
        href: "/docs/presentation-pfe-gapp.pptx",
        download: true
      }
    ],
    gallery: [
      image(
        "gapp-gapp.jpg",
        "Vue d'ensemble du projet GAPP — usine pilote d'ammoniac vert"
      ),
      image(
        "gapp-ihm-scada-haute-performance-isa-101.jpg",
        "IHM SCADA haute performance ISA-101"
      ),
      image("gapp-scada.jpg", "Vue SCADA du procédé"),
      image(
        "gapp-detection-yolov11-sur-p-id.jpg",
        "Détection d'instruments sur P&ID par YOLOv11"
      ),
      image(
        "gapp-pipeline-multi-agents-n8n.jpg",
        "Pipeline multi-agents n8n — génération des livrables"
      ),
      image(
        "gapp-degiplant.jpg",
        "Plateforme DigitPlant — gestion des données techniques"
      ),
      image("gapp-app.jpg", "Application DigitPlant"),
      image("gapp-io-liste.jpg", "I/O List — classification des signaux"),
      image(
        "gapp-architecture-jb-grp.jpg",
        "Architecture des boîtes de jonction"
      ),
      image(
        "gapp-armoire-de-brassage-controleurs-c300.jpg",
        "Armoire de brassage et contrôleurs Honeywell C300"
      ),
      image(
        "gapp-infrastructure-serveur-experion-pks.jpg",
        "Infrastructure serveur Experion PKS"
      ),
      image(
        "gapp-reseau-redondant-fte-honeywell.jpg",
        "Réseau redondant FTE Honeywell"
      ),
      image("gapp-separation-pcs-esd.jpg", "Séparation PCS et ESD"),
      image("gapp-atex.jpg", "Zonage ATEX"),
      image("gapp-is-vs-nis-philosophy.jpg", "Philosophie IS vs NIS"),
      image(
        "gapp-borniers-a-ressort-is-vs-nis.jpg",
        "Borniers à ressort IS vs NIS"
      ),
      image(
        "gapp-benchmarking-instruments.jpg",
        "Benchmarking des instruments"
      ),
      image("gapp-autocade.jpg", "Schémas AutoCAD"),
      image("gapp-passerelles-de-cables.jpg", "Passerelles de câbles"),
      image("gapp-pem.jpg", "Électrolyseur PEM"),
      image("gapp-psa.jpg", "Unité PSA — production d'azote"),
      image(
        "gapp-stockage-atmospherique-ammoniac.jpg",
        "Stockage atmosphérique d'ammoniac"
      ),
      image("gapp-3d-digital-twin-cad.jpg", "Jumeau numérique 3D CAD")
    ],
    featured: true
  },
  {
    id: "pfa",
    number: "02",
    code: "PFA-2025",
    period: "2025",
    organization: "OCP Group",
    location: "Jorf Lasfar — JFC2",
    title: "Redémarrage automatisé d'une unité sulfurique après arrêt chaud",
    summary:
      "Conception de la séquence de redémarrage et d'une supervision temps réel interfacée au DCS Yokogawa CENTUM VP pour améliorer fiabilité, sécurité et disponibilité.",
    cover: image(
      "pfa-1.jpg",
      "Supervision du redémarrage de l'unité sulfurique JFC2"
    ),
    disciplines: ["DCS", "SCADA", "Industrie 4.0"],
    technologies: ["CENTUM VP", "Node-RED", "OPC UA", "Supervision temps réel"],
    highlights: [
      "Analyse terrain du procédé sulfurique et des séquences critiques",
      "Interface temps réel avec le DCS Yokogawa CENTUM VP",
      "Aide opérateur pour un redémarrage plus fiable et plus sûr"
    ],
    metrics: [
      { value: "14", label: "vues techniques" },
      { value: "24/7", label: "supervision" }
    ],
    documents: [
      { label: "Rapport", href: "/docs/rapport-pfa-ocp-2025.pdf" }
    ],
    gallery: [
      ...Array.from({ length: 6 }, (_, index) =>
        image(
          `pfa-${index + 1}.jpg`,
          `Supervision JFC2 — vue ${index + 1}`
        )
      ),
      ...scadaShared
    ]
  },
  {
    id: "scada",
    number: "03",
    code: "SCADA-VIEWS",
    period: "2024 — 2026",
    organization: "Portfolio de supervision",
    title: "Interfaces opérateur pour procédés industriels complexes",
    summary:
      "Une collection de vues de conduite développées pour fours, chaudières, unités sulfuriques et dashboards web, avec une approche haute performance inspirée ISA-101.",
    cover: image("scada-1.jpg", "Vue SCADA Burner and Waste Heat Boiler"),
    disciplines: ["SCADA", "Industrie 4.0"],
    technologies: ["HMI", "ISA-101", "Dashboards web", "Node-RED"],
    highlights: [
      "Hiérarchie visuelle centrée sur la situation opérateur",
      "Intégration de données temps réel via OPC UA",
      "Vues desktop et dashboards web complémentaires"
    ],
    metrics: [
      { value: "10", label: "vues opérateur" },
      { value: "ISA-101", label: "référentiel HMI" }
    ],
    documents: [
      { label: "Dossier PDF", href: "/docs/scada-vues-projets.pdf" }
    ],
    gallery: [
      ...scadaShared,
      image("scada-9.jpg", "Vue syngas — séparateur"),
      image("scada-10.jpg", "Vue syngas — ballon V-5202")
    ]
  },
  {
    id: "ims",
    number: "04",
    code: "IMS-1.5",
    period: "2024 — 2025",
    organization: "ENSET Mohammedia",
    title: "Pilotage distant d'un système de transport cyber-physique",
    summary:
      "Automatisation du système IMS 1.5, supervision HMI et passerelle IIoT Node-RED pour le pilotage et la surveillance à distance.",
    cover: image("ims-1.jpg", "Système de transport cyber-physique IMS 1.5"),
    disciplines: ["SCADA", "Industrie 4.0"],
    technologies: ["HMI", "Node-RED", "IIoT", "Industrie 4.0"],
    highlights: [
      "Automatisation de la séquence de transport",
      "Interface web de pilotage à distance",
      "Chaîne complète terrain, contrôle et visualisation"
    ],
    metrics: [
      { value: "IIoT", label: "architecture" },
      { value: "2", label: "interfaces" }
    ],
    documents: [
      { label: "Rapport", href: "/docs/rapport-projet-ims.pdf" }
    ],
    gallery: [
      image("ims-1.jpg", "Système de transport cyber-physique IMS 1.5"),
      image("ims-2.jpg", "Supervision IMS 1.5 — Industrie 4.0")
    ]
  },
  {
    id: "initiation",
    number: "05",
    code: "INIT-2024",
    period: "2024",
    organization: "Roca Maroc S.A.",
    title: "Automatisation d'une machine de concassage manuelle",
    summary:
      "Dimensionnement électrique, analyse fonctionnelle, programmation S7-1500 sous TIA Portal et interface HMI WinCC pour suivre le procédé en temps réel.",
    cover: image(
      "initiation-1.jpg",
      "Automatisation d'une machine de concassage chez Roca Maroc"
    ),
    disciplines: ["SCADA", "Instrumentation"],
    technologies: ["TIA Portal", "S7-1500", "WinCC", "Caneco BT"],
    highlights: [
      "Dimensionnement électrique sous Caneco BT",
      "Programme automate S7-1500",
      "Interface HMI WinCC temps réel"
    ],
    metrics: [
      { value: "S7-1500", label: "automate" },
      { value: "4", label: "livrables visuels" }
    ],
    documents: [
      {
        label: "Rapport",
        href: "/docs/rapport-initiation-roca-2024.pdf"
      }
    ],
    gallery: [
      image("initiation-1.jpg", "Machine de concassage — vue 1"),
      image("initiation-2.jpg", "Machine de concassage — vue 2"),
      image("initiation-3.jpg", "Programmation TIA Portal"),
      image("initiation-4.jpg", "Interface HMI WinCC")
    ]
  },
  {
    id: "licence",
    number: "06",
    code: "LP-2023",
    period: "2023",
    organization: "OCP Group",
    location: "Jorf Lasfar — JFC2",
    title: "Mesure automatisée des pertes de charge d'une ligne sulfurique",
    summary:
      "Système Industrie 4.0 basé sur Node-RED et OPC UA, avec supervision temps réel, indicateurs de performance et alertes process.",
    cover: image(
      "licence-1.jpg",
      "Système de mesure des pertes de charge — OCP 2023"
    ),
    disciplines: ["SCADA", "Industrie 4.0"],
    technologies: ["Node-RED", "OPC UA", "KPIs", "Supervision"],
    highlights: [
      "Acquisition automatique des grandeurs process",
      "Calcul et visualisation des KPIs",
      "Alertes temps réel pour l'aide à l'exploitation"
    ],
    metrics: [
      { value: "OPC UA", label: "connectivité" },
      { value: "3", label: "vues projet" }
    ],
    documents: [
      {
        label: "Rapport",
        href: "/docs/rapport-licence-ocp-2023.pdf"
      }
    ],
    gallery: [
      image("licence-1.jpg", "Mesure des pertes de charge — vue 1"),
      image("licence-2.jpg", "Mesure des pertes de charge — vue 2"),
      image("licence-3.jpg", "Supervision Node-RED et OPC UA")
    ]
  }
];

export const signalLayers = [
  {
    code: "01 / FIELD",
    title: "Instrumentation",
    description: "Transformer le procédé physique en signaux fiables.",
    items: ["P&ID", "Capteurs", "Transmetteurs", "Vannes", "ATEX", "HART"]
  },
  {
    code: "02 / CONTROL",
    title: "PLC & DCS",
    description: "Concevoir une logique de contrôle sûre et maintenable.",
    items: [
      "S7-1500",
      "Experion PKS",
      "CENTUM VP",
      "PCS 7",
      "GRAFCET",
      "PID"
    ]
  },
  {
    code: "03 / SUPERVISION",
    title: "SCADA & IIoT",
    description: "Rendre l'installation lisible et actionnable.",
    items: ["ISA-101", "WinCC", "Ignition", "Node-RED", "OPC UA", "PI Vision"]
  },
  {
    code: "04 / INTELLIGENCE",
    title: "Data & IA",
    description: "Accélérer l'ingénierie et révéler les données utiles.",
    items: ["Python", "YOLOv11", "n8n", "React", "MATLAB", "scikit-learn"]
  }
];

export const experiences = [
  {
    period: "FÉV. 2026 — PRÉSENT",
    organization: "VINCI Energies — Actemium Process",
    role: "Ingénieur stagiaire PFE — Instrumentation & DCS",
    items: [
      "Étude technico-fonctionnelle hydrogène et ammoniac vert",
      "I/O List, JB, câbles, schémas AutoCAD, ATEX et PCS/ESD",
      "Architecture DCS, vues SCADA et matrice Cause & Effet",
      "DigitPlant, analyse P&ID par YOLOv11 et agents n8n"
    ]
  },
  {
    period: "JUIL. — SEPT. 2025",
    organization: "OCP Group — Jorf Lasfar",
    role: "Stagiaire ingénieur PFA — Automatisation & digitalisation",
    items: [
      "Automatisation du redémarrage après arrêt chaud de JFC2",
      "Supervision temps réel interfacée au DCS Yokogawa"
    ]
  },
  {
    period: "JUIL. — AOÛT 2024",
    organization: "Roca Maroc S.A.",
    role: "Stagiaire projet — Automatisation & électricité industrielle",
    items: [
      "Dimensionnement d'une unité de concassage sous Caneco BT",
      "Automatisation S7-1500 et HMI WinCC"
    ]
  },
  {
    period: "MAI — JUIL. 2023",
    organization: "OCP Group — JFC2",
    role: "Stagiaire PFE Licence Pro — Industrie 4.0",
    items: [
      "Système Node-RED et OPC UA de mesure des pertes de charge",
      "Supervision temps réel, KPIs et alertes process"
    ]
  }
];

export const certifications = [
  ["SIEMENS", "TIA Portal — Introduction to the SCL Programming Language", "2025"],
  ["SOLISPLC", "Getting Started with Siemens TIA Portal Programming", "2025"],
  ["LINKEDIN", "Learning Industrial Automation", "2025"],
  ["UDEMY", "Python for Deep Learning: Build Neural Networks in Python", "2025"],
  ["CISCO", "Introduction to IoT", "2025"],
  ["UC IRVINE", "The Arduino Platform and C Programming", "2024"],
  [
    "UC IRVINE",
    "Introduction to the Internet of Things and Embedded Systems",
    "2024"
  ],
  ["MATHWORKS", "MATLAB Onramp — 100 %", "2024"]
] as const;

export const education = [
  {
    period: "2023 — 2026",
    degree: "Diplôme d'Ingénieur d'État",
    field: "Génie Électrique & Contrôle des Systèmes Industriels",
    school: "ENSET Mohammedia — Université Hassan II Casablanca"
  },
  {
    period: "2022 — 2023",
    degree: "Licence Professionnelle",
    field: "Électronique & Informatique Industrielle",
    school: "Université Chouaïb Doukkali — El Jadida"
  },
  {
    period: "2020 — 2022",
    degree: "BTS",
    field: "Électromécanique & Systèmes Automatisés",
    school: "Lycée Technique Qualifiant de Settat"
  },
  {
    period: "2017 — 2020",
    degree: "Baccalauréat",
    field: "Sciences & Technologies Électriques",
    school: "Lycée Technique Qualifiant de Settat"
  }
];
