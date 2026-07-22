# Website Page & Section Architecture Specification
**Developer:** Pandit Nirajkumar Balistar  
**Role:** Full Stack Web Developer  
**Project:** Personal Portfolio Website  

---

## 📊 Summary Overview

| Metric | Total Count |
| :--- | :--- |
| **Total Pages** | **5 Primary Pages** (+ 1 Dynamic Case Study Template) |
| **Total Sections** | **18 Sections** across all pages |
| **Global Components** | Header / Navbar, Footer, Back-to-Top Button, Theme Switcher |

---

## 🧭 Global Components (Present on All Pages)

1. **Header / Sticky Navigation Bar:**
   * Logo (`<Niraj.Dev />` / `Pandit Nirajkumar`)
   * Main Nav Links (Home, About, Skills, Projects, Contact)
   * Theme Switcher (Dark / Light Mode Toggle)
   * CTA Button: "Download Resume" (PDF)
2. **Footer:**
   * Copyright Notice & Social Links (LinkedIn, GitHub, Email, Phone)
   * Quick Sitemap Links
   * Back-to-Top Button

---

## 📄 Detailed Page-by-Page & Section-by-Section Breakdown

---

### 🏠 PAGE 1: Home Page (`index.php` / `index.html`)
> **Goal:** High-impact first impression showcasing core role, tech badges, featured projects, and quick contact access.
> **Total Sections:** 5 Sections

* **Section 1: Hero Banner**
  * Greeting & Headline: *"Hi, I'm Pandit Nirajkumar Balistar 👋"*
  * Sub-headline: *"Full Stack Web Developer | React.js, PHP & MySQL"*
  * Tech Stack Badges: React, PHP, JavaScript, MySQL, Python, Node.js
  * CTAs: `"Explore Projects"` (Primary) | `"Contact Me"` (Secondary)
* **Section 2: About Quick Highlights**
  * Brief introduction paragraph.
  * 3 Key Feature Cards: *Web Application Development*, *Responsive UI/UX Design*, *Database & Backend Integration*.
  * Metric Counter Badges (3+ Projects Completed, 8+ Languages & Frameworks Mastered).
* **Section 3: Featured Projects Showcase**
  * Highlight cards for top 3 projects (Student Record Management System, Portfolio Site, ML Mini Project).
  * Direct action buttons: "Live Demo", "View Code (GitHub)".
* **Section 4: Key Skills Snapshot**
  * Icon grid of top technical skills (React.js, PHP, JavaScript, Python, MySQL, Git).
  * Link to full Skills Page.
* **Section 5: Quick Contact CTA Banner**
  * Callout banner: *"Have a project in mind or looking for a Full-Stack Developer?"*
  * Quick inquiry button leading to Contact page.

---

### 👤 PAGE 2: About & Experience Page (`about.php` / `about.html`)
> **Goal:** In-depth professional bio, education history, work experience, and soft skills.
> **Total Sections:** 4 Sections

* **Section 1: Detailed Professional Bio**
  * Extended summary of computer science background, technical interests, and passion for web development.
* **Section 2: Academic Education Timeline**
  * **Bachelor of Science in Computer Science (B.Sc. CS)** — *Veer Narmad South Gujarat University, Surat (2023 – 2026 | CGPA: 6.64)*
  * **Higher Secondary (HSC)** — *Shree Maruti Vidhyapith, Valsad (2021 – 2023)*
* **Section 3: Professional Work Experience**
  * **Full Stack Web Developer Intern** — *Enlightened Digital Marketing, Vapi (Feb 2026 – Present)*
  * Bulleted achievements: Responsive web app development, dynamic frontend design, bug fixing, team collaboration.
* **Section 4: Core & Soft Skills Summary**
  * Cards for Teamwork, Communication, Problem Solving, Time Management, and Quick Learning.

---

### 💻 PAGE 3: Projects Portfolio Page (`projects.php` / `projects.html`)
> **Goal:** Comprehensive showcase of all personal, desktop, and web projects with filter controls.
> **Total Sections:** 3 Sections

* **Section 1: Portfolio Banner & Interactive Filter Controls**
  * Page Title & Intro.
  * Category Filter Tabs: `All` | `Web Applications (React/PHP)` | `Desktop Apps (Python)` | `Machine Learning`
