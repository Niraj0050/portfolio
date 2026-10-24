import React from 'react';
import { NavLink } from 'react-router-dom';
import { Github, Linkedin, Mail, ArrowUp, Code2, Sparkles, MapPin, Phone } from 'lucide-react';
import { personalData } from '../../data/portfolioData';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer 
      style={{ 
        background: 'var(--bg-secondary)', 
        borderTop: '1px solid var(--border-color)', 
        paddingTop: '5rem', 
        paddingBottom: '2.5rem',
        position: 'relative',
        zIndex: 1
      }}
    >
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3.5rem', marginBottom: '3.5rem' }}>
          
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 800, fontSize: '1.4rem', fontFamily: 'var(--font-heading)', marginBottom: '1.25rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3px',
                boxShadow: '0 4px 15px var(--accent-glow)'
              }}>
                <img 
                  src="/logo/logow.png" 
                  alt="Logo" 
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <span>Niraj<span className="gradient-text">Kumar</span></span>
            </div>

            <p style={{ color: 'var(--text-secondary)', fontSize: '0.94rem', lineHeight: '1.7', marginBottom: '1.5rem', maxWidth: '320px' }}>
              Full Stack Web Developer specialized in React.js, Three.js, PHP, Python, and MySQL. 
              Engineering scalable web applications and real-time interactive experiences.
            </p>

            <div 
              style={{ 
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.6rem', 
                padding: '0.4rem 0.95rem', 
                borderRadius: 'var(--radius-full)', 
                background: 'rgba(16, 185, 129, 0.12)', 
                border: '1px solid rgba(16, 185, 129, 0.35)', 
                color: '#10b981', 
                fontSize: '0.82rem', 
                fontWeight: 600 
              }}
            >
              <span className="status-beacon"></span>
              <span>{personalData.availability}</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Navigation</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.94rem' }}>
              <li>
                <NavLink to="/" style={{ color: 'var(--text-secondary)', transition: 'var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = 'var(--accent-orange)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
                  Home & 3D Core
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" style={{ color: 'var(--text-secondary)', transition: 'var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = 'var(--accent-orange)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
                  About & Background
                </NavLink>
              </li>
              <li>
                <NavLink to="/projects" style={{ color: 'var(--text-secondary)', transition: 'var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = 'var(--accent-orange)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
                  Interactive 3D Projects
                </NavLink>
              </li>
              <li>
                <NavLink to="/skills" style={{ color: 'var(--text-secondary)', transition: 'var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = 'var(--accent-orange)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
                  Skills & Technology Stack
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" style={{ color: 'var(--text-secondary)', transition: 'var(--transition-fast)' }} onMouseEnter={(e) => e.target.style.color = 'var(--accent-orange)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
                  Connect & Direct Inquiry
                </NavLink>
              </li>
            </ul>
          </div>

          {/* Contact & Location */}
          <div>
            <h4 style={{ fontSize: '1.15rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>Location & Channels</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <MapPin size={17} color="var(--accent-orange)" />
                <span>Surat / Vapi / Valsad, Gujarat, India</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Phone size={17} color="var(--accent-cyan)" />
                <span>+91 87339 19321</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Mail size={17} color="var(--accent-amber)" />
                <span>{personalData.email}</span>
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '0.85rem' }}>
              <a 
                href={personalData.github} 
                target="_blank" 
                rel="noreferrer" 
                aria-label="GitHub Profile" 
                style={{ 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: '50%', 
                  background: 'var(--bg-primary)', 
                  border: '1px solid var(--border-color)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: 'var(--text-primary)', 
                  transition: 'var(--transition-fast)' 
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-orange)';
                  e.currentTarget.style.color = 'var(--accent-orange)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
              >
                <Github size={18} />
              </a>

              <a 
                href={personalData.linkedin} 
                target="_blank" 
                rel="noreferrer" 
                aria-label="LinkedIn Profile" 
                style={{ 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: '50%', 
                  background: 'var(--bg-primary)', 
                  border: '1px solid var(--border-color)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: 'var(--text-primary)', 
                  transition: 'var(--transition-fast)' 
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                  e.currentTarget.style.color = 'var(--accent-cyan)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
              >
                <Linkedin size={18} />
              </a>

              <a 
                href={`mailto:${personalData.email}`} 
                aria-label="Email Me" 
                style={{ 
                  width: '42px', 
                  height: '42px', 
                  borderRadius: '50%', 
                  background: 'var(--bg-primary)', 
                  border: '1px solid var(--border-color)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  color: 'var(--text-primary)', 
                  transition: 'var(--transition-fast)' 
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-amber)';
                  e.currentTarget.style.color = 'var(--accent-amber)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-color)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }}
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Copyright Bar */}
        <div 
          style={{ 
            borderTop: '1px solid var(--border-color)', 
            paddingTop: '2rem', 
            display: 'flex', 
            flexWrap: 'wrap', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            gap: '1.25rem' 
          }}
        >
          <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
            © {new Date().getFullYear()} Pandit Nirajkumar Balistar. Crafted with React 18 & Three.js WebGL.
          </p>

          <button
            onClick={scrollToTop}
            aria-label="Scroll back to top"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.6rem', 
              color: 'var(--text-secondary)', 
              fontSize: '0.88rem', 
              fontWeight: 600,
              cursor: 'pointer' 
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-orange)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <span>Back to top</span>
            <div 
              style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: 'var(--bg-primary)', 
                border: '1px solid var(--border-color)', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}
            >
              <ArrowUp size={15} />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
