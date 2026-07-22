import React from 'react';
import { Code2, Server, Database, Wrench, Package, Cpu } from 'lucide-react';
import SectionHeader from '../components/UI/SectionHeader';
import { skillsData } from '../data/portfolioData';

export default function Skills() {
  return (
    <div className="animate-fade-in section">
      <div className="container">
        
        {/* SECTION 1: CATEGORIZED TECHNICAL SKILLS MATRIX */}
        <SectionHeader
          badge="Tech Stack"
          title="Technical Skills & Proficiencies"
          subtitle="Comprehensive overview of programming languages, web frameworks, databases, and developer tooling."
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '5rem' }}>
          
          {/* Programming Languages */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'rgba(99, 102, 241, 0.15)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Code2 size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>Languages</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Core Development</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {skillsData.languages.map((lang) => (
                <div key={lang.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.9rem', fontWeight: 600 }}>
                    <span>{lang.name}</span>
                    <span style={{ color: 'var(--accent-primary)' }}>{lang.level}%</span>
                  </div>
                  <div style={{ width: '100%', height: '7px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ width: `${lang.level}%`, height: '100%', background: 'var(--accent-gradient)', borderRadius: 'var(--radius-full)' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Frameworks & Web Tech */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'rgba(6, 182, 212, 0.15)', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Server size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>Frameworks & Web</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Frontend & Backend</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {skillsData.frameworks.map((fw) => (
                <div key={fw.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.9rem', fontWeight: 600 }}>
                    <span>{fw.name}</span>
                    <span style={{ color: 'var(--accent-secondary)' }}>{fw.level}%</span>
                  </div>
                  <div style={{ width: '100%', height: '7px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ width: `${fw.level}%`, height: '100%', background: 'linear-gradient(90deg, #06b6d4, #3b82f6)', borderRadius: 'var(--radius-full)' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Databases */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Database size={20} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem' }}>Databases</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Relational & NoSQL</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              {skillsData.databases.map((db) => (
                <div key={db.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.9rem', fontWeight: 600 }}>
                    <span>{db.name}</span>
                    <span style={{ color: '#f59e0b' }}>{db.level}%</span>
                  </div>
                  <div style={{ width: '100%', height: '7px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                    <div style={{ width: `${db.level}%`, height: '100%', background: 'linear-gradient(90deg, #f59e0b, #ef4444)', borderRadius: 'var(--radius-full)' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* SECTION 2 & 3: TOOLS, LIBRARIES & WORKFLOW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem' }}>
          
          {/* Developer Tools */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <Wrench size={22} color="var(--accent-primary)" />
              <h3 style={{ fontSize: '1.25rem' }}>Developer Tools</h3>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
              {skillsData.tools.map((tool) => (
                <span key={tool} className="tech-tag" style={{ padding: '0.4rem 1rem', fontSize: '0.88rem' }}>
                  {tool}
                </span>
              ))}
            </div>
          </div>

          {/* Python & React Libraries */}
          <div className="glass-card" style={{ padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.25rem' }}>
              <Package size={22} color="var(--accent-secondary)" />
              <h3 style={{ fontSize: '1.25rem' }}>Libraries & Packages</h3>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem' }}>
              {skillsData.libraries.map((lib) => (
                <span key={lib} className="tech-tag" style={{ padding: '0.4rem 1rem', fontSize: '0.88rem' }}>
                  {lib}
                </span>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
