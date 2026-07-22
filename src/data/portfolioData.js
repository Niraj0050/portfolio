export const personalData = {
  name: "Pandit Nirajkumar Balistar",
  title: "Full Stack Web Developer",
  tagline: "Building scalable web applications, modern responsive interfaces, and robust backend systems.",
  location: "Surat / Vapi / Valsad, Gujarat, India",
  email: "nirajkumar851127@gmail.com",
  phone: "+91 8733919321",
  linkedin: "https://linkedin.com/in/niraj0050",
  github: "https://github.com/niraj0050",
  availability: "Available for Full-Stack Developer Roles",
  summary: `Computer Science graduate with hands-on experience in full-stack web development, responsive website design, and WordPress development. Proficient in React.js, PHP, JavaScript, Python, MySQL, and modern web technologies, with practical exposure to UI design, database optimization, and collaborative software development.`
};

export const educationData = [
  {
    id: "vnsgu",
    institution: "Veer Narmad South Gujarat University",
    location: "Surat, Gujarat",
    degree: "Bachelor of Science in Computer Science (B.Sc. CS)",
    grade: "CGPA: 6.64",
    duration: "June 2023 – May 2026",
    description: "Core coursework focused on Data Structures, Database Management Systems (DBMS), Web Technologies, Object-Oriented Programming, and Software Engineering principles."
  },
  {
    id: "smv",
    institution: "Shree Maruti Vidhyapith - Valsad",
    location: "Valsad, Gujarat",
    degree: "Higher Secondary (HSC - Science Stream)",
    grade: "Completed",
    duration: "Aug 2021 – May 2023",
    description: "Specialized in Computer Applications, Physics, Chemistry, and Mathematics."
  }
];

export const experienceData = [
  {
    id: "enlightened",
    role: "Full Stack Web Developer Intern",
    company: "Enlightened Digital Marketing",
    location: "Vapi, Gujarat",
    duration: "Feb 2026 – Present",
    type: "Internship",
    bulletPoints: [
      "Developed and maintained responsive web applications using HTML, CSS, JavaScript, React.js, PHP, and WordPress.",
      "Engineered dynamic and user-friendly web pages by implementing modern frontend design patterns and mobile-first layouts.",
      "Collaborated closely with senior developers and project teams to deliver client-tailored web solutions within strict deadlines.",
      "Identified, debugged, and resolved cross-browser compatibility issues, improving overall site stability and UX."
    ],
    technologies: ["React.js", "PHP", "JavaScript", "WordPress", "MySQL", "HTML5/CSS3"]
  }
];

export const projectsData = [
  {
    id: "student-record",
    title: "Student Record Management System",
    category: "Desktop Apps",
    tags: ["Python", "Tkinter", "MySQL", "GUI"],
    shortDesc: "A desktop application designed to manage student records efficiently with complete CRUD operations and relational MySQL storage.",
    fullDesc: "Engineered a robust database-driven desktop software for managing student profiles, enrollment details, grades, and academic logs. Features an intuitive Tkinter graphical user interface paired with a MySQL backend for persistent, relational data management.",
    features: [
      "Full CRUD operations (Create, Read, Update, Delete) for student records",
      "Real-time database search and filter by ID, Name, or Stream",
      "Input data validation to prevent duplicate entries and SQL errors",
      "Structured relational MySQL database schema design"
    ],
    github: "https://github.com/niraj0050/Student-Record-Management-System",
    demo: "#"
  },
  {
    id: "portfolio-website",
    title: "Personal Portfolio Website",
    category: "Web Applications",
    tags: ["React.js", "JavaScript", "HTML5", "CSS3", "Vite"],
    shortDesc: "A high-performance, responsive personal portfolio showcasing projects, technical skills, and experience with a modern UI design.",
    fullDesc: "Designed and developed a multi-page interactive web portfolio highlighting achievements, education, and career experience. Built with modular React components, glassmorphism design accents, dark/light theme switcher, and smooth navigation.",
    features: [
      "Clean modular component architecture built with React 18 & Vite",
      "Dark and Light theme switching with CSS variables",
      "Interactive project category filter and modal case studies",
      "SEO optimized structure and fully responsive mobile-first layout"
    ],
    github: "https://github.com/niraj0050/portfolio",
    demo: "https://nirajbalistar.dev"
  },
  {
    id: "ml-mini-project",
    title: "Machine Learning Mini Project",
    category: "Machine Learning",
    tags: ["Python", "Pandas", "Scikit-Learn", "Matplotlib"],
    shortDesc: "End-to-end data preprocessing pipeline and predictive machine learning models built for statistical analysis and classification tasks.",
    fullDesc: "Developed a predictive modeling workflow utilizing Scikit-learn and Pandas. Conducted exploratory data analysis, handled missing values and outliers, engineered feature sets, and trained classification models for predictive evaluation.",
    features: [
      "Comprehensive data cleaning, normalization, and feature scaling using Pandas",
      "Supervised machine learning model training and hyperparameter evaluation",
      "Visual performance breakdown using Matplotlib plots and confusion matrices",
      "Model evaluation using Accuracy, Precision, Recall, and F1-Score metrics"
    ],
    github: "https://github.com/niraj0050/ML-Mini-Project",
    demo: "#"
  }
];

export const skillsData = {
  languages: [
    { name: "JavaScript (ES6+)", level: 88 },
    { name: "PHP", level: 85 },
    { name: "Python", level: 82 },
    { name: "HTML5 & CSS3", level: 92 },
    { name: "C / C++", level: 75 },
    { name: "Java", level: 70 }
  ],
  frameworks: [
    { name: "React.js", level: 86 },
    { name: "Next.js", level: 75 },
    { name: "Node.js", level: 78 },
    { name: "WordPress", level: 85 }
  ],
  databases: [
    { name: "MySQL", level: 88 },
    { name: "MongoDB", level: 75 },
    { name: "PostgreSQL", level: 72 },
    { name: "SQLite", level: 80 }
  ],
  tools: [
    "Git", "GitHub", "VS Code", "Visual Studio", "IntelliJ IDEA", "XAMPP / Apache"
  ],
  libraries: [
    "Pandas", "NumPy", "Matplotlib", "Scikit-Learn", "Tkinter", "React Router"
  ],
  softSkills: [
    { name: "Teamwork & Collaboration", icon: "Users" },
    { name: "Problem Solving", icon: "Brain" },
    { name: "Communication", icon: "MessageSquare" },
    { name: "Time Management", icon: "Clock" },
    { name: "Quick Learning & Adaptability", icon: "Zap" }
  ]
};
