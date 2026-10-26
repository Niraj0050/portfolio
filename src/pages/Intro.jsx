import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUniverse } from '../components/Aether/universe.js';
import '../styles/Aether.css';

export default function Intro() {
  const navigate = useNavigate();
  const host = useRef(null);
  const experience = useRef(null);
  const universe = useRef(null);
  
  const [status, setStatus] = useState('Gathering particles');
  const [error, setError] = useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [projectsVisible, setProjectsVisible] = useState(false);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const [journeyVisible, setJourneyVisible] = useState(false);
  const [contactVisible, setContactVisible] = useState(false);
  const [activeProject, setActiveProject] = useState(0);
  const [introDisabled, setIntroDisabled] = useState(false);

  useEffect(() => {
    const paintProgress = (p) => {
      const smooth = (a, b) => {
        const t = Math.max(0, Math.min(1, (p - a) / (b - a)));
        return t * t * (3 - 2 * t);
      };
      
      const about = smooth(0.12, 0.17) * (1 - smooth(0.27, 0.3));
      const projects = 0;
      const skills = smooth(0.29, 0.32) * (1 - smooth(0.5, 0.53));
      const journey = smooth(0.51, 0.54) * (1 - smooth(0.73, 0.76));
      const contact = smooth(0.74, 0.78);

      if (experience.current) {
        experience.current.style.setProperty('--intro-opacity', 1 - smooth(0.01, 0.1));
        experience.current.style.setProperty('--about-opacity', about);
        experience.current.style.setProperty('--projects-opacity', projects);
        experience.current.style.setProperty('--skills-opacity', skills);
        experience.current.style.setProperty('--journey-opacity', journey);
        experience.current.style.setProperty('--contact-opacity', contact);
        experience.current.style.setProperty('--about-offset', `${(1 - about) * 20}px`);
        experience.current.style.setProperty('--story-progress', p);
      }

      setAboutVisible(p > 0.12 && p < 0.3);
      setProjectsVisible(false);
      setSkillsVisible(p > 0.29 && p < 0.53);
      setJourneyVisible(p > 0.51 && p < 0.76);
      setContactVisible(p > 0.74);
      setActiveProject(0);
      setIntroDisabled(p > 0.1);
    };

    try {
      if (host.current) {
        universe.current = createUniverse(host.current, setStatus, paintProgress);
      }
    } catch (e) {
      console.error('WebGL Universe initialization failed:', e);
      setError(true);
    }

    const scroll = () => {
      if (!experience.current) return;
      const distance = experience.current.offsetHeight - window.innerHeight;
      const p = Math.max(0, Math.min(1, window.scrollY / Math.max(1, distance)));
      if (universe.current) universe.current.setScrollProgress(p);
      else paintProgress(p);
    };

    window.addEventListener('scroll', scroll, { passive: true });
    window.addEventListener('resize', scroll);
    scroll();

    return () => {
      window.removeEventListener('scroll', scroll);
      window.removeEventListener('resize', scroll);
      universe.current?.dispose();
    };
  }, []);

  const scrollToProgress = (progress) => {
    if (!experience.current) return;
    window.scrollTo({
      top: (experience.current.offsetHeight - window.innerHeight) * progress,
      behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
    });
  };

  const showAbout = () => scrollToProgress(0.2);
  const showSkills = () => scrollToProgress(0.38);
  const showJourney = () => scrollToProgress(0.61);
  const showContact = () => scrollToProgress(0.84);
  const backToSpace = () => window.scrollTo({
    top: 0,
    behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'
  });

  return (
    <main
      ref={experience}
      className={`experience${introDisabled ? ' intro-disabled' : ''}${error ? ' has-render-error' : ''}`}
    >
      <div className="stage">
        {/* 3D WebGL Canvas Host */}
        <div
          ref={host}
          className="universe"
          aria-label="Scroll to transform an electric universe into Niraj Kumar's introduction"
        />

        {/* Global Minimal Header */}
        <header>
          <button 
            className="brand" 
            onClick={backToSpace} 
            aria-label="Return to the universe"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              fontWeight: 800,
              fontSize: '1.25rem',
              fontFamily: 'var(--font-heading, "Space Grotesk", sans-serif)',
              letterSpacing: '0.5px',
              textTransform: 'none'
            }}
          >
            <div 
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #ff6b2b, #ff3b30)',
                padding: '3px',
                boxShadow: '0 4px 16px rgba(255, 107, 43, 0.4)'
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
            <span style={{ color: '#fff' }}>Niraj <span style={{ color: '#ff6b2b' }}>Kumar</span></span>
          </button>
          
          <div className="header-nav">
            <Link to="/" className="portfolio-link" title="Open Standard Portfolio">
              PORTFOLIO ↗
            </Link>
            <span className="live">
              <i />
              {contactVisible
                ? '05 / OPEN CHANNEL'
                : journeyVisible
                ? '04 / JOURNEY'
                : skillsVisible
                ? '03 / SKILLS'
                : projectsVisible
                ? `${String(activeProject + 3).padStart(2, '0')} / PROJECT ${String(activeProject + 1).padStart(2, '0')}`
                : aboutVisible
                ? '02 / ABOUT ME'
                : '01 / THE UNIVERSE'}
            </span>
          </div>
        </header>

        {/* Hidden SEO / Screen-Reader Heading */}
        <h1 className="sr-only">Niraj Kumar — Full Stack Web Developer</h1>

        {/* Hardware / WebGL Fallback Error Alert */}
        {error && (
          <div role="alert" className="error">
            This experience needs WebGL. Please enable hardware acceleration in your browser and reload.
          </div>
        )}

        {/* Universe Interactive Controls & Live Status */}
        <footer className="universe-controls" aria-hidden={introDisabled}>
          <div className="status" role="status">
            <i />{status}
          </div>
          <div className="instructions">
            <span>HOVER TO CONNECT</span>
            <span>CLICK / TAP TO RELEASE</span>
          </div>
          <button
            disabled={introDisabled}
            onClick={() => universe.current?.replay()}
            aria-label="Replay sphere formation"
          >
            ↻ <span>REPLAY</span>
          </button>
        </footer>

        {/* Quick Interaction Energy Pulse Trigger */}
        <button
          className="keyboard-pulse"
          disabled={introDisabled}
          aria-hidden={introDisabled}
          onClick={() => universe.current?.pulse()}
        >
          Release energy <span>↗</span>
        </button>

        {/* Invitation to Scroll into 3D Typography */}
        <button
          className="scroll-invitation"
          disabled={introDisabled}
          aria-hidden={introDisabled}
          onClick={showAbout}
        >
          SCROLL TO DISCOVER ME <span>↓</span>
        </button>

        {/* Timeline Progression Line Indicator */}
        <div className="chapter-line" aria-hidden="true">
          <span />
        </div>

        {/* Chapter 02: ABOUT ME
            When WebGL is active, the 3D particles morph into "NIRAJ KUMAR" and
            the canvas-about 3D texture renders inside Three.js space.
            The DOM section below acts as a screen-reader alternative or fallback. */}
        <section
          className={`${error ? 'about-panel' : 'about-accessibility sr-only'}${aboutVisible ? ' is-visible' : ''}`}
          aria-hidden={!aboutVisible}
          aria-labelledby="about-role"
        >
          <p className="fallback-name">NIRAJ KUMAR</p>
          <p className="about-kicker">THE PERSON BEHIND THE PARTICLES</p>
          <h2 id="about-role">Full Stack Web Developer</h2>
          <p className="about-description">
            I build modern web experiences—from responsive interfaces to robust backend systems.
          </p>
          <ul className="skill-list" aria-label="Core technologies">
            {['React', 'PHP', 'JavaScript', 'Python', 'MySQL'].map((skill) => (
              <li key={skill}>{skill}</li>
            ))}
          </ul>
        </section>

        {/* Chapter 02 Bottom Navigation Controls */}
        <div className={`about-bottom${aboutVisible ? ' is-visible' : ''}`} aria-hidden={!aboutVisible}>
          <span>BASED IN GUJARAT, INDIA</span>
          <button tabIndex={aboutVisible ? 0 : -1} onClick={backToSpace}>
            ↑ BACK TO THE UNIVERSE
          </button>
          <button tabIndex={aboutVisible ? 0 : -1} onClick={showSkills}>
            EXPLORE MY SKILLS ↓
          </button>
        </div>

        {/* Chapter 03: VERIFIED COMPETENCIES (Skills) */}
        <section
          className={`story-panel skills-panel${skillsVisible ? ' is-visible' : ''}`}
          aria-hidden={!skillsVisible}
        >
          <div className="section-heading">
            <p>03 / VERIFIED COMPETENCIES</p>
            <h2>Four systems. One connected stack.</h2>
            <span>Every cluster is formed by the same particles that powered the universe.</span>
          </div>
          <div className="skill-clusters" aria-label="Technical skills">
            <article>
              <b>01</b>
              <h3>Frontend</h3>
              <p>React · JavaScript · HTML5 · CSS3</p>
            </article>
            <article>
              <b>02</b>
              <h3>3D &amp; Motion</h3>
              <p>Three.js · WebGL · Interactive UI</p>
            </article>
            <article>
              <b>03</b>
              <h3>Backend</h3>
              <p>PHP · Node.js · REST APIs · MySQL</p>
            </article>
            <article>
              <b>04</b>
              <h3>Data &amp; Systems</h3>
              <p>Python · Pandas · Scikit-Learn · Tkinter</p>
            </article>
          </div>
          <button
            className="chapter-next"
            tabIndex={skillsVisible ? 0 : -1}
            onClick={showJourney}
          >
            FOLLOW THE JOURNEY ↓
          </button>
        </section>

        {/* Chapter 04: SIGNAL HISTORY (Journey) */}
        <section
          className={`story-panel journey-panel${journeyVisible ? ' is-visible' : ''}`}
          aria-hidden={!journeyVisible}
        >
          <div className="section-heading">
            <p>04 / SIGNAL HISTORY</p>
            <h2>Learning by building.</h2>
            <span>A journey from core programming to real-time browser experiences.</span>
          </div>
          <ol className="journey-track">
            <li>
              <b>FOUNDATION</b>
              <strong>Computer Science</strong>
              <span>Programming, data structures and relational thinking.</span>
            </li>
            <li>
              <b>SYSTEMS</b>
              <strong>Python + MySQL</strong>
              <span>Desktop applications and structured data workflows.</span>
            </li>
            <li>
              <b>WEB</b>
              <strong>Full-Stack Development</strong>
              <span>Responsive React interfaces and backend services.</span>
            </li>
            <li>
              <b>NOW</b>
              <strong>Immersive WebGL</strong>
              <span>Particle systems, 3D interaction and motion design.</span>
            </li>
          </ol>
          <button
            className="chapter-next"
            tabIndex={journeyVisible ? 0 : -1}
            onClick={showContact}
          >
            OPEN A CHANNEL ↓
          </button>
        </section>

        {/* Chapter 05: TRANSMISSION READY (Contact) */}
        <section
          className={`story-panel contact-panel${contactVisible ? ' is-visible' : ''}`}
          aria-hidden={!contactVisible}
        >
          <div className="contact-copy">
            <p>05 / TRANSMISSION READY</p>
            <h2>Let’s build something exceptional.</h2>
            <span>Available for full-stack developer opportunities, internships and ambitious collaborations.</span>
          </div>
          <nav className="contact-links" aria-label="Contact Niraj Kumar">
            <a tabIndex={contactVisible ? 0 : -1} href="mailto:nirajkumar851127@gmail.com">
              EMAIL <i>↗</i>
            </a>
            <a
              tabIndex={contactVisible ? 0 : -1}
              href="https://github.com/niraj0050"
              target="_blank"
              rel="noreferrer"
            >
              GITHUB <i>↗</i>
            </a>
            <a
              tabIndex={contactVisible ? 0 : -1}
              href="https://linkedin.com/in/niraj0050"
              target="_blank"
              rel="noreferrer"
            >
              LINKEDIN <i>↗</i>
            </a>
          </nav>
          <p className="contact-location">SURAT / VAPI / VALSAD · GUJARAT, INDIA</p>
          
          <div className="main-site-cta">
            <button
              className="enter-portfolio-btn"
              tabIndex={contactVisible ? 0 : -1}
              onClick={() => navigate('/')}
            >
              Enter Full Portfolio ↗
            </button>
            <button
              className="chapter-next"
              tabIndex={contactVisible ? 0 : -1}
              onClick={backToSpace}
            >
              REPLAY THE UNIVERSE ↑
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}
