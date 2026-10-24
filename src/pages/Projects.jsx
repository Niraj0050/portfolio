import React, { useState } from 'react';
import { ExternalLink, Github, Layers, Code, CheckCircle, ArrowRight, Sparkles, Server, Cpu, Layout } from 'lucide-react';
import SectionHeader from '../components/UI/SectionHeader';
import ProjectModal from '../components/UI/ProjectModal';
import { Database3DView, WebPrism3DView, NeuralSurface3DView } from '../components/Three/Project3DViews';
import { personalData, projectsData } from '../data/portfolioData';

export default function Projects() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);

  const categories = ['All', 'Web Applications', 'Desktop Apps', 'Machine Learning'];

  const filteredProjects = activeCategory === 'All'
    ? projectsData
    : projectsData.filter((p) => p.category === activeCategory);

  const render3DView = (id) => {
    switch (id) {
      case 'student-record':
        return <Database3DView />;
      case 'portfolio-website':
        return <WebPrism3DView />;
      case 'ml-mini-project':
        return <NeuralSurface3DView />;
      default:
        return null;
    }
  };

  return (
    <div className="animate-fade-in section">
      <div className="container">
        
        {/* SECTION 1: PORTFOLIO BANNER & FILTER CONTROLS */}
        <SectionHeader
          badge="Curated Engineering"
          title="Interactive Projects Gallery"
          subtitle="A comprehensive showcase of verified software engineering systems spanning full-stack web applications, relational databases, and machine learning models."
        />

        {/* Filter Buttons Bar */}
        <div 
          style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            flexWrap: 'wrap', 
            gap: '0.85rem', 
            marginBottom: '4rem' 
          }}
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '0.7rem 1.6rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: '0.92rem',
                transition: 'var(--transition-fast)',
                background: activeCategory === cat ? 'var(--accent-gradient)' : 'var(--bg-card)',
                color: activeCategory === cat ? '#07080c' : 'var(--text-secondary)',
                border: activeCategory === cat ? 'none' : '1px solid var(--border-color)',
                boxShadow: activeCategory === cat ? '0 4px 20px var(--accent-glow)' : 'none',
                cursor: 'pointer'
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* SECTION 2: PROJECTS GALLERY GRID WITH REAL-TIME 3D VIEWPORTS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '3rem' }}>
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="glass-card"
              style={{
                padding: '0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'var(--transition-normal)'
              }}
            >
              {/* 3D Interactive Viewport Header */}
              <div 
                style={{ 
                  background: 'radial-gradient(circle at center, rgba(255, 107, 0, 0.08) 0%, rgba(13, 16, 24, 0.98) 75%)',
                  padding: '1.5rem 1.5rem 0.5rem 1.5rem',
                  borderBottom: '1px solid var(--border-color)',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span 
                    className="tech-tag" 
                    style={{ 
                      background: 'rgba(255, 107, 0, 0.12)', 
                      color: 'var(--accent-orange)', 
                      borderColor: 'var(--border-accent)', 
                      fontWeight: 600 
                    }}
                  >
                    {project.category}
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-heading)' }}>
                    Real-time 3D
                  </span>
                </div>

                <div style={{ width: '100%', height: '200px' }}>
                  {render3DView(project.id)}
                </div>
              </div>

              {/* Card Body */}
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', flex: 1, justifyContent: 'space-between' }}>
                <div>
                  <h3 style={{ fontSize: '1.45rem', marginBottom: '0.85rem' }}>
                    {project.title}
                  </h3>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                    {project.shortDesc}
                  </p>

                  {/* Feature Bullets */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, display: 'block', marginBottom: '0.6rem' }}>
                      Key Architectural Highlights
                    </span>
                    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {project.features.slice(0, 3).map((feat, idx) => (
                        <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.86rem', color: 'var(--text-secondary)' }}>
                          <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-orange)', flexShrink: 0 }} />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Tech Badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.75rem' }}>
                    {project.tags.map((tag) => (
                      <span key={tag} className="tech-tag" style={{ fontSize: '0.76rem' }}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div style={{ display: 'flex', gap: '0.85rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                  <button
                    onClick={() => setSelectedProject(project)}
                    className="btn btn-outline"
                    style={{ flex: 1, padding: '0.65rem', fontSize: '0.88rem' }}
                  >
                    <span>Inspect Case Study</span>
                    <ArrowRight size={15} />
                  </button>

                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-primary"
                      style={{ flex: 1, padding: '0.65rem', fontSize: '0.88rem' }}
                    >
                      <Github size={16} />
                      <span>Source Code</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SECTION 3: REPOSITORY ARCHITECTURE CALLOUT */}
        <div 
          className="glass-card" 
          style={{ 
            marginTop: '5rem', 
            padding: '3.5rem 2.5rem', 
            textAlign: 'center', 
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <div style={{ width: '48px', height: '48px', margin: '0 auto 1.25rem auto', borderRadius: '50%', background: 'rgba(255, 107, 0, 0.12)', border: '1px solid var(--border-accent)', color: 'var(--accent-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Sparkles size={22} />
          </div>
          <h3 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Clean Architecture & Relational Integrity</h3>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 2rem auto', fontSize: '1rem', lineHeight: '1.7' }}>
            Every project is engineered with modular design patterns, ACID-compliant database relations, clean component hierarchies, 
            and documented source repositories.
          </p>
          <a
            href={personalData.github}
            target="_blank"
            rel="noreferrer"
            className="btn btn-outline"
            style={{ padding: '0.9rem 2rem' }}
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
