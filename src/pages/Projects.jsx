import React, { useState } from 'react';
import { ExternalLink, Github, Layers, Code, CheckCircle } from 'lucide-react';
import SectionHeader from '../components/UI/SectionHeader';
import ProjectModal from '../components/UI/ProjectModal';
import { personalData, projectsData } from '../data/portfolioData';

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = ['All', 'Web Applications', 'Desktop Apps', 'Machine Learning'];

  const filteredProjects = activeCategory === 'All'
    ? projectsData
    : projectsData.filter((p) => p.category === activeCategory);

  return (
    <div className="animate-fade-in section">
      <div className="container">
        
        {/* SECTION 1: PORTFOLIO BANNER & FILTER CONTROLS */}
        <SectionHeader
          badge="Projects Showcase"
          title="Featured Software Engineering Work"
          subtitle="Filter through full-stack web applications, Python desktop systems, and machine learning models."
        />

        {/* Filter Buttons Bar */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '3.5rem' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.65rem 1.4rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: '0.9rem',
                transition: 'var(--transition-fast)',
                background: activeCategory === cat ? 'var(--accent-gradient)' : 'var(--bg-secondary)',
                color: activeCategory === cat ? '#ffffff' : 'var(--text-secondary)',
                border: activeCategory === cat ? 'none' : '1px solid var(--border-color)',
                boxShadow: activeCategory === cat ? '0 4px 15px var(--accent-glow)' : 'none'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* SECTION 2: PROJECTS GALLERY GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(330px, 1fr))', gap: '2.5rem' }}>
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-card"
              style={{
                padding: '2.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'var(--transition-normal)'
              }}
            >
              <div>
                {/* Category Badge & Code Icon */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <span className="tech-tag" style={{ background: 'var(--accent-glow)', color: 'var(--accent-primary)', borderColor: 'var(--border-accent)', fontWeight: 600 }}>
                    {project.category}
                  </span>
                  <Code size={20} color="var(--text-muted)" />
                </div>

                <h3 style={{ fontSize: '1.4rem', marginBottom: '0.85rem' }}>
                  {project.title}
                </h3>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: '1.6', marginBottom: '1.5rem' }}>
                  {project.shortDesc}
                </p>

                {/* Tech Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.75rem' }}>
                  {project.tags.map((tag) => (
                    <span key={tag} className="tech-tag" style={{ fontSize: '0.78rem' }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.85rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                <button
                  onClick={() => setSelectedProject(project)}
                  className="btn btn-outline"
                  style={{ flex: 1, padding: '0.6rem', fontSize: '0.88rem' }}
                >
                  View Details
                </button>

                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                    style={{ flex: 1, padding: '0.6rem', fontSize: '0.88rem' }}
                  >
                    <Github size={16} />
                    <span>Source</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* SECTION 3: TECHNICAL ARCHITECTURE CALLOUT */}
        <div className="glass-card" style={{ marginTop: '5rem', padding: '3rem 2rem', textAlign: 'center', background: 'var(--bg-secondary)' }}>
          <h3 style={{ fontSize: '1.6rem', marginBottom: '0.75rem' }}>Need Custom Web & Database Solutions?</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto 1.5rem auto', fontSize: '0.98rem' }}>
            All projects are engineered following modular component practices, clean database schemas, and optimized user workflows.
          </p>
          <a
            href={personalData.github}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline"
          >
            <Github size={18} />
            <span>Explore All GitHub Repositories</span>
          </a>
        </div>

      </div>

      {/* Case Study Modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
