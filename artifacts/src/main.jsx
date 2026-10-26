import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { createUniverse } from './universe.js';
import './style.css';
import './scene.css';
import './story.css';

function App() {
  const host = useRef(null);
  const experience = useRef(null);
  const universe = useRef(null);
  const [status, setStatus] = useState('Gathering particles');
  const [error, setError] = useState(false);
  const [aboutVisible,setAboutVisible]=useState(false);
  const [projectsVisible,setProjectsVisible]=useState(false);
  const [skillsVisible,setSkillsVisible]=useState(false);
  const [journeyVisible,setJourneyVisible]=useState(false);
  const [contactVisible,setContactVisible]=useState(false);
  const [activeProject,setActiveProject]=useState(0);
  const [introDisabled,setIntroDisabled]=useState(false);
  useEffect(() => {
    const paintProgress=(p)=>{
      const smooth=(a,b)=>{const t=Math.max(0,Math.min(1,(p-a)/(b-a)));return t*t*(3-2*t);};
      const about=smooth(.12,.17)*(1-smooth(.27,.3));
      // Projects chapter is temporarily hidden; keep its implementation below for a later restore.
      const projects=0;
      const skills=smooth(.29,.32)*(1-smooth(.5,.53));
      const journey=smooth(.51,.54)*(1-smooth(.73,.76));
      const contact=smooth(.74,.78);
      experience.current.style.setProperty('--intro-opacity',1-smooth(.01,.1));
      experience.current.style.setProperty('--about-opacity',about);
      experience.current.style.setProperty('--projects-opacity',projects);
      experience.current.style.setProperty('--skills-opacity',skills);
      experience.current.style.setProperty('--journey-opacity',journey);
      experience.current.style.setProperty('--contact-opacity',contact);
      experience.current.style.setProperty('--about-offset',`${(1-about)*20}px`);
      experience.current.style.setProperty('--story-progress',p);
      setAboutVisible(p>.12&&p<.3);setProjectsVisible(false);setSkillsVisible(p>.29&&p<.53);setJourneyVisible(p>.51&&p<.76);setContactVisible(p>.74);setActiveProject(0);setIntroDisabled(p>.1);
    };
    try { universe.current = createUniverse(host.current, setStatus,paintProgress); }
    catch (e) { console.error(e); setError(true); }
    const scroll=()=>{
      const distance=experience.current.offsetHeight-window.innerHeight;
      const p=Math.max(0,Math.min(1,window.scrollY/Math.max(1,distance)));
      if(universe.current)universe.current.setScrollProgress(p);else paintProgress(p);
    };
    window.addEventListener('scroll',scroll,{passive:true});window.addEventListener('resize',scroll);scroll();
    return () => {window.removeEventListener('scroll',scroll);window.removeEventListener('resize',scroll);universe.current?.dispose();};
  }, []);
  const scrollToProgress=(progress)=>window.scrollTo({top:(experience.current.offsetHeight-window.innerHeight)*progress,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  const showAbout=()=>scrollToProgress(.2);
  // const showProjects=()=>scrollToProgress(.34); // Temporarily hidden.
  const showSkills=()=>scrollToProgress(.38);
  const showJourney=()=>scrollToProgress(.61);
  const showContact=()=>scrollToProgress(.84);
  const backToSpace=()=>window.scrollTo({top:0,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  return <main ref={experience} className={`experience${introDisabled?' intro-disabled':''}${error?' has-render-error':''}`}>
    <div className="stage">
    <div ref={host} className="universe" aria-label="Scroll to transform an electric universe into Niraj Kumar's introduction" />
    <header><button className="brand" onClick={backToSpace} aria-label="Return to the universe"><span className="brand-mark">✳</span> AETHER</button><span className="live"><i />{contactVisible?'05 / OPEN CHANNEL':journeyVisible?'04 / JOURNEY':skillsVisible?'03 / SKILLS':projectsVisible?`${String(activeProject+3).padStart(2,'0')} / PROJECT ${String(activeProject+1).padStart(2,'0')}`:aboutVisible?'02 / ABOUT ME':'01 / THE UNIVERSE'}</span></header>
    <h1 className="sr-only">Niraj Kumar — Full Stack Web Developer</h1>
    {error && <div role="alert" className="error">This experience needs WebGL. Please enable hardware acceleration and reload.</div>}
    <footer className="universe-controls" aria-hidden={introDisabled}><div className="status" role="status"><i />{status}</div><div className="instructions"><span>HOVER TO CONNECT</span><span>CLICK / TAP TO RELEASE</span></div><button disabled={introDisabled} onClick={() => universe.current?.replay()} aria-label="Replay sphere formation">↻ <span>REPLAY</span></button></footer>
    <button className="keyboard-pulse" disabled={introDisabled} aria-hidden={introDisabled} onClick={() => universe.current?.pulse()}>Release energy <span>↗</span></button>
    <button className="scroll-invitation" disabled={introDisabled} aria-hidden={introDisabled} onClick={showAbout}>SCROLL TO DISCOVER ME <span>↓</span></button>
    <div className="chapter-line" aria-hidden="true"><span /></div>
    <section className={`${error?'about-panel':'about-accessibility sr-only'}${aboutVisible?' is-visible':''}`} aria-hidden={!aboutVisible} aria-labelledby="about-role">
      <p className="fallback-name">NIRAJ KUMAR</p>
      <p className="about-kicker">THE PERSON BEHIND THE PARTICLES</p>
      <h2 id="about-role">Full Stack Web Developer</h2>
      <p className="about-description">I build modern web experiences—from responsive interfaces to robust backend systems.</p>
      <ul className="skill-list" aria-label="Core technologies">{['React','PHP','JavaScript','Python','MySQL'].map(skill=><li key={skill}>{skill}</li>)}</ul>
    </section>
    <div className={`about-bottom${aboutVisible?' is-visible':''}`} aria-hidden={!aboutVisible}>
      <span>BASED IN GUJARAT, INDIA</span>
      <button tabIndex={aboutVisible?0:-1} onClick={backToSpace}>↑ BACK TO THE UNIVERSE</button>
      <button tabIndex={aboutVisible?0:-1} onClick={showSkills}>EXPLORE MY SKILLS ↓</button>
    </div>
    {/* Projects chapter temporarily hidden. Keep this block for a later restore.
    <section className="project-accessibility sr-only" aria-hidden={!projectsVisible}>
      <h2>Selected projects</h2>
      <ul><li>Machine Learning Project — Python, Pandas and NumPy</li><li>Student Management System — Python, Tkinter and MySQL</li><li>Portfolio Website — React, Three.js and WebGL</li></ul>
    </section>
    */}
    <section className={`story-panel skills-panel${skillsVisible?' is-visible':''}`} aria-hidden={!skillsVisible}>
      <div className="section-heading"><p>03 / VERIFIED COMPETENCIES</p><h2>Four systems. One connected stack.</h2><span>Every cluster is formed by the same particles that powered the universe.</span></div>
      <div className="skill-clusters" aria-label="Technical skills">
        <article><b>01</b><h3>Frontend</h3><p>React · JavaScript · HTML5 · CSS3</p></article>
        <article><b>02</b><h3>3D & Motion</h3><p>Three.js · WebGL · Interactive UI</p></article>
        <article><b>03</b><h3>Backend</h3><p>PHP · Node.js · REST APIs · MySQL</p></article>
        <article><b>04</b><h3>Data & Systems</h3><p>Python · Pandas · Scikit-Learn · Tkinter</p></article>
      </div>
      <button className="chapter-next" tabIndex={skillsVisible?0:-1} onClick={showJourney}>FOLLOW THE JOURNEY ↓</button>
    </section>
    <section className={`story-panel journey-panel${journeyVisible?' is-visible':''}`} aria-hidden={!journeyVisible}>
      <div className="section-heading"><p>04 / SIGNAL HISTORY</p><h2>Learning by building.</h2><span>A journey from core programming to real-time browser experiences.</span></div>
      <ol className="journey-track">
        <li><b>FOUNDATION</b><strong>Computer Science</strong><span>Programming, data structures and relational thinking.</span></li>
        <li><b>SYSTEMS</b><strong>Python + MySQL</strong><span>Desktop applications and structured data workflows.</span></li>
        <li><b>WEB</b><strong>Full-Stack Development</strong><span>Responsive React interfaces and backend services.</span></li>
        <li><b>NOW</b><strong>Immersive WebGL</strong><span>Particle systems, 3D interaction and motion design.</span></li>
      </ol>
      <button className="chapter-next" tabIndex={journeyVisible?0:-1} onClick={showContact}>OPEN A CHANNEL ↓</button>
    </section>
    <section className={`story-panel contact-panel${contactVisible?' is-visible':''}`} aria-hidden={!contactVisible}>
      <div className="contact-copy"><p>05 / TRANSMISSION READY</p><h2>Let’s build something exceptional.</h2><span>Available for full-stack developer opportunities, internships and ambitious collaborations.</span></div>
      <nav className="contact-links" aria-label="Contact Niraj Kumar">
        <a tabIndex={contactVisible?0:-1} href="mailto:nirajkumar851127@gmail.com">EMAIL <i>↗</i></a>
        <a tabIndex={contactVisible?0:-1} href="https://github.com/niraj0050" target="_blank" rel="noreferrer">GITHUB <i>↗</i></a>
        <a tabIndex={contactVisible?0:-1} href="https://linkedin.com/in/niraj0050" target="_blank" rel="noreferrer">LINKEDIN <i>↗</i></a>
      </nav>
      <p className="contact-location">SURAT / VAPI / VALSAD · GUJARAT, INDIA</p>
      <button className="chapter-next" tabIndex={contactVisible?0:-1} onClick={backToSpace}>REPLAY THE UNIVERSE ↑</button>
    </section>
    </div>
  </main>;
}
createRoot(document.getElementById('root')).render(<App />);
