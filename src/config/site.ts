export const siteConfig = {
  name: "Mhd. Mahmudi Zukri Lubis",
  shortName: "Mahmudi Zukri",
  title: "AI Engineer & Full-Stack Developer",
  bio: "I am an AI Engineer and Full-Stack Developer with a deep specialization in Mobile. While my core expertise lies in building intelligent mobile applications using Flutter, I also craft modern web experiences and architect robust backends using BaaS platforms like Supabase, Firebase, and InsForge.",
  url: "https://mahmudizukri-portfolio.web.app",
  resumeUrl: "",
  avatarUrl: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200&h=200",
  
  social: {
    github: "https://github.com/MahmudiZukri",
    linkedin: "https://www.linkedin.com/in/mahmudizukri/",
    twitter: "",
    email: "mahmudizukri@gmail.com"
  },

  navItems: [
    { name: "About", href: "#about" },
    { name: "Experience", href: "#experience" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" }
  ],

  experience: [
    {
      company: "Indie Developer",
      role: "Mobile & AI Engineer",
      dateRange: "Present",
      achievements: [
        "Developing cross-platform mobile applications using Flutter.",
        "Integrating AI features into applications.",
        "Architecting backends using BaaS solutions like Supabase, Firebase, and InsForge."
      ]
    }
  ],

  skills: {
    frontend: [
      { name: "Flutter", level: 95 },
      { name: "Dart", level: 95 },
      { name: "Next.js", level: 80 },
      { name: "React", level: 80 }
    ],
    backend: [
      { name: "Supabase", level: 90 },
      { name: "Firebase", level: 90 },
      { name: "InsForge", level: 85 },
      { name: "Node.js", level: 75 }
    ],
    tools: [
      { name: "Git & GitHub", level: 90 },
      { name: "AI Integration", level: 85 }
    ]
  },

  aiContext: `
    You are an AI assistant representing Mhd.Mahmudi Zukri Lubis, an AI Engineer and Full-Stack Developer.
    Here is his bio: "I am an AI Engineer and Full-Stack Developer with a deep specialization in Mobile. While my core expertise lies in building intelligent mobile applications using Flutter, I also craft modern web experiences and architect robust backends using BaaS platforms like Supabase, Firebase, and InsForge."
    
    Work Experience:
    - AI & Full-Stack Engineer: Developing Flutter mobile apps, Next.js/React web apps, integrating AI, and building backends with Supabase/Firebase/InsForge.
    
    Key Skills: AI Integration, Flutter, Dart, Next.js, React, Supabase, Firebase, InsForge.
    
    When prospective clients ask, emphasize that Mahmudi is a Full-Stack developer who can handle web, backend, and AI, but his absolute specialty and deepest expertise is in Mobile development.
    Answer questions concisely and professionally as if you are acting on behalf of Mahmudi. If you don't know the answer based on this context, politely say so. Provide links to the contact section (#contact) for business inquiries.
  `
};

export type SiteConfig = typeof siteConfig;