* **Section 2: Projects Gallery Grid**
  * **Card 1: Student Record Management System** (*Python, Tkinter, MySQL*)
    * Desktop app managing student records with CRUD operations & graphical UI.
  * **Card 2: Portfolio Website** (*React.js, HTML, CSS, JS*)
    * Modern responsive portfolio with reusable React components.
  * **Card 3: Machine Learning Mini Project** (*Python, Pandas, Scikit-learn*)
    * Data preprocessing, prediction model training, and evaluation.
* **Section 3: Project Detail Modal / Sub-Page View (Dynamic)**
  * Technical architecture explanation, database structure, features list, live demo & GitHub repository links.

---

### 🛠️ PAGE 4: Technical Skills Page (`skills.php` / `skills.html`)
> **Goal:** Complete matrix of technical stack, developer tools, and framework proficiency.
> **Total Sections:** 3 Sections

* **Section 1: Categorized Technical Skills Matrix**
  * **Programming Languages:** Python, PHP, JavaScript, C, C++, Java, HTML5, CSS3
  * **Frameworks & Web Tech:** React.js, Next.js, Node.js, WordPress
  * **Databases:** MySQL, MongoDB, PostgreSQL, SQLite
  * **Developer Tools:** Git, GitHub, VS Code, Visual Studio, IntelliJ IDEA
  * **Libraries & Packages:** Pandas, NumPy, Matplotlib, Scikit-learn, Tkinter
* **Section 2: Skill Level & Experience Metrics**
  * Visual progress bars / percentage meters for primary skills (React.js, PHP, JavaScript, MySQL, Python).
* **Section 3: Development Environment & Workflow**
  * Highlights of version control practices (Git/GitHub), IDE setups, and debugging techniques.

---

### 📬 PAGE 5: Contact Page (`contact.php` / `contact.html`)
> **Goal:** Easy communication channels for recruiters, clients, and collaborators.
> **Total Sections:** 3 Sections

* **Section 1: Contact Information Cards**
  * 📱 **Phone:** +91 8733919321
  * 📧 **Email:** nirajkumar851127@gmail.com
  * 📍 **Location:** Surat / Vapi / Valsad, Gujarat, India
  * 🔗 **Profiles:** LinkedIn (`linkedin.com/in/niraj0050`), GitHub
* **Section 2: Interactive Contact Form**
  * Form fields: *Full Name*, *Email Address*, *Subject*, *Message*.
  * Validation & Submit button with feedback message.
* **Section 3: Location Map & Work Availability Status**
  * Map display for Gujarat region.
  * Status Badge: *"Open for Full Stack Web Developer Roles & Internships"*.

---

## 📈 Summary Matrix of Pages & Sections

```
Website Architecture
 ├── 📄 Page 1: Home Page (5 Sections)
 │    ├── Section 1: Hero Banner
 │    ├── Section 2: About Quick Highlights
 │    ├── Section 3: Featured Projects Showcase
 │    ├── Section 4: Key Skills Snapshot
 │    └── Section 5: Quick Contact CTA Banner
 ├── 📄 Page 2: About & Experience Page (4 Sections)
 │    ├── Section 1: Detailed Professional Bio
 │    ├── Section 2: Academic Education Timeline
 │    ├── Section 3: Professional Work Experience
 │    └── Section 4: Core & Soft Skills Summary
 ├── 📄 Page 3: Projects Portfolio Page (3 Sections)
 │    ├── Section 1: Portfolio Banner & Interactive Filter Controls
 │    ├── Section 2: Projects Gallery Grid
 │    └── Section 3: Project Detail Modal / Sub-Page View
 ├── 📄 Page 4: Technical Skills Page (3 Sections)
 │    ├── Section 1: Categorized Technical Skills Matrix
 │    ├── Section 2: Skill Level & Experience Metrics
 │    └── Section 3: Development Environment & Workflow
 └── 📄 Page 5: Contact Page (3 Sections)
      ├── Section 1: Contact Information Cards
      ├── Section 2: Interactive Contact Form
      └── Section 3: Location Map & Work Availability Status
```
