import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Sun, Moon, Menu, X, FileText, Code2, Sparkles } from 'lucide-react';

export default function Navbar({ theme, toggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Projects', path: '/projects' },
    { name: 'Skills', path: '/skills' },
    { name: 'Contact', path: '/contact' },
    { name: '3D Intro', path: '/intro' }
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backgroundColor: scrolled ? 'var(--nav-bg)' : 'transparent',
        backdropFilter: scrolled ? 'blur(20px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-color)' : '1px solid transparent',
        transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' }}>
        
        {/* Brand Logo with 3D Holographic glow accent */}
        <NavLink 
          to="/" 
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.75rem', 
            fontWeight: 800, 
            fontSize: '1.35rem', 
            fontFamily: 'var(--font-heading)' 
          }}
        >
          <div 
            style={{
              width: '42px',
              height: '42px',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'var(--accent-gradient)',
              padding: '3px',
              boxShadow: '0 4px 16px var(--accent-glow)'
            }}
          >
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
          <span>Niraj <span style={{ color: '#ffffff' }}>Kumar</span></span>
        </NavLink>

        {/* Desktop Nav Links */}
        <nav style={{ display: 'none', gap: '2.5rem', alignItems: 'center' }} className="desktop-nav">
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              className={({ isActive }) => (isActive ? 'active-nav-link' : 'nav-link')}
              style={({ isActive }) => ({
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.95rem',
                color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.65)',
                transition: 'var(--transition-fast)',
                position: 'relative',
                padding: '0.4rem 0',
                borderBottom: isActive ? '2px solid var(--accent-red, #dc2626)' : '2px solid transparent'
              })}
            >
              {link.name}
            </NavLink>
          ))}
        </nav>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          
          {/* Download Resume Pill Button */}
          <a
            href="/resume/resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            style={{ 
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.55rem 1.35rem',
              fontSize: '0.88rem',
              fontWeight: 500,
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              color: '#ffffff',
              background: 'rgba(255, 255, 255, 0.03)',
              backdropFilter: 'blur(10px)',
              transition: 'all 0.25s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-red, #dc2626)';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.boxShadow = '0 0 16px rgba(220, 38, 38, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.18)';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            <FileText size={15} />
            <span>Download Resume</span>
          </a>

          {/* Theme Toggle Button */}
          {/* <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            style={{
              padding: '0.55rem',
              borderRadius: 'var(--radius-full)',
              background: 'transparent',
              border: 'none',
              color: 'rgba(255, 255, 255, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'var(--transition-fast)',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-red, #dc2626)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
          >
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
          </button> */}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            className="mobile-toggle"
            style={{
              padding: '0.5rem',
              color: 'var(--text-primary)',
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer'
            }}
          >
            {isOpen ? <X size={26} color="var(--accent-red, #dc2626)" /> : <Menu size={26} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div
          style={{
            background: 'var(--bg-secondary)',
            borderBottom: '1px solid var(--border-color)',
            padding: '1.75rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1.25rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
          }}
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              to={link.path}
              style={({ isActive }) => ({
                fontWeight: 600,
                fontSize: '1.15rem',
                color: isActive ? 'var(--accent-red, #dc2626)' : 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem'
              })}
            >
              {link.name}
            </NavLink>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-toggle { display: none !important; }
        }
        @media (max-width: 767px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
      `}</style>
    </header>
  );
}
