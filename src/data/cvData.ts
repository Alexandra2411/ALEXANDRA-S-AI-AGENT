import { CvData } from "../types";

export const cvDataEn: CvData = {
  name: "Alexandra Filali",
  title: "Student at ESCE International Business School",
  contact: {
    phone: "+33 7 78 86 43 76",
    email: "alex.sf@outlook.fr",
    location: "75008 Paris, France",
  },
  education: [
    {
      title: "ESCE Business School",
      subtitle: "Specialization in Marketing",
      period: "2021 - 2026",
      location: "La Défense, Paris",
    },
    {
      title: "Tampere University",
      subtitle: "Erasmus exchange program",
      period: "2023",
      location: "Tampere, Finland",
    },
    {
      title: "High School Baccalaureate",
      subtitle: "Economics Major",
      period: "2020 - 2021",
      location: "Lycée Alphonse Daudet, Tarascon",
    },
  ],
  experiences: [
    {
      title: "Alternance Associate Marketing Research",
      subtitle: "Lilly France",
      period: "2024 - 2026",
      location: "Neuilly-sur-Seine, France",
      details: [
        "Analyzed qualitative and quantitative marketing data and tracked performance.",
        "Conducted competitive intelligence analyses on market trends.",
        "Synthesized findings and presented performance reports.",
        "Drafted briefings and closely coordinated campaigns with marketing agencies."
      ]
    },
    {
      title: "Meeting and Events Sales Trainee",
      subtitle: "Hôtel Dolce La Hulpe by Wyndham (6 months)",
      period: "2023",
      location: "Brussels, Belgium",
      details: [
        "Processed and responded to queries regarding high-profile events.",
        "Supervised events on-site to ensure smooth and successful execution.",
        "Helped drive and optimize event sales market share.",
        "Assisted commercial and marketing directors in strategic project delivery."
      ]
    },
    {
      title: "Sales Representative Intern",
      subtitle: "Château de la Gabelle (2 months)",
      period: "2022",
      location: "Saint Rémy de Provence, France",
      details: [
        "Welcomed clients and provided expert boutique style advice.",
        "Managed physical store transactions and retail operations.",
        "Prepared and packed online orders for shipping.",
        "Conducted targeted business-to-business (B2B) prospecting."
      ]
    },
    {
      title: "Job Shadowing Internship",
      subtitle: "Groupama Méditerranée (1 week)",
      period: "2017",
      location: "Avignon, France",
      details: [
        "Assisted with customer reception and answered incoming phone calls.",
        "Participated in sales meetings and met with diverse customer groups.",
        "Observed insurance contracting procedures and client management."
      ]
    }
  ],
  skills: [
    "Marketing Strategy",
    "Market Research",
    "Consumer Behavior Analysis",
    "SWOT Frameworks",
    "PESTEL Frameworks",
    "Event Management",
    "Microsoft Office Pack",
    "Canva Editing",
    "AI Tools Integration"
  ],
  languages: [
    { name: "French", level: "Native / Mother tongue" },
    { name: "English", level: "Fluent (TOEIC 900/990)" },
    { name: "Spanish", level: "Intermediate conversational" }
  ],
  extra: [
    {
      category: "Association President",
      description: "President of the 'Charity ESCE' nonprofit organization. Spearheaded charitable initiatives, social fundraising, and team management.",
      period: "2022"
    },
    {
      category: "Class Representative",
      description: "Liaised between students and university officials.",
      period: "2021 - 2022"
    },
    {
      category: "Hostess",
      description: "Welcoming host at the Monaco Formula 1 Grand Prix.",
      period: "2023 - 2024"
    }
  ]
};

export const cvDataFr: CvData = {
  name: "Alexandra Filali",
  title: "Étudiante à l'ESCE International Business School",
  contact: {
    phone: "+33 7 78 86 43 76",
    email: "alex.sf@outlook.fr",
    location: "75008 Paris, France",
  },
  education: [
    {
      title: "ESCE Business School",
      subtitle: "Spécialisation : Marketing",
      period: "2021 - 2026",
      location: "La Défense, Paris",
    },
    {
      title: "Tampere University",
      subtitle: "Erasmus à Tampere",
      period: "2023",
      location: "Tampere, Finlande",
    },
    {
      title: "Baccalauréat Economie",
      subtitle: "Lycée Alphonse Daudet",
      period: "2020 - 2021",
      location: "Tarascon, France",
    },
  ],
  experiences: [
    {
      title: "Alternance Associate Marketing Research",
      subtitle: "Lilly France",
      period: "2024 - 2026",
      location: "Neuilly-sur-Seine, France",
      details: [
        "Analyse de données marketing (quanti/quali) & suivi de la performance.",
        "Veille concurrentielle sur les tendances du marché.",
        "Synthèse et présentation des résultats aux équipes.",
        "Rédaction de briefs et coordination avec les agences partenaires."
      ]
    },
    {
      title: "Meeting and Events Sales Trainee (6 mois)",
      subtitle: "Hôtel Dolce La Hulpe by Wyndham",
      period: "2023",
      location: "Bruxelles, Belgique",
      details: [
        "Traiter les demandes d’évènements d'envergure.",
        "S’assurer du bon déroulement des évènements sur le terrain.",
        "Aider à gérer et améliorer la part de marché événementielle.",
        "Assister le directeur commercial et marketing dans la réalisation de projets."
      ]
    },
    {
      title: "Stagiaire commerciale (2 mois)",
      subtitle: "Château de la Gabelle",
      period: "2022",
      location: "Saint Rémy de Provence, France",
      details: [
        "Accueil et conseils auprès des clients en boutique.",
        "Vente physique en boutique et tenue de caisse.",
        "Préparation de commandes et logistique d'expédition.",
        "Prospection commerciale B2B ciblée."
      ]
    },
    {
      title: "Stage d’observation (1 semaine)",
      subtitle: "Groupama Méditerranée",
      period: "2017",
      location: "Avignon, France",
      details: [
        "Accueil des clients et réception des appels téléphoniques.",
        "Participation active aux réunions et présentations commerciales.",
        "Visite de la clientèle auprès de conseillers terrain, observation de contrats."
      ]
    }
  ],
  skills: [
    "Stratégie Marketing",
    "Étude de marché",
    "Analyse consommateurs",
    "Frameworks SWOT & PESTEL",
    "Gestion Événementielle",
    "Pack Office",
    "Canva & Design créatif",
    "Outils & Intégration IA"
  ],
  languages: [
    { name: "Français", level: "Langue maternelle" },
    { name: "Anglais", level: "Courant (TOEIC 900/990)" },
    { name: "Espagnol", level: "Bon niveau conversationnel" }
  ],
  extra: [
    {
      category: "Présidente d'Association",
      description: "Présidente de l'association 'Charity ESCE' à but caritatif (2022). Coordination d'événements humanitaires et actions sociales.",
      period: "2022"
    },
    {
      category: "Représentante de classe",
      description: "Intermédiaire directe entre la direction et les étudiants.",
      period: "2021 - 2022"
    },
    {
      category: "Hôtesse d'accueil",
      description: "Hôtesse événementielle au Grand Prix de F1 de Monaco.",
      period: "2023 - 2024"
    }
  ]
};
