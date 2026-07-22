import React from 'react';
import { NavLink } from 'react-router-dom';
import { Github, Linkedin, Mail, ArrowUp, Code2 } from 'lucide-react';
import { personalData } from '../../data/portfolioData';

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', paddingTop: '4rem', paddingBottom: '2rem' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontWeight: 700, fontSize: '1.3rem', fontFamily: 'var(--font-heading)', marginBottom: '1rem' }}>
              <div style={{
                width: '34px',
                height: '34px',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--accent-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}>
                {/* <Code2 size={20} /> */}
                 <img 
              src="/logo/logow.png" 
              alt="Logo" 
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
              </div>
              <span>Pandit Nirajkumar</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.2rem' }}>
              Full Stack Web Developer specializing in React.js, PHP, Python, and MySQL. Focused on building responsive, high-performance web applications.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: '#10b981', fontSize: '0.8rem', fontWeight: 600 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10b981', display: 'inline-block' }}></span>
              {personalData.availability}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.2rem' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
              <li><NavLink to="/" style={{ color: 'var(--text-secondary)' }}>Home</NavLink></li>
              <li><NavLink to="/about" style={{ color: 'var(--text-secondary)' }}>About & Experience</NavLink></li>
              <li><NavLink to="/projects" style={{ color: 'var(--text-secondary)' }}>Projects Portfolio</NavLink></li>
              <li><NavLink to="/skills" style={{ color: 'var(--text-secondary)' }}>Skills & Stack</NavLink></li>
              <li><NavLink to="/contact" style={{ color: 'var(--text-secondary)' }}>Get In Touch</NavLink></li>
            </ul>
          </div>

          {/* Connect & Socials */}
          <div>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '1.2rem' }}>Connect</h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              Surat / Vapi / Valsad, Gujarat, India
            </p>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>
              +91 87339 19321
            </p>
            
            <div style={{ display: 'flex', gap: '0.8rem' }}>
              <a href={personalData.github} target="_blank" rel="noreferrer" aria-label="GitHub" style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', transition: 'var(--transition-fast)' }}>
                <Github size={18} />
              </a>
              <a href={personalData.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', transition: 'var(--transition-fast)' }}>
                <Linkedin size={18} />
              </a>
              <a href={`mailto:${personalData.email}`} aria-label="Email" style={{ width: '38px', height: '38px', borderRadius: '50%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', transition: 'var(--transition-fast)' }}>
                <Mail size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            © {new Date().getFullYear()} Pandit Nirajkumar Balistar.
          </p>

          <button
            onClick={scrollToTop}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 500 }}
          >
            <span>Back to top</span>
            <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'var(--bg-primary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <ArrowUp size={14} />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
}
