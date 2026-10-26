import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ArrowRight, 
  Code2, 
  Database, 
  Layout, 
  Sparkles, 
  Terminal, 
  FileText, 
  CheckCircle, 
  ExternalLink, 
  Github, 
  ChevronDown, 
  Layers, 
  Cpu, 
  Server,
  Zap,
  Globe,
  Mail
} from 'lucide-react';
import SectionHeader from '../components/UI/SectionHeader';
import ProjectModal from '../components/UI/ProjectModal';
import HeroScene from '../components/Three/HeroScene';
import { Database3DView, WebPrism3DView, NeuralSurface3DView } from '../components/Three/Project3DViews';
import { personalData, projectsData, skillsData } from '../data/portfolioData';

// Exploded 3D Architecture Callout Metadata (Option 4: Software Architecture Metaphor)
const architectureLayers = [
  {
    id: '01',
    layer: 'FRONTEND PRESENTATION CANOPY',
    tech: ['React 18', 'Three.js WebGL', 'Vite', 'Tailwind CSS'],
    role: 'Faceted obsidian glass canopy delivering 60 FPS real-time WebGL rendering and responsive viewport physics.',
    accent: '#00e5ff',
    glow: 'rgba(0, 229, 255, 0.28)',
    top: '11%',
    right: '4%',
    width: '320px',
  },
  {
    id: '02',
    layer: 'API & INTEGRATION ENGINE',
    tech: ['Node.js', 'Express', 'PHP REST', 'JSON APIs'],
    role: 'Liquid-chrome orbital rings routing asynchronous REST requests, JWT auth tokens, and backend services.',
    accent: '#38bdf8',
    glow: 'rgba(56, 189, 248, 0.28)',
    top: '32%',
    right: '35%',
    width: '310px',
  },
  {
    id: '03',
    layer: 'RELATIONAL DATA CORE',
    tech: ['MySQL', 'ACID Transactions', 'Normalized Schemas'],
    role: 'Incandescent molten chevron core ensuring deterministic persistence, transactional safety, and indexed speed.',
    accent: '#ffaa00',
    glow: 'rgba(255, 170, 0, 0.35)',
    top: '53%',
    right: '4%',
    width: '320px',
  },
  {
    id: '04',
    layer: 'RUNTIME PLATFORM & DEVOPS',
    tech: ['Linux Ubuntu', 'Git', 'CI/CD Pipelines', 'Nginx'],
    role: 'Stationary obsidian pedestal orchestrating rock-solid production hosting and automated deployments.',
    accent: '#ff5500',
    glow: 'rgba(255, 85, 0, 0.32)',
    bottom: '10%',
    right: '32%',
    width: '310px',
  },
];

