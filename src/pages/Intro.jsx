import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  ExternalLink, 
  Github, 
  Mail, 
  Phone, 
  MapPin, 
  Volume2, 
  VolumeX, 
  Code2, 
  Layers, 
  Cpu, 
  GraduationCap,
  Briefcase,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Eye,
  EyeOff
} from 'lucide-react';
import { personalData, experienceData, educationData, skillsData } from '../data/portfolioData';
import IntroScene from '../components/Three/IntroScene';
import '../styles/Intro.css';

export default function Intro() {
  const navigate = useNavigate();

  // Initialize progress from URL query param if present (e.g. ?scene=about, ?scene=skills, ?p=0.25, ?virtualP=1.33)
  const getInitialProgress = () => {
    try {
      const params = new URLSearchParams(window.location.search);
      const vpParam = params.get('virtualP');
      if (vpParam !== null) {
        const val = parseFloat(vpParam);
        if (!isNaN(val)) return val;
      }
      const pParam = params.get('p');
      if (pParam !== null) {
        const val = parseFloat(pParam);
        if (!isNaN(val)) return val;
      }
      const sceneParam = params.get('scene');
      if (sceneParam !== null) {
        const sceneMap = { hero: 0, about: 1, expertise: 2, skills: 2, contact: 3 };
        const sIdx = sceneMap[sceneParam.toLowerCase()] ?? parseInt(sceneParam, 10);
        if (!isNaN(sIdx) && sIdx >= 0 && sIdx <= 3) {
          return [0.0, 0.33, 0.66, 0.93][sIdx];
        }
      }
    } catch (e) {}
    return 0;
  };

  const initialProg = useRef(getInitialProgress()).current;
  const targetProgressRef = useRef(initialProg);
  const scrollProgressRef = useRef(initialProg);
  const [currentProgress, setCurrentProgress] = useState(initialProg);
  const [activeSection, setActiveSection] = useState(() => {
    if (initialProg >= 0.82 && initialProg < 0.95) return 3;
    if (initialProg >= 0.50 && initialProg < 0.82) return 2;
    if (initialProg >= 0.20 && initialProg < 0.50) return 1;
    return 0;
  });

  const [isUiHidden, setIsUiHidden] = useState(false);
  const [isHeroRevealed, setIsHeroRevealed] = useState(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const forcedTau = params.get('revealTau');
      if (forcedTau !== null && !isNaN(parseFloat(forcedTau))) {
        return parseFloat(forcedTau) >= 1.0;
      }
    } catch (e) {}
    return initialProg > 0.03;
  });
  const handleHeroRevealed = useCallback(() => {
    setIsHeroRevealed(true);
  }, []);

  const pointerDotRef = useRef(null);
  const pointerRingRef = useRef(null);
  const [isAudioActive, setIsAudioActive] = useState(false);
  const audioContextRef = useRef(null);
  const audioNodesRef = useRef(null);

  // 1. Shortest-path Geodesic Milestone Jump on Closed Periodic Loop
  const jumpToScene = useCallback((sceneIndex) => {
    const milestones = [0.0, 0.33, 0.66, 0.93];
    const targetMilestone = milestones[sceneIndex];
    if (targetMilestone === undefined) return;

    const currentTarget = targetProgressRef.current;
    const currentWrapped = ((currentTarget % 1.0) + 1.0) % 1.0;

    // Compute shortest angular displacement on circle in [-0.5, 0.5]
    let diff = (targetMilestone - currentWrapped) % 1.0;
    if (diff > 0.5) diff -= 1.0;
    if (diff < -0.5) diff += 1.0;

    // Apply target displacement so camera moves directly to milestone along shortest path
    targetProgressRef.current = currentTarget + diff;
  }, []);

  // 2. Authoritative Continuous Virtual Scroll Progress Engine
  useEffect(() => {
    let animId;
    let lastRenderedProgress = initialProg;
    let lastRenderedSection = -1;

    // A. Normalized Wheel handler (Desktop mouse, Apple Magic Trackpad, Windows precision touchpad)
    const handleWheel = (e) => {
      // Do not prevent default if scrolling inside an internal overflowing panel
      const targetPanel = e.target.closest('.cinematic-intro-panel');
      if (targetPanel && targetPanel.scrollHeight > targetPanel.clientHeight) {
        const atTop = targetPanel.scrollTop <= 0 && e.deltaY < 0;
        const atBottom = targetPanel.scrollTop + targetPanel.clientHeight >= targetPanel.scrollHeight - 1 && e.deltaY > 0;
        if (!atTop && !atBottom) {
          return; // Let the card scroll internally
        }
      }

      e.preventDefault();
      let dy = e.deltaY;
      if (e.deltaMode === 1) dy *= 32;       // Line mode
      else if (e.deltaMode === 2) dy *= 800; // Page mode

      // Clamp single-tick spike to avoid huge jumps on fast mouse wheel flicks
      const clampedDy = Math.max(-120, Math.min(120, dy));

      // 4200px equivalent for a complete 360-degree journey loop
      targetProgressRef.current += clampedDy / 4200;
    };

    // B. Touch gestures with mobile overscroll prevention and kinetic momentum
    let touchStartY = 0;
    let touchLastY = 0;
    let touchVelocity = 0;
    let lastTouchTime = 0;

    const handleTouchStart = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      touchStartY = e.touches[0].clientY;
      touchLastY = touchStartY;
      touchVelocity = 0;
      lastTouchTime = performance.now();
    };

    const handleTouchMove = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      // Allow scroll inside tall modal cards on mobile
      const targetPanel = e.target.closest('.cinematic-intro-panel');
      if (targetPanel && targetPanel.scrollHeight > targetPanel.clientHeight) {
        return;
      }

      e.preventDefault(); // Prevent native pull-to-refresh & browser bounce
      const clientY = e.touches[0].clientY;
      const dy = touchLastY - clientY; // Swipe up = advance forward
      const now = performance.now();
      const dt = Math.max(1, now - lastTouchTime);
      touchVelocity = dy / dt;
      touchLastY = clientY;
      lastTouchTime = now;

      // 1800px touch drag per full 360-degree loop
      targetProgressRef.current += dy / 1800;
    };

    const handleTouchEnd = () => {
      // Apply kinetic touch inertia flick
      if (Math.abs(touchVelocity) > 0.12) {
        const impulse = Math.max(-0.22, Math.min(0.22, touchVelocity * 0.08));
        targetProgressRef.current += impulse;
      }
      touchVelocity = 0;
    };

    // C. RAF Damping and UI Synchronization Loop
    const updateProgress = () => {
      animId = requestAnimationFrame(updateProgress);

      const target = targetProgressRef.current;
      const current = scrollProgressRef.current;
      const diff = target - current;

      // Critically damped follower (smooth cinematic inertia)
      scrollProgressRef.current += diff * 0.085;

      // Keep accumulated progress numbers within a bounded range to prevent floating-point precision loss
      if (Math.abs(targetProgressRef.current) > 20.0) {
        const cycles = Math.trunc(targetProgressRef.current);
        targetProgressRef.current -= cycles;
        scrollProgressRef.current -= cycles;
      }

      // Wrapped periodic progress for UI panels & indicator in [0, 1)
      const wrapped = ((scrollProgressRef.current % 1.0) + 1.0) % 1.0;

      // Only trigger React state updates when progress has changed significantly to maintain 60/120fps
      if (Math.abs(wrapped - lastRenderedProgress) > 0.001) {
        lastRenderedProgress = wrapped;
        setCurrentProgress(wrapped);

        // Derive active milestone [0..3]
        let sec = 0;
        if (wrapped >= 0.82 && wrapped < 0.95) sec = 3;
        else if (wrapped >= 0.50 && wrapped < 0.82) sec = 2;
        else if (wrapped >= 0.20 && wrapped < 0.50) sec = 1;
        else sec = 0;

        if (sec !== lastRenderedSection) {
          lastRenderedSection = sec;
          setActiveSection(sec);
        }
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    animId = requestAnimationFrame(updateProgress);

    // Optional query param test drivers: ?wheelTicks=80, ?jumpTo=0, ?jumpTo=3
    try {
      const params = new URLSearchParams(window.location.search);
      const ticks = params.get('wheelTicks');
      if (ticks !== null && !isNaN(parseInt(ticks, 10))) {
        targetProgressRef.current += (parseInt(ticks, 10) * 100) / 4200;
      }
      const jumpParam = params.get('jumpTo');
      if (jumpParam !== null && !isNaN(parseInt(jumpParam, 10))) {
        setTimeout(() => jumpToScene(parseInt(jumpParam, 10)), 150);
      }
    } catch (e) {}

    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      cancelAnimationFrame(animId);
    };
  }, [initialProg]);

  // 3. Custom Reticle Pointer Follower (Physics Damping & Magnetic Hover)
  useEffect(() => {
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animId;
    let isHovering = false;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (pointerDotRef.current) {
        pointerDotRef.current.style.opacity = '1';
        pointerDotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }
      if (pointerRingRef.current) {
        pointerRingRef.current.style.opacity = '1';
      }

      // Check if hovering interactive target
      const target = e.target;
      const clickable = target && (target.closest('button, a, .cinematic-intro-milestone, [role="button"]') || target.tagName === 'BUTTON' || target.tagName === 'A');
      if (Boolean(clickable) !== isHovering) {
        isHovering = Boolean(clickable);
        if (pointerRingRef.current) {
          if (isHovering) {
            pointerRingRef.current.classList.add('is-hovering');
          } else {
            pointerRingRef.current.classList.remove('is-hovering');
          }
        }
      }
    };

    const handleMouseLeave = () => {
      if (pointerDotRef.current) pointerDotRef.current.style.opacity = '0';
      if (pointerRingRef.current) pointerRingRef.current.style.opacity = '0';
    };

    const handleMouseDown = () => {
      if (pointerRingRef.current) pointerRingRef.current.classList.add('is-clicking');
    };

    const handleMouseUp = () => {
      if (pointerRingRef.current) pointerRingRef.current.classList.remove('is-clicking');
    };

    const updateRing = () => {
      animId = requestAnimationFrame(updateRing);
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      if (pointerRingRef.current) {
        pointerRingRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    animId = requestAnimationFrame(updateRing);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      cancelAnimationFrame(animId);
    };
  }, []);

  // 4. Keyboard Navigation (Escape exits, H toggles UI text, Arrow Down/Up steps sections)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        navigate('/');
      } else if (e.key === 'h' || e.key === 'H') {
        setIsUiHidden((prev) => !prev);
      } else if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        const currentWrapped = ((targetProgressRef.current % 1.0) + 1.0) % 1.0;
        let nextIdx = 0;
        if (currentWrapped < 0.25) nextIdx = 1;
        else if (currentWrapped < 0.55) nextIdx = 2;
        else if (currentWrapped < 0.85) nextIdx = 3;
        else nextIdx = 0;
        jumpToScene(nextIdx);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const currentWrapped = ((targetProgressRef.current % 1.0) + 1.0) % 1.0;
        let prevIdx = 3;
        if (currentWrapped > 0.88) prevIdx = 2;
        else if (currentWrapped > 0.55) prevIdx = 1;
        else if (currentWrapped > 0.25) prevIdx = 0;
        else prevIdx = 3;
        jumpToScene(prevIdx);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [jumpToScene, navigate]);

  // 5. Strict Mutual Exclusion Panel Style Calculator with Seamless Loop Boundary
  // Guarantees ONLY the active/transitioning chapter panel is visible. Zero stacked/overlapping text!
  const getPanelStyle = useCallback((sceneIndex, p) => {
    let opacity = 0;
    let translateY = 0;
    let isVisible = false;

    if (sceneIndex === 0) {
      // Chapter 01: Hero [0.95 -> 1.00] (Loop Re-entry emergence) and [0.00 -> 0.20] (Hero presence & exit)
      if (p >= 0.95) {
        const t = (p - 0.95) / 0.05;
        opacity = t;
        translateY = (1 - t) * 16;
        isVisible = true;
      } else if (p <= 0.12) {
        opacity = 1;
        translateY = 0;
        isVisible = true;
      } else if (p < 0.20) {
        const t = (p - 0.12) / 0.08;
        opacity = 1 - t;
        translateY = -t * 20;
        isVisible = true;
      }
    } else if (sceneIndex === 1) {
      // Chapter 02: About [0.20 - 0.50]
      if (p >= 0.20 && p < 0.28) {
        const t = (p - 0.20) / 0.08;
        opacity = t;
        translateY = (1 - t) * 20;
        isVisible = true;
      } else if (p >= 0.28 && p <= 0.42) {
        opacity = 1;
        translateY = 0;
        isVisible = true;
      } else if (p > 0.42 && p < 0.50) {
        const t = (p - 0.42) / 0.08;
        opacity = 1 - t;
        translateY = -t * 20;
        isVisible = true;
      }
    } else if (sceneIndex === 2) {
      // Chapter 03: Expertise & Experience [0.50 - 0.80]
      if (p >= 0.50 && p < 0.58) {
        const t = (p - 0.50) / 0.08;
        opacity = t;
        translateY = (1 - t) * 20;
        isVisible = true;
      } else if (p >= 0.58 && p <= 0.72) {
        opacity = 1;
        translateY = 0;
        isVisible = true;
      } else if (p > 0.72 && p < 0.80) {
        const t = (p - 0.72) / 0.08;
        opacity = 1 - t;
        translateY = -t * 20;
        isVisible = true;
      }
    } else if (sceneIndex === 3) {
      // Chapter 04: Contact & Loop Gate [0.82 - 0.96]
      if (p >= 0.82 && p < 0.90) {
        const t = (p - 0.82) / 0.08;
        opacity = t;
        translateY = (1 - t) * 20;
        isVisible = true;
      } else if (p >= 0.90 && p <= 0.93) {
        opacity = 1;
        translateY = 0;
        isVisible = true;
      } else if (p > 0.93 && p < 0.96) {
        const t = (p - 0.93) / 0.03;
        opacity = 1 - t;
        translateY = -t * 16;
        isVisible = true;
      }
    }

    const clampedOpacity = Math.max(0, Math.min(1, opacity));

    return {
      opacity: clampedOpacity,
      transform: `translateY(${translateY}px)`,
      pointerEvents: isVisible && clampedOpacity > 0.4 ? 'auto' : 'none',
      visibility: isVisible ? 'visible' : 'hidden',
      display: isVisible ? 'block' : 'none',
    };
  }, []);

  // 6. Procedural Ambient Drone Synthesizer (User Opt-In, defaults to OFF)
  const toggleAmbientAudio = () => {
    if (isAudioActive) {
      if (audioNodesRef.current) {
        try {
          audioNodesRef.current.gainNode.gain.exponentialRampToValueAtTime(
            0.0001,
            audioContextRef.current.currentTime + 0.6
          );
          setTimeout(() => {
            audioNodesRef.current?.osc1.stop();
            audioNodesRef.current?.osc2.stop();
            audioContextRef.current?.close();
            audioNodesRef.current = null;
            audioContextRef.current = null;
          }, 650);
        } catch (err) {
          console.warn('Audio cleanup issue:', err);
        }
      }
      setIsAudioActive(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;
        const ctx = new AudioCtx();
        audioContextRef.current = ctx;

        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(55, ctx.currentTime);

        const osc2 = ctx.createOscillator();
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(110, ctx.currentTime);

        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(180, ctx.currentTime);

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.0001, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.05, ctx.currentTime + 1.2);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start();
        osc2.start();

        audioNodesRef.current = { osc1, osc2, gainNode };
        setIsAudioActive(true);
      } catch (e) {
        console.warn('AudioContext unavailable or blocked:', e);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioNodesRef.current) {
        try {
          audioNodesRef.current.osc1.stop();
          audioNodesRef.current.osc2.stop();
          audioContextRef.current?.close();
        } catch (e) {}
      }
    };
  }, []);

  return (
    <div className="cinematic-intro-root">
      {/* 1. PERSISTENT THREE.JS 3D WORLD (MONOLITHIC CHROME SHARD & ARCHITECTURAL HORIZON) */}
      <IntroScene 
        scrollProgressRef={scrollProgressRef} 
        onHeroRevealed={handleHeroRevealed} 
      />

      {/* 2. MINIMAL BESPOKE HUD HEADER */}
      <header className="cinematic-intro-hud">
        <Link to="/" className="cinematic-intro-brand" title="Return to Main Portfolio">
          <div className="cinematic-intro-brand-logo">
            <img 
              src="/logo/logow.png" 
              alt="Logo" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }} 
            />
          </div>
          <div className="cinematic-intro-brand-meta">
            <span className="cinematic-intro-brand-name">Niraj Kumar</span>
            <span className="cinematic-intro-brand-tag">
              <span className="cinematic-intro-status-dot" />
              [ ACTIVE // SURAT, IN ]
            </span>
          </div>
        </Link>

        {/* HUD Quick Actions & Navigation Exit */}
        <div className="cinematic-intro-hud-actions">
          {/* Foreground Text Hide / Show Toggle ("foreground ka text hide karne ka option") */}
          <button
            onClick={() => setIsUiHidden((prev) => !prev)}
            className={`cinematic-intro-toggle-ui-btn ${isUiHidden ? 'active' : ''}`}
            aria-label="Toggle foreground information overlay"
            title={isUiHidden ? 'Show foreground info cards (Press H)' : 'Hide foreground info cards for pure 3D view (Press H)'}
          >
            {isUiHidden ? <Eye size={13} color="#ef4444" /> : <EyeOff size={13} />}
            <span>{isUiHidden ? 'SHOW TEXT' : 'HIDE TEXT'}</span>
          </button>

          <button
            onClick={toggleAmbientAudio}
            className={`cinematic-intro-audio-btn ${isAudioActive ? 'active' : ''}`}
            aria-label="Toggle atmospheric sound drone"
            title={isAudioActive ? 'Mute ambient sound' : 'Enable ambient sound'}
          >
            {isAudioActive ? <Volume2 size={13} color="#ef4444" /> : <VolumeX size={13} />}
            <span>{isAudioActive ? 'SOUND ON' : 'AUDIO OFF'}</span>
          </button>

          <Link to="/about" className="cinematic-intro-hud-link">
            About
          </Link>
          <Link to="/projects" className="cinematic-intro-hud-link">
            Projects
          </Link>
          <Link to="/contact" className="cinematic-intro-hud-link">
            Contact
          </Link>

          <Link to="/" className="cinematic-intro-hud-primary-btn">
            <span className="cinematic-intro-hud-btn-desktop">Enter Portfolio</span>
            <span className="cinematic-intro-hud-btn-mobile">Enter</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </header>

      {/* 3. LATERAL 4-SCENE MILESTONE PROGRESS RAIL */}
      <nav className="cinematic-intro-progress-rail" aria-label="Intro Section Navigation">
        <button
          onClick={() => jumpToScene(0)}
          className={`cinematic-intro-milestone ${activeSection === 0 ? 'active' : ''}`}
          title="Chapter 01: Identity & Vision"
        >
          <span className="cinematic-intro-milestone-marker" />
          <span>01</span>
        </button>
        <button
          onClick={() => jumpToScene(1)}
          className={`cinematic-intro-milestone ${activeSection === 1 ? 'active' : ''}`}
          title="Chapter 02: Architectural Foundation"
        >
          <span className="cinematic-intro-milestone-marker" />
          <span>02</span>
        </button>
        <button
          onClick={() => jumpToScene(2)}
          className={`cinematic-intro-milestone ${activeSection === 2 ? 'active' : ''}`}
          title="Chapter 03: Production Systems & Skills"
        >
          <span className="cinematic-intro-milestone-marker" />
          <span>03</span>
        </button>
        <button
          onClick={() => jumpToScene(3)}
          className={`cinematic-intro-milestone ${activeSection === 3 ? 'active' : ''}`}
          title="Chapter 04: Sanctuary & Inquiry"
        >
          <span className="cinematic-intro-milestone-marker" />
          <span>04</span>
        </button>
      </nav>

      {/* 4. PINNED FULL-SCREEN STAGE (STRICT MUTUAL EXCLUSION CHAPTER PANELS) */}
      <main className={`cinematic-intro-ui-stage ${isUiHidden ? 'ui-hidden' : ''}`}>

        {/* CHAPTER 01: HERO / IDENTITY */}
        <section 
          className="cinematic-intro-panel"
          style={getPanelStyle(0, currentProgress)}
          aria-label="Chapter 01: Identity & Vision"
        >
          <div className={`cinematic-intro-card-dock ${isHeroRevealed ? 'hero-revealed' : 'hero-pre-reveal'}`}>
            <div className="cinematic-intro-meta-badge">
              <Sparkles size={12} />
              <span>[ 01 // IDENTITY &amp; VISION ]</span>
            </div>

            <p className="cinematic-intro-supporting-statement">
              “Turning complex ideas into useful digital products, custom software and business systems.”
            </p>

            <p className="cinematic-intro-verification-note">
              Engineered by <strong>{personalData.name}</strong> — B.Sc. Computer Science graduate (VNSGU) &amp; Full Stack Developer at Enlightened Digital Marketing. Specializing in high-performance React architectures, database schemas, and scalable software solutions.
            </p>

            <div className="cinematic-intro-cta-group">
              <Link to="/" className="cinematic-intro-btn-primary">
                <span>Enter Main Portfolio</span>
                <ArrowRight size={15} />
              </Link>
              <button 
                onClick={() => jumpToScene(1)}
                className="cinematic-intro-btn-secondary"
              >
                <span>Explore 3D Journey</span>
                <ChevronDown size={15} />
              </button>
              <Link to="/contact" className="cinematic-intro-btn-secondary">
                <span>Let's Connect</span>
              </Link>
            </div>
          </div>
        </section>

        {/* CHAPTER 02: ABOUT / ARCHITECTURE */}
        <section 
          className="cinematic-intro-panel"
          style={getPanelStyle(1, currentProgress)}
          aria-label="Chapter 02: Architectural Foundation"
        >
          <div className="cinematic-intro-card-dock">
            <div className="cinematic-intro-meta-badge">
              <GraduationCap size={12} />
              <span>[ 02 // ARCHITECTURAL FOUNDATION ]</span>
            </div>

            <p className="cinematic-intro-section-desc">
              Bridging foundational computer science theory with high-performance production engineering. Every digital system is designed for resilience, clean data flow, and long-term maintainability.
            </p>

            <div className="cinematic-intro-about-grid">
              <div className="cinematic-intro-about-card">
                <h3 className="cinematic-intro-about-card-title">
                  <GraduationCap size={16} color="#ef4444" />
                  <span>Academic Grounding</span>
                </h3>
                <p className="cinematic-intro-about-card-text">
                  <strong>Veer Narmad South Gujarat University</strong><br />
                  B.Sc. in Computer Science (2023–2026, CGPA: 6.64). Core study across Data Structures, Relational DBMS, Object-Oriented Design, and Software Engineering.
                </p>
              </div>

              <div className="cinematic-intro-about-card">
                <h3 className="cinematic-intro-about-card-title">
                  <Code2 size={16} color="#ef4444" />
                  <span>Engineering Philosophy</span>
                </h3>
                <p className="cinematic-intro-about-card-text">
                  Prioritizing modular component architecture, relational integrity, and verified cross-browser stability over superficial decorative fragility.
                </p>
              </div>
            </div>

            <div className="cinematic-intro-cta-group">
              <button 
                onClick={() => jumpToScene(2)}
                className="cinematic-intro-btn-secondary"
              >
                <span>Continue to Systems &amp; Skills</span>
                <ChevronDown size={15} />
              </button>
              <Link to="/about" className="cinematic-intro-hud-link" style={{ color: '#ef4444' }}>
                Full Biography &amp; Education →
              </Link>
            </div>
          </div>
        </section>

        {/* CHAPTER 03: EXPERTISE & EXPERIENCE */}
        <section 
          className="cinematic-intro-panel"
          style={getPanelStyle(2, currentProgress)}
          aria-label="Chapter 03: Production Systems & Skills"
        >
          <div className="cinematic-intro-card-dock">
            <div className="cinematic-intro-meta-badge">
              <Layers size={12} />
              <span>[ 03 // PRODUCTION CAPABILITIES ]</span>
            </div>

            <p className="cinematic-intro-section-desc">
              Delivering commercial web applications and robust data pipelines for real clients and users.
            </p>

            <div className="cinematic-intro-two-col">
              {/* Professional Role */}
              <div>
                <h3 className="cinematic-intro-col-title">
                  <Briefcase size={15} color="#ef4444" />
                  <span>Commercial Experience</span>
                </h3>
                {experienceData.map((exp) => (
                  <div key={exp.id} className="cinematic-intro-timeline-box">
                    <div className="cinematic-intro-timeline-role">{exp.role}</div>
                    <div className="cinematic-intro-timeline-org">{exp.company} — {exp.location}</div>
                    <div className="cinematic-intro-timeline-meta">{exp.duration} // {exp.type}</div>
                    <p className="cinematic-intro-timeline-desc">
                      Developing responsive React web applications, custom PHP backends, and WordPress client systems. Collaborating on UI design, database optimization, and stability fixes.
                    </p>
                    <div className="cinematic-intro-tags-list" style={{ marginTop: '0.5rem' }}>
                      {exp.technologies.map((tech) => (
                        <span key={tech} className="cinematic-intro-tag">{tech}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Technical Stack */}
              <div>
                <h3 className="cinematic-intro-col-title">
                  <Cpu size={15} color="#ef4444" />
                  <span>Verified Core Stack</span>
                </h3>
                <div className="cinematic-intro-skills-cluster">
                  <div className="cinematic-intro-skill-group">
                    <div className="cinematic-intro-skill-label">Frontend Architecture</div>
                    <div className="cinematic-intro-tags-list">
                      <span className="cinematic-intro-tag">React.js</span>
                      <span className="cinematic-intro-tag">Vite</span>
                      <span className="cinematic-intro-tag">JavaScript (ES6+)</span>
                      <span className="cinematic-intro-tag">HTML5 / CSS3</span>
                      <span className="cinematic-intro-tag">Next.js</span>
                    </div>
                  </div>

                  <div className="cinematic-intro-skill-group">
                    <div className="cinematic-intro-skill-label">Backend &amp; Databases</div>
                    <div className="cinematic-intro-tags-list">
                      <span className="cinematic-intro-tag">PHP</span>
                      <span className="cinematic-intro-tag">Python</span>
                      <span className="cinematic-intro-tag">MySQL</span>
                      <span className="cinematic-intro-tag">Node.js</span>
                      <span className="cinematic-intro-tag">Tkinter GUI</span>
                    </div>
                  </div>

                  <div className="cinematic-intro-skill-group">
                    <div className="cinematic-intro-skill-label">Tooling &amp; Data Analysis</div>
                    <div className="cinematic-intro-tags-list">
                      <span className="cinematic-intro-tag">Git / GitHub</span>
                      <span className="cinematic-intro-tag">WordPress</span>
                      <span className="cinematic-intro-tag">Pandas</span>
                      <span className="cinematic-intro-tag">Scikit-Learn</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="cinematic-intro-cta-group">
              <button 
                onClick={() => jumpToScene(3)}
                className="cinematic-intro-btn-secondary"
              >
                <span>Proceed to Inquiry</span>
                <ChevronDown size={15} />
              </button>
              <Link to="/skills" className="cinematic-intro-hud-link" style={{ color: '#ef4444' }}>
                Full Skills Matrix →
              </Link>
            </div>
          </div>
        </section>

        {/* CHAPTER 04: SANCTUARY & INQUIRY */}
        <section 
          className="cinematic-intro-panel"
          style={getPanelStyle(3, currentProgress)}
          aria-label="Chapter 04: Sanctuary & Inquiry"
        >
          <div className="cinematic-intro-card-dock">
            <div className="cinematic-intro-meta-badge">
              <Mail size={12} />
              <span>[ 04 // SANCTUARY &amp; INQUIRY ]</span>
            </div>

            <div className="cinematic-intro-gate-box">
              <p className="cinematic-intro-section-desc" style={{ marginBottom: '1rem' }}>
                Available for full-stack engineering roles, client web development, and custom software systems. Reach out directly through any verified channel.
              </p>

              <div className="cinematic-intro-contact-list">
                <a href={`mailto:${personalData.email}`} className="cinematic-intro-contact-row">
                  <div className="cinematic-intro-contact-icon">
                    <Mail size={15} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-mono)' }}>DIRECT EMAIL</div>
                    <div style={{ fontWeight: 600 }}>{personalData.email}</div>
                  </div>
                </a>

                <a href={`tel:${personalData.phone.replace(/[^0-9+]/g, '')}`} className="cinematic-intro-contact-row">
                  <div className="cinematic-intro-contact-icon">
                    <Phone size={15} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-mono)' }}>DIRECT PHONE</div>
                    <div style={{ fontWeight: 600 }}>{personalData.phone}</div>
                  </div>
                </a>

                <div className="cinematic-intro-contact-row">
                  <div className="cinematic-intro-contact-icon">
                    <MapPin size={15} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.45)', fontFamily: 'var(--font-mono)' }}>PRIMARY LOCATION</div>
                    <div style={{ fontWeight: 600 }}>{personalData.location} [ 21.17° N, 72.83° E ]</div>
                  </div>
                </div>
              </div>

              <div className="cinematic-intro-cta-group">
                <Link to="/" className="cinematic-intro-btn-primary">
                  <span>Enter Full Portfolio</span>
                  <ArrowRight size={15} />
                </Link>
                <Link to="/contact" className="cinematic-intro-btn-secondary">
                  <span>Send Direct Message</span>
                </Link>
                <button 
                  onClick={() => jumpToScene(0)}
                  className="cinematic-intro-btn-secondary"
                  title="Seamless Loop back to Chapter 01"
                >
                  <RotateCcw size={14} />
                  <span>Loop to Beginning</span>
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* 5. BOTTOM SCROLL CUE (Visible during Chapter 01 after hero reveal and when UI is not hidden) */}
      {currentProgress < 0.14 && !isUiHidden && isHeroRevealed && (
        <div className="cinematic-intro-scroll-cue">
          <div className="cinematic-intro-scroll-indicator">
            <div className="cinematic-intro-scroll-dot" />
          </div>
          <span>Scroll to travel through 3D world</span>
        </div>
      )}

      {/* 6. 500vh SCROLL DRIVER TRACK (Placed cleanly at end of DOM without displacing fixed stage) */}
      <div className="cinematic-intro-scroll-track" aria-hidden="true" />

      {/* 7. BESPOKE CINEMATIC POINTER FOLLOWER ("pointer pe ek add karo jo pointer ko follow kare") */}
      <div ref={pointerDotRef} className="cinematic-cursor-dot" aria-hidden="true" />
      <div ref={pointerRingRef} className="cinematic-cursor-ring" aria-hidden="true">
        <div className="cinematic-cursor-bracket tl" />
        <div className="cinematic-cursor-bracket tr" />
        <div className="cinematic-cursor-bracket bl" />
        <div className="cinematic-cursor-bracket br" />
      </div>
    </div>
  );
}
