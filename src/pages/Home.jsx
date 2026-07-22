import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { ArrowRight, Code2, Database, Layout, Sparkles, Terminal, FileText, CheckCircle, ExternalLink, Github } from 'lucide-react';
import SectionHeader from '../components/UI/SectionHeader';
import ProjectModal from '../components/UI/ProjectModal';
import { personalData, projectsData, skillsData } from '../data/portfolioData';

export default function Home() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="animate-fade-in">
      {/* SECTION 1: HERO BANNER */}
      <section className="section" style={{ paddingTop: '4rem', paddingBottom: '5rem', position: 'relative' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            
            {/* Left Column: Greeting & Hero Copy */}
            <div>
              <div className="section-badge" style={{ marginBottom: '1.2rem' }}>
                <Sparkles size={14} />
                <span>Full Stack Developer</span>
              </div>

              <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: 800, marginBottom: '1rem', lineHeight: '1.15' }}>
                Building Modern Web Solutions <span className="gradient-text">That Scale.</span>
              </h1>

              <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', marginBottom: '2rem', lineHeight: '1.7', maxWidth: '560px' }}>
                Hi, I'm <strong style={{ color: 'var(--text-primary)' }}>{personalData.name}</strong>. A Computer Science graduate and Full-Stack Intern specializing in React.js, PHP, JavaScript, Python, and MySQL.
              </p>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                <NavLink to="/projects" className="btn btn-primary">
                  <span>Explore Projects</span>
                  <ArrowRight size={18} />
                </NavLink>

                <NavLink to="/contact" className="btn btn-outline">
                  <span>Get In Touch</span>
                </NavLink>
              </div>

              {/* Tech Badges */}
              <div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, marginBottom: '0.75rem' }}>
                  Core Tech Stack
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem' }}>
                  {['React.js', 'PHP', 'JavaScript', 'MySQL', 'Python', 'Node.js'].map((tech) => (
                    <span key={tech} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Code Terminal Graphic */}
            <div>
              <div className="glass-card" style={{ padding: '0', overflow: 'hidden', border: '1px solid var(--border-accent)' }}>
                {/* Terminal Header Bar */}
                <div style={{ background: 'var(--bg-secondary)', padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
                  </div>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>DeveloperProfile.js</span>
                </div>

                {/* Terminal Content */}
                <div style={{ padding: '1.5rem', fontFamily: 'Consolas, Monaco, monospace', fontSize: '0.9rem', lineHeight: '1.8', color: '#e5e7eb' }}>
                  <p><span style={{ color: '#ec4899' }}>const</span> <span style={{ color: '#60a5fa' }}>developer</span> = &#123;</p>
                  <p style={{ paddingLeft: '1.5rem' }}><span style={{ color: '#f472b6' }}>name</span>: <span style={{ color: '#34d399' }}>"{personalData.name}"</span>,</p>
                  <p style={{ paddingLeft: '1.5rem' }}><span style={{ color: '#f472b6' }}>degree</span>: <span style={{ color: '#34d399' }}>"B.Sc. Computer Science"</span>,</p>
                  <p style={{ paddingLeft: '1.5rem' }}><span style={{ color: '#f472b6' }}>location</span>: <span style={{ color: '#34d399' }}>"Gujarat, India"</span>,</p>
                  <p style={{ paddingLeft: '1.5rem' }}><span style={{ color: '#f472b6' }}>currentRole</span>: <span style={{ color: '#34d399' }}>"Full Stack Intern"</span>,</p>
                  <p style={{ paddingLeft: '1.5rem' }}><span style={{ color: '#f472b6' }}>passions</span>: [<span style={{ color: '#34d399' }}>"Full-Stack Web"</span>, <span style={{ color: '#34d399' }}>"UI Design"</span>, <span style={{ color: '#34d399' }}>"Clean Code"</span>]</p>
                  <p>&#125;;</p>
                  <p style={{ marginTop: '0.5rem' }}><span style={{ color: '#ec4899' }}>function</span> <span style={{ color: '#fbbf24' }}>buildApp</span>() &#123;</p>
                  <p style={{ paddingLeft: '1.5rem' }}><span style={{ color: '#ec4899' }}>return</span> <span style={{ color: '#34d399' }}>"Scalable & Responsive Web App"</span>;</p>
                  <p>&#125;</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 2: ABOUT QUICK HIGHLIGHTS */}
      <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <SectionHeader
            badge="Why Me"
            title="Full-Stack Capabilities & Approach"
            subtitle="Bringing together frontend responsiveness, backend architecture, and relational database management."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Layout size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Frontend Engineering</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Building single-page React apps and modular UI components with HTML5, CSS3, JavaScript (ES6+), and modern responsive design practices.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Database size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Backend & Databases</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Developing server-side PHP scripts and Node.js REST endpoints integrated with MySQL, MongoDB, PostgreSQL, and SQLite databases.
              </p>
            </div>

            <div className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Terminal size={24} />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>Python & ML Basics</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Developing Tkinter desktop applications and performing data analysis and machine learning model training using Pandas and Scikit-learn.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: FEATURED PROJECTS SHOWCASE */}
      <section className="section">
        <div className="container">
          <SectionHeader
            badge="Portfolio"
            title="Featured Work & Case Studies"
            subtitle="Explore real-world software applications built across web, desktop, and machine learning domains."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            {projectsData.map((project) => (
              <div key={project.id} className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span className="tech-tag" style={{ background: 'var(--accent-glow)', color: 'var(--accent-primary)', borderColor: 'var(--border-accent)' }}>
                      {project.category}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.35rem', marginBottom: '0.75rem' }}>
                    {project.title}
                  </h3>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '1.25rem' }}>
                    {project.shortDesc}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
                    {project.tags.map((tag) => (
                      <span key={tag} className="tech-tag" style={{ fontSize: '0.75rem' }}>{tag}</span>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="btn btn-outline"
                    style={{ flex: 1, padding: '0.55rem', fontSize: '0.85rem' }}
                  >
                    Details
                  </button>
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '0.55rem', fontSize: '0.85rem' }}
                    >
                      <Github size={16} />
                      <span>GitHub</span>
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <NavLink to="/projects" className="btn btn-outline">
              <span>View All Projects</span>
              <ArrowRight size={16} />
            </NavLink>
          </div>
        </div>
      </section>

      {/* SECTION 4: KEY SKILLS SNAPSHOT */}
      <section className="section" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <SectionHeader
            badge="Skills Overview"
            title="Technologies I Work With"
            subtitle="A snapshot of core programming languages, frameworks, and developer tools."
          />

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', maxWidth: '850px', margin: '0 auto 2.5rem auto' }}>
            {['React.js', 'PHP', 'JavaScript', 'Python', 'MySQL', 'Node.js', 'Next.js', 'MongoDB', 'Git', 'WordPress', 'HTML5', 'CSS3'].map((skill) => (
              <div
                key={skill}
                className="glass-card"
                style={{ padding: '0.85rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 600, fontSize: '0.95rem' }}
              >
                <CheckCircle size={16} color="var(--accent-primary)" />
                <span>{skill}</span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <NavLink to="/skills" className="btn btn-outline">
              <span>Explore Detailed Skills Matrix</span>
              <ArrowRight size={16} />
            </NavLink>
          </div>
        </div>
      </section>

      {/* SECTION 5: QUICK CONTACT CTA BANNER */}
      <section className="section">
        <div className="container">
          <div className="glass-card" style={{ padding: '3.5rem 2rem', textAlign: 'center', background: 'var(--accent-gradient)', borderRadius: 'var(--radius-lg)', color: '#ffffff' }}>
            <h2 style={{ fontSize: '2.25rem', marginBottom: '1rem', color: '#ffffff' }}>
              Let's Build Something Exceptional Together
            </h2>
            <p style={{ fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem auto', opacity: 0.9 }}>
              Looking for a dedicated Full Stack Web Developer intern or junior engineer in Gujarat or remote? Let's get in touch!
            </p>
            <NavLink to="/contact" className="btn" style={{ background: '#ffffff', color: 'var(--accent-primary)', fontWeight: 700, padding: '0.9rem 2.2rem' }}>
              <span>Contact Me Today</span>
              <ArrowRight size={18} />
            </NavLink>
          </div>
        </div>
      </section>

      {/* Project Case Study Modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