export default function Home() {
  const [selectedProject, setSelectedProject] = useState(null);
  const [hoveredProject, setHoveredProject] = useState(null);
  const [pointerAura, setPointerAura] = useState({ x: -1000, y: -1000, active: false });
  const [isArchitectureExploded, setIsArchitectureExploded] = useState(false);

  const handleHeroMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setPointerAura({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    });
  };

  const handleHeroMouseLeave = () => {
    setPointerAura((prev) => ({ ...prev, active: false }));
  };

  const scrollToProjects = () => {
    const el = document.getElementById('featured-projects');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="animate-fade-in" style={{ position: 'relative', zIndex: 1 }}>
      
      {/* SECTION 1: HERO BANNER (Full-Bleed 3D Background Experience matching Reference) */}
      <section 
        className="hero-section-wrapper"
        onMouseMove={handleHeroMouseMove}
        onMouseLeave={handleHeroMouseLeave}
        style={{ 
          minHeight: 'calc(100vh - 80px)', 
          display: 'flex', 
          alignItems: 'center', 
          position: 'relative', 
          padding: '2.5rem 0 3.5rem 0',
          overflow: 'hidden'
        }}
      >
        {/* Full-Bleed 3D Scene Background (Spans edge-to-edge, top-to-bottom) */}
        <div 
          className="hero-3d-container"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            zIndex: 1,
            overflow: 'hidden'
          }}
        >
          <HeroScene 
            isExploded={isArchitectureExploded} 
            onToggleExplode={() => setIsArchitectureExploded((prev) => !prev)} 
          />
        </div>

        {/* Exploded Architecture HUD Callouts (Option 4: Software Architecture Metaphor) */}
        <div
          className={`arch-hud-container ${isArchitectureExploded ? 'is-visible' : ''}`}
          style={{
            position: 'absolute',
            inset: 0,
            zIndex: 3,
          }}
        >
          {/* Desktop Callout Cards positioned around 3D sculpture */}
            <div className="arch-hud-desktop">
              {architectureLayers.map((layer) => (
                <div
                  key={layer.id}
                  className="arch-hud-card"
                  style={{
                    top: layer.top,
                    bottom: layer.bottom,
                    right: layer.right,
                    width: layer.width,
                    borderLeft: `3px solid ${layer.accent}`,
                    boxShadow: `0 16px 36px rgba(0, 0, 0, 0.65), 0 0 20px ${layer.glow}`,
                  }}
                >
                  <div className="arch-hud-badge" style={{ color: layer.accent }}>
                    <span
                      style={{
                        width: '7px',
                        height: '7px',
                        borderRadius: '50%',
                        backgroundColor: layer.accent,
                        boxShadow: `0 0 8px ${layer.accent}`,
                        display: 'inline-block',
                      }}
                    />
                    <span>{layer.id} // {layer.layer}</span>
                  </div>

                  <p
                    style={{
                      fontSize: '0.82rem',
                      lineHeight: '1.45',
                      color: '#cbd5e1',
                      margin: '0.35rem 0 0.55rem 0',
                    }}
                  >
                    {layer.role}
                  </p>

                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {layer.tech.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: '0.68rem',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(255, 255, 255, 0.08)',
                          color: '#e2e8f0',
                          fontFamily: 'var(--font-mono, monospace)',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile / Tablet Horizontal Scrollable Architecture Strip */}
            <div
              className="arch-hud-mobile"
              style={{
                position: 'absolute',
                bottom: '4.5rem',
                left: '1rem',
                right: '1rem',
                display: 'flex',
                gap: '0.75rem',
                overflowX: 'auto',
                paddingBottom: '0.5rem',
                pointerEvents: 'auto',
                scrollbarWidth: 'none',
              }}
            >
              {architectureLayers.map((layer) => (
                <div
                  key={layer.id}
                  className="arch-hud-mobile-card"
                  style={{
                    minWidth: '260px',
                    maxWidth: '280px',
                    flexShrink: 0,
                    background: 'rgba(6, 9, 16, 0.88)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderLeft: `3px solid ${layer.accent}`,
                    borderRadius: '12px',
                    padding: '0.85rem 1rem',
                    backdropFilter: 'blur(12px)',
                    boxShadow: `0 8px 24px rgba(0,0,0,0.6), 0 0 16px ${layer.glow}`,
                  }}
                >
                  <div className="arch-hud-badge" style={{ color: layer.accent }}>
                    <span>{layer.id} // {layer.layer}</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: '0.25rem 0 0.45rem 0', lineHeight: '1.4' }}>
                    {layer.role}
                  </p>
                  <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                    {layer.tech.slice(0, 3).map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: '0.65rem',
                          padding: '0.1rem 0.4rem',
                          borderRadius: '4px',
                          background: 'rgba(255, 255, 255, 0.06)',
                          color: '#e2e8f0',
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

        {/* Interactive Pointer Ambient Aura Follower */}
        <div 
          style={{
            position: 'absolute',
            left: pointerAura.x,
            top: pointerAura.y,
            width: '440px',
            height: '440px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255, 107, 0, 0.12) 0%, rgba(255, 107, 0, 0.03) 45%, transparent 70%)',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
            zIndex: 2,
            transition: 'opacity 0.25s ease',
            opacity: pointerAura.active ? 1 : 0
          }}
        />

        {/* Soft Readability Vignette Gradient (Protects text contrast on left while keeping 3D sculpture bright) */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at 25% 50%, rgba(5, 7, 12, 0.78) 0%, rgba(5, 7, 12, 0.3) 55%, transparent 100%)',
            zIndex: 2,
            pointerEvents: 'none'
          }}
        />

        {/* Foreground Hero Content (Left-Aligned, Unobstructed, Crisp Readability) */}
        <div className="container" style={{ position: 'relative', zIndex: 3, pointerEvents: 'none' }}>
          <div className="hero-text-block" style={{ maxWidth: '580px', pointerEvents: 'auto' }}>
            
            {/* Status Pill Badge */}
            <div 
              style={{ 
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.42rem 1.15rem',
                borderRadius: '9999px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '1.4rem',
                fontSize: '0.94rem',
                color: '#e2e8f0',
                boxShadow: '0 2px 12px rgba(0, 0, 0, 0.3)'
              }}
            >
              <span>👋</span>
              <span style={{ fontWeight: 500 }}>Hi, I'm</span>
            </div>

            {/* Main Headline */}
            <h1 
              style={{ 
                fontSize: 'clamp(2.4rem, 6vw, 5.0rem)', 
                fontWeight: 900, 
                marginBottom: '0.55rem', 
                lineHeight: '1.08',
                letterSpacing: '-0.03em',
                color: '#ffffff'
              }}
            >
              Niraj <span style={{ color: '#ff6b2b' }}>Kumar</span>
            </h1>

            {/* Developer Title */}
            <h2 
              style={{ 
                fontSize: 'clamp(1.35rem, 3.2vw, 2.35rem)', 
                fontWeight: 700, 
                marginBottom: '1.35rem', 
                color: '#f8fafc',
                letterSpacing: '-0.02em'
              }}
            >
              Full Stack Developer
            </h2>

            {/* Concise Authentic Introduction */}
            <p 
              style={{ 
                color: '#94a3b8', 
                fontSize: 'clamp(0.92rem, 2.2vw, 1.08rem)', 
                marginBottom: '2.0rem', 
                lineHeight: '1.65', 
                maxWidth: '520px' 
              }}
            >
              I build modern web applications with clean code, creative solutions and a passion for technology. Turning ideas into digital experiences.
            </p>

            {/* Action Buttons */}
            <div className="hero-action-buttons" style={{ display: 'flex', gap: '1.15rem', flexWrap: 'wrap', marginBottom: '2.4rem', alignItems: 'center' }}>
              <button 
                onClick={scrollToProjects} 
                className="btn"
                style={{
                  background: 'linear-gradient(135deg, #ff6b2b 0%, #ff5500 100%)',
                  color: '#ffffff',
                  padding: '0.85rem 1.85rem',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: '0.98rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  border: 'none',
                  boxShadow: '0 4px 20px rgba(255, 107, 43, 0.38)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 6px 24px rgba(255, 107, 43, 0.55)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(255, 107, 43, 0.38)';
                }}
              >
                <span>View My Projects</span>
                <ArrowRight size={18} />
              </button>

              <NavLink 
                to="/contact" 
                className="btn"
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  color: '#e2e8f0',
                  padding: '0.85rem 1.85rem',
                  borderRadius: '9999px',
                  fontWeight: 600,
                  fontSize: '0.98rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.65rem',
                  border: '1px solid rgba(255, 255, 255, 0.16)',
                  backdropFilter: 'blur(10px)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#ff6b2b';
                  e.currentTarget.style.color = '#ffffff';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.16)';
                  e.currentTarget.style.color = '#e2e8f0';
                }}
              >
                <span>Contact Me</span>
                <Mail size={18} />
              </NavLink>
            </div>

            {/* Interactive 3D Architecture Exploded View Switch */}
            <div style={{ marginBottom: '2.4rem' }}>
              <button
                type="button"
                onClick={() => setIsArchitectureExploded((prev) => !prev)}
                title="Click to toggle Exploded 3D Architecture View or click directly on the 3D diamond"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.55rem 1.25rem',
                  borderRadius: '9999px',
                  background: isArchitectureExploded
                    ? 'linear-gradient(135deg, rgba(0, 229, 255, 0.16) 0%, rgba(0, 180, 255, 0.08) 100%)'
                    : 'linear-gradient(135deg, rgba(255, 107, 0, 0.12) 0%, rgba(255, 60, 0, 0.05) 100%)',
                  border: isArchitectureExploded
                    ? '1px solid rgba(0, 229, 255, 0.55)'
                    : '1px solid rgba(255, 120, 0, 0.35)',
                  color: isArchitectureExploded ? '#00e5ff' : '#ff9933',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  fontFamily: 'var(--font-mono, monospace)',
                  letterSpacing: '0.04em',
                  cursor: 'pointer',
                  backdropFilter: 'blur(12px)',
                  boxShadow: isArchitectureExploded
                    ? '0 0 25px rgba(0, 229, 255, 0.32), inset 0 0 12px rgba(0, 229, 255, 0.15)'
                    : '0 2px 14px rgba(0, 0, 0, 0.4), 0 0 15px rgba(255, 107, 0, 0.18)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                <span
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '10px',
                    height: '10px',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      background: isArchitectureExploded ? '#00e5ff' : '#ff6600',
                      animation: 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
                      opacity: 0.75,
                    }}
                  />
                  <span
                    style={{
                      position: 'relative',
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: isArchitectureExploded ? '#00e5ff' : '#ff6600',
                    }}
                  />
                </span>

                <Layers size={15} style={{ color: isArchitectureExploded ? '#00e5ff' : '#ff9933' }} />

                <span>
                  {isArchitectureExploded ? 'COLLAPSE ARCHITECTURE' : 'EXPLODE 3D ARCHITECTURE'}
                </span>

                <span
                  style={{
                    fontSize: '0.72rem',
                    padding: '0.15rem 0.5rem',
                    borderRadius: '6px',
                    background: isArchitectureExploded
                      ? 'rgba(0, 229, 255, 0.22)'
                      : 'rgba(255, 107, 0, 0.18)',
                    color: isArchitectureExploded ? '#e0ffff' : '#ffe0b2',
                    textTransform: 'uppercase',
                    fontWeight: 700,
                  }}
                >
                  {isArchitectureExploded ? 'Active ⚡' : 'Interactive 3D'}
                </span>
              </button>
            </div>

            {/* Verified Metrics Counter Strip */}
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(3, auto)', 
                gap: '2.5rem', 
                paddingTop: '1.6rem', 
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                maxWidth: '460px'
              }}
            >
              <div>
                <div style={{ fontSize: '1.95rem', fontWeight: 800, color: '#ff6b2b', fontFamily: 'var(--font-heading)' }}>
                  3+
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', textTransform: 'capitalize', letterSpacing: '0.2px', marginTop: '0.25rem' }}>
                  Projects Completed
                </div>
              </div>

              <div>
                <div style={{ fontSize: '1.95rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-heading)' }}>
                  2026
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', textTransform: 'capitalize', letterSpacing: '0.2px', marginTop: '0.25rem' }}>
                  B.Sc. CS Degree
                </div>
              </div>

              <div>
                <div style={{ fontSize: '1.95rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-heading)' }}>
                  60 FPS
                </div>
                <div style={{ fontSize: '0.82rem', color: '#94a3b8', textTransform: 'capitalize', letterSpacing: '0.2px', marginTop: '0.25rem' }}>
                  WebGL Performance
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Minimal Scroll Indicator matching Reference Image */}
        <div 
          onClick={scrollToProjects}
          style={{
            position: 'absolute',
            bottom: '1rem',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'pointer',
            zIndex: 10,
            transition: 'var(--transition-fast)'
          }}
        >
          {/* Rounded Mouse Icon */}
          <div 
            style={{
              width: '18px',
              height: '30px',
              borderRadius: '10px',
              border: '1.5px solid rgba(255, 255, 255, 0.45)',
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '5px',
              marginBottom: '0.45rem'
            }}
          >
            <div 
              style={{
                width: '3px',
                height: '6px',
                borderRadius: '2px',
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              }}
            />
          </div>
          <span style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.55)', letterSpacing: '0.5px' }}>
            Scroll Down
          </span>
          <div style={{ width: '1px', height: '20px', backgroundColor: 'rgba(255, 255, 255, 0.25)', marginTop: '0.45rem' }} />
        </div>

        {/* Vertical Pagination Indicator on the right edge */}
        <div 
          style={{
            position: 'absolute',
            right: '2rem',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
            zIndex: 10
          }}
          className="hero-side-dots"
        >
          <div style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#ff6b2b' }} />
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.25)' }} />
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.25)' }} />
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.25)' }} />
        </div>
      </section>

      {/* SECTION 2: ABOUT CAPABILITIES & APPROACH */}
      <section 
        className="section" 
        style={{ 
          background: 'var(--bg-secondary)', 
          borderTop: '1px solid var(--border-color)', 
          borderBottom: '1px solid var(--border-color)' 
        }}
      >
        <div className="container">
          <SectionHeader
            badge="Engineering Philosophy"
            title="Full-Stack Capabilities & Approach"
            subtitle="Bridging modern interactive interfaces with scalable relational backends, structured schemas, and clean software architecture."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '2rem' }}>
            
            {/* Frontend Card */}
            <div className="glass-card" style={{ padding: '2.5rem 2rem' }}>
              <div 
                style={{ 
                  width: '52px', 
                  height: '52px', 
                  borderRadius: 'var(--radius-md)', 
                  background: 'rgba(0, 229, 255, 0.12)', 
                  border: '1px solid var(--border-accent-cyan)',
                  color: 'var(--accent-cyan)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  marginBottom: '1.5rem' 
                }}
              >
                <Layout size={26} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.85rem' }}>Interactive Frontend</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: '1.7', marginBottom: '1.25rem' }}>
                Developing single-page React 18 applications, modular component trees, responsive layouts, 
                and genuine Three.js real-time 3D experiences.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {['React.js', 'Three.js', 'JavaScript (ES6+)', 'HTML5/CSS3'].map((item) => (
                  <span key={item} className="tech-tag" style={{ fontSize: '0.75rem' }}>{item}</span>
                ))}
              </div>
            </div>

            {/* Backend & DB Card */}
            <div className="glass-card" style={{ padding: '2.5rem 2rem' }}>
              <div 
                style={{ 
                  width: '52px', 
                  height: '52px', 
                  borderRadius: 'var(--radius-md)', 
                  background: 'rgba(255, 107, 0, 0.12)', 
                  border: '1px solid var(--border-accent)',
                  color: 'var(--accent-orange)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  marginBottom: '1.5rem' 
                }}
              >
                <Server size={26} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.85rem' }}>Backend & Schemas</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: '1.7', marginBottom: '1.25rem' }}>
                Architecting server-side PHP scripts, Node.js REST services, and robust relational 
                MySQL databases with normalized relational tables and index optimization.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {['PHP', 'MySQL', 'Node.js', 'REST APIs', 'PostgreSQL'].map((item) => (
                  <span key={item} className="tech-tag" style={{ fontSize: '0.75rem' }}>{item}</span>
                ))}
              </div>
            </div>

            {/* Python & ML Card */}
            <div className="glass-card" style={{ padding: '2.5rem 2rem' }}>
              <div 
                style={{ 
                  width: '52px', 
                  height: '52px', 
                  borderRadius: 'var(--radius-md)', 
                  background: 'rgba(245, 158, 11, 0.12)', 
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  color: 'var(--accent-amber)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  marginBottom: '1.5rem' 
                }}
              >
                <Cpu size={26} />
              </div>
              <h3 style={{ fontSize: '1.35rem', marginBottom: '0.85rem' }}>Data & Systems</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: '1.7', marginBottom: '1.25rem' }}>
                Building standalone Python desktop GUIs with Tkinter, alongside data analysis, feature engineering, 
                and predictive machine learning pipelines using Scikit-Learn.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                {['Python', 'Tkinter', 'Pandas', 'Scikit-Learn', 'Matplotlib'].map((item) => (
                  <span key={item} className="tech-tag" style={{ fontSize: '0.75rem' }}>{item}</span>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: SELECTED PROJECTS — INTERACTIVE 3D PRESENTATION */}
      <section id="featured-projects" className="section">
        <div className="container">
          <SectionHeader
            badge="Curated Showcase"
            title="Selected Engineering Projects"
            subtitle="Explore real-world software applications built across web engineering, database architecture, and machine learning domains."
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3.5rem' }}>
            
            {/* PROJECT 1: Student Record Management System */}
            <div 
              className="glass-card" 
              style={{ 
                padding: '0', 
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                alignItems: 'center'
              }}
              onMouseEnter={() => setHoveredProject('student-record')}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* 3D Interactive Viewport */}
              <div 
                style={{ 
                  background: 'radial-gradient(circle at center, rgba(255, 107, 0, 0.08) 0%, rgba(13, 16, 24, 0.95) 75%)',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '320px',
                  borderRight: '1px solid var(--border-color)'
                }}
              >
                <div style={{ width: '100%', height: '240px' }}>
                  <Database3DView isHovered={hoveredProject === 'student-record'} />
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                  Interactive 3D Relational Database Monolith • Move cursor to inspect
                </span>
              </div>

              {/* Project Details */}
              <div style={{ padding: '2.75rem 2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span className="tech-tag" style={{ background: 'rgba(255, 107, 0, 0.12)', color: 'var(--accent-orange)', borderColor: 'var(--border-accent)', fontWeight: 600 }}>
                    Desktop Applications
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Role: Lead Developer</span>
                </div>

                <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>
                  Student Record Management System
                </h3>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                  A desktop database application engineered in Python with Tkinter and MySQL to manage academic logs, 
                  enrollments, and student information. Features real-time queries, search-by-ID filters, and ACID transaction safety.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
                  {['Python', 'Tkinter', 'MySQL', 'Relational Schema', 'CRUD Operations'].map((tag) => (
                    <span key={tag} className="tech-tag">{tag}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setSelectedProject(projectsData[0])}
                    className="btn btn-outline"
                    style={{ padding: '0.7rem 1.4rem', fontSize: '0.9rem' }}
                  >
                    <span>View Architecture</span>
                    <ArrowRight size={16} />
                  </button>

                  <a
                    href="https://github.com/niraj0050/Student-Record-Management-System"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                    style={{ padding: '0.7rem 1.4rem', fontSize: '0.9rem' }}
                  >
                    <Github size={17} />
                    <span>View GitHub Source</span>
                  </a>
                </div>
              </div>
            </div>

            {/* PROJECT 2: Personal Portfolio Website */}
            <div 
              className="glass-card" 
              style={{ 
                padding: '0', 
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                alignItems: 'center'
              }}
              onMouseEnter={() => setHoveredProject('portfolio-website')}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* Project Details (Left for asymmetric editorial layout) */}
              <div style={{ padding: '2.75rem 2.5rem', order: 2 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span className="tech-tag" style={{ background: 'rgba(0, 229, 255, 0.12)', color: 'var(--accent-cyan)', borderColor: 'var(--border-accent-cyan)', fontWeight: 600 }}>
                    Web Applications
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Role: Creative Developer & UI/UX</span>
                </div>

                <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>
                  Interactive 3D Portfolio Platform
                </h3>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                  A high-performance personal developer portfolio built with React 18, Three.js real-time WebGL rendering, 
                  glassmorphism styling, and mobile-first responsive architecture. Deployed globally with zero-downtime CI/CD.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
                  {['React.js', 'Three.js', 'Vite', 'Glassmorphism', 'WebGL 60FPS'].map((tag) => (
                    <span key={tag} className="tech-tag">{tag}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setSelectedProject(projectsData[1])}
                    className="btn btn-outline"
                    style={{ padding: '0.7rem 1.4rem', fontSize: '0.9rem' }}
                  >
                    <span>View Case Study</span>
                    <ArrowRight size={16} />
                  </button>

                  <a
                    href="https://github.com/niraj0050/portfolio"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                    style={{ padding: '0.7rem 1.4rem', fontSize: '0.9rem' }}
                  >
                    <Github size={17} />
                    <span>View Repository</span>
                  </a>
                </div>
              </div>

              {/* 3D Interactive Viewport */}
              <div 
                style={{ 
                  background: 'radial-gradient(circle at center, rgba(0, 229, 255, 0.08) 0%, rgba(13, 16, 24, 0.95) 75%)',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '320px',
                  borderLeft: '1px solid var(--border-color)',
                  order: 1
                }}
              >
                <div style={{ width: '100%', height: '240px' }}>
                  <WebPrism3DView isHovered={hoveredProject === 'portfolio-website'} />
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                  Interactive 3D Glass Viewport Prism • Hover & tilt perspective
                </span>
              </div>
            </div>

            {/* PROJECT 3: Machine Learning Mini Project */}
            <div 
              className="glass-card" 
              style={{ 
                padding: '0', 
                overflow: 'hidden',
                border: '1px solid var(--border-color)',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                alignItems: 'center'
              }}
              onMouseEnter={() => setHoveredProject('ml-mini-project')}
              onMouseLeave={() => setHoveredProject(null)}
            >
              {/* 3D Interactive Viewport */}
              <div 
                style={{ 
                  background: 'radial-gradient(circle at center, rgba(245, 158, 11, 0.08) 0%, rgba(13, 16, 24, 0.95) 75%)',
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: '320px',
                  borderRight: '1px solid var(--border-color)'
                }}
              >
                <div style={{ width: '100%', height: '240px' }}>
                  <NeuralSurface3DView isHovered={hoveredProject === 'ml-mini-project'} />
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.5rem', fontFamily: 'var(--font-heading)' }}>
                  Interactive 3D Loss Surface Topology • Dynamic vertex simulation
                </span>
              </div>

              {/* Project Details */}
              <div style={{ padding: '2.75rem 2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                  <span className="tech-tag" style={{ background: 'rgba(245, 158, 11, 0.12)', color: 'var(--accent-amber)', borderColor: 'rgba(245, 158, 11, 0.35)', fontWeight: 600 }}>
                    Machine Learning
                  </span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Role: ML Pipeline Developer</span>
                </div>

                <h3 style={{ fontSize: '1.75rem', marginBottom: '1rem' }}>
                  Machine Learning Mini Project
                </h3>

                <p style={{ color: 'var(--text-secondary)', fontSize: '0.98rem', lineHeight: '1.7', marginBottom: '1.5rem' }}>
                  End-to-end data preprocessing pipeline and predictive modeling built for statistical analysis 
                  and classification tasks. Features Pandas cleaning, feature normalization, and Scikit-learn model evaluation.
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '2rem' }}>
                  {['Python', 'Pandas', 'Scikit-Learn', 'Matplotlib', 'Classification'].map((tag) => (
                    <span key={tag} className="tech-tag">{tag}</span>
                  ))}
                </div>

                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    onClick={() => setSelectedProject(projectsData[2])}
                    className="btn btn-outline"
                    style={{ padding: '0.7rem 1.4rem', fontSize: '0.9rem' }}
                  >
                    <span>Inspect Pipeline</span>
                    <ArrowRight size={16} />
                  </button>

                  <a
                    href="https://github.com/niraj0050/ML-Mini-Project"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-primary"
                    style={{ padding: '0.7rem 1.4rem', fontSize: '0.9rem' }}
                  >
                    <Github size={17} />
                    <span>View GitHub Code</span>
                  </a>
                </div>
              </div>
            </div>

          </div>

          <div style={{ textAlign: 'center', marginTop: '4rem' }}>
            <NavLink to="/projects" className="btn btn-outline" style={{ padding: '0.95rem 2.2rem' }}>
              <span>Explore All Projects & Architecture</span>
              <ArrowRight size={18} />
            </NavLink>
          </div>
        </div>
      </section>

      {/* SECTION 4: KEY SKILLS SNAPSHOT */}
      <section 
        className="section" 
        style={{ 
          background: 'var(--bg-secondary)', 
          borderTop: '1px solid var(--border-color)', 
          borderBottom: '1px solid var(--border-color)' 
        }}
      >
        <div className="container">
          <SectionHeader
            badge="Verified Competencies"
            title="Core Technical Proficiencies"
            subtitle="Categorized programming languages, web frameworks, database engines, and software engineering tools."
          />

          <div 
            style={{ 
              display: 'flex', 
              flexWrap: 'wrap', 
              gap: '1rem', 
              justifyContent: 'center', 
              maxWidth: '920px', 
              margin: '0 auto 3rem auto' 
            }}
          >
            {[
              { name: 'React.js 18', group: 'Frontend' },
              { name: 'Three.js & WebGL', group: '3D' },
              { name: 'JavaScript (ES6+)', group: 'Core' },
              { name: 'PHP & Apache', group: 'Backend' },
              { name: 'Python 3', group: 'Core' },
              { name: 'MySQL Relational', group: 'Database' },
              { name: 'Node.js & Express', group: 'Backend' },
              { name: 'Tkinter GUI', group: 'Desktop' },
              { name: 'Pandas & ML', group: 'Data' },
              { name: 'Git & GitHub', group: 'DevOps' },
              { name: 'WordPress', group: 'CMS' },
              { name: 'HTML5 & CSS3', group: 'Frontend' }
            ].map((skill) => (
              <div
                key={skill.name}
                className="glass-card"
                style={{ 
                  padding: '0.85rem 1.5rem', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.75rem', 
                  fontWeight: 600, 
                  fontSize: '0.95rem' 
                }}
              >
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-orange)' }}></div>
                <span>{skill.name}</span>
                <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {skill.group}
                </span>
              </div>
            ))}
          </div>

          <div style={{ textAlign: 'center' }}>
            <NavLink to="/skills" className="btn btn-outline">
              <span>View In-Depth Skills Matrix</span>
              <ArrowRight size={16} />
            </NavLink>
          </div>
        </div>
      </section>

      {/* SECTION 5: HIGH-IMPACT CONTACT CTA BANNER */}
      <section className="section">
        <div className="container">
          <div 
            className="glass-card" 
            style={{ 
              padding: '4.5rem 2.5rem', 
              textAlign: 'center', 
              background: 'radial-gradient(circle at center, rgba(255, 107, 0, 0.14) 0%, rgba(13, 16, 24, 0.95) 85%)', 
              border: '1px solid var(--border-accent)',
              borderRadius: 'var(--radius-xl)',
              boxShadow: '0 30px 60px rgba(0, 0, 0, 0.6), 0 0 40px rgba(255, 107, 0, 0.15)'
            }}
          >
            <div 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.6rem', 
                padding: '0.4rem 1.2rem', 
                borderRadius: 'var(--radius-full)', 
                background: 'rgba(255, 107, 0, 0.12)', 
                border: '1px solid var(--border-accent)',
                color: 'var(--accent-orange)', 
                fontSize: '0.82rem', 
                fontWeight: 600, 
                marginBottom: '1.5rem' 
              }}
            >
              <Sparkles size={15} />
              <span>Available For Opportunities</span>
            </div>

            <h2 
              style={{ 
                fontSize: 'clamp(2rem, 4vw, 3rem)', 
                marginBottom: '1.25rem', 
                fontWeight: 800,
                letterSpacing: '-0.02em'
              }}
            >
              Let's Build Something <span className="gradient-text">Exceptional Together</span>.
            </h2>

            <p 
              style={{ 
                fontSize: '1.1rem', 
                maxWidth: '640px', 
                margin: '0 auto 2.5rem auto', 
                color: 'var(--text-secondary)',
                lineHeight: '1.75'
              }}
            >
              Seeking an ambitious Full Stack Web Developer intern or junior software engineer in Surat, Vapi, Valsad, or remote? 
              I am ready to contribute from day one.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <NavLink 
                to="/contact" 
                className="btn btn-primary" 
                style={{ padding: '1rem 2.4rem', fontSize: '1rem' }}
              >
                <span>Get In Touch</span>
                <ArrowRight size={18} />
              </NavLink>

              <a 
                href={`mailto:${personalData.email}`} 
                className="btn btn-outline"
                style={{ padding: '1rem 2rem', fontSize: '1rem' }}
              >
                <span>Email Me Directly</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Case Study Modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </div>
  );
}
