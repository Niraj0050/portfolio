import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import ScrollToTop from './components/UI/ScrollToTop';
import AmbientCanvas from './components/Three/AmbientCanvas';
import GlobalCursorFollower from './components/UI/GlobalCursorFollower';

import Home from './pages/Home';
import About from './pages/About';
import Projects from './pages/Projects';
import Skills from './pages/Skills';
import Contact from './pages/Contact';
import Intro from './pages/Intro';

function AppContent({ theme, toggleTheme }) {
  const location = useLocation();
  const isIntro = location.pathname === '/intro' || location.pathname === '/experience';

  // For the standalone 3D Intro page, render the standalone layout without standard Navbar/Footer/AmbientCanvas
  if (isIntro) {
    return (
      <>
        <ScrollToTop />
        <Routes>
          <Route path="/intro" element={<Intro />} />
          <Route path="/experience" element={<Intro />} />
        </Routes>
      </>
    );
  }

  // For all existing portfolio pages, render the complete original layout unchanged
  return (
    <>
      <ScrollToTop />
      {/* 3D Ambient Particle Background Canvas */}
      <AmbientCanvas />
      {/* Global Interactive Laser Pointer Follower & Trailing Ribbon */}
      <GlobalCursorFollower />

      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', zIndex: 1 }}>
        <Navbar theme={theme} toggleTheme={toggleTheme} />
        
        <main style={{ flex: 1 }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/intro" element={<Intro />} />
            <Route path="/experience" element={<Intro />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  return (
    <Router>
      <AppContent theme={theme} toggleTheme={toggleTheme} />
    </Router>
  );
}
