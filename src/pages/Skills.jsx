import React, { useState } from 'react';
import { Code2, Server, Database, Wrench, Package, Cpu, GitBranch, Terminal, ShieldCheck, Sparkles } from 'lucide-react';
import SectionHeader from '../components/UI/SectionHeader';
import { skillsData } from '../data/portfolioData';

export default function Skills() {
  const [activeTab, setActiveTab] = useState('All');

  const skillTabs = ['All', 'Languages', 'Frameworks', 'Databases', 'Tools & Libraries'];

  return (
    <div className="animate-fade-in section">
      <div className="container">
        
        {/* SECTION 1: CATEGORIZED TECHNICAL SKILLS MATRIX */}
        <SectionHeader
          badge="Technical Arsenal"
          title="Skills, Stacks & Proficiencies"
          subtitle="A structured overview of core programming languages, modern web frameworks, relational database engines, and developer tooling."
        />

        {/* Tab Controls */}
        <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '0.85rem', marginBottom: '4rem' }}>
          {skillTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '0.65rem 1.5rem',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: '0.9rem',
                transition: 'var(--transition-fast)',
                background: activeTab === tab ? 'var(--accent-gradient)' : 'var(--bg-card)',
                color: activeTab === tab ? '#07080c' : 'var(--text-secondary)',
                border: activeTab === tab ? 'none' : '1px solid var(--border-color)',
                boxShadow: activeTab === tab ? '0 4px 20px var(--accent-glow)' : 'none',
                cursor: 'pointer'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem', marginBottom: '5rem' }}>
          
          {/* Programming Languages */}
          {(activeTab === 'All' || activeTab === 'Languages') && (
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: 'var(--radius-sm)', background: 'rgba(255, 107, 0, 0.12)', border: '1px solid var(--border-accent)', color: 'var(--accent-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Code2 size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.35rem' }}>Languages</h3>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Foundational & Systems</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {skillsData.languages.map((lang) => (
                  <div key={lang.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem', fontSize: '0.94rem', fontWeight: 600 }}>
                      <span>{lang.name}</span>
                      <span style={{ color: 'var(--accent-orange)' }}>{lang.level}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${lang.level}%`, 
                          height: '100%', 
                          background: 'linear-gradient(90deg, #ff6b00, #f59e0b)', 
                          borderRadius: 'var(--radius-full)',
                          boxShadow: '0 0 10px rgba(255, 107, 0, 0.4)'
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Frameworks & Web Tech */}
          {(activeTab === 'All' || activeTab === 'Frameworks') && (
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: 'var(--radius-sm)', background: 'rgba(0, 229, 255, 0.12)', border: '1px solid var(--border-accent-cyan)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Server size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.35rem' }}>Frameworks & Web</h3>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Frontend & Backend Platforms</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {skillsData.frameworks.map((fw) => (
                  <div key={fw.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem', fontSize: '0.94rem', fontWeight: 600 }}>
                      <span>{fw.name}</span>
                      <span style={{ color: 'var(--accent-cyan)' }}>{fw.level}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${fw.level}%`, 
                          height: '100%', 
                          background: 'linear-gradient(90deg, #00e5ff, #3b82f6)', 
                          borderRadius: 'var(--radius-full)',
                          boxShadow: '0 0 10px rgba(0, 229, 255, 0.4)'
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Databases */}
          {(activeTab === 'All' || activeTab === 'Databases') && (
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.25rem' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: 'var(--radius-sm)', background: 'rgba(245, 158, 11, 0.12)', border: '1px solid rgba(245, 158, 11, 0.35)', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Database size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.35rem' }}>Databases</h3>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Relational & Storage Engines</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {skillsData.databases.map((db) => (
                  <div key={db.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.45rem', fontSize: '0.94rem', fontWeight: 600 }}>
                      <span>{db.name}</span>
                      <span style={{ color: 'var(--accent-amber)' }}>{db.level}%</span>
                    </div>
                    <div style={{ width: '100%', height: '8px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div 
                        style={{ 
                          width: `${db.level}%`, 
                          height: '100%', 
                          background: 'linear-gradient(90deg, #f59e0b, #ea580c)', 
                          borderRadius: 'var(--radius-full)',
                          boxShadow: '0 0 10px rgba(245, 158, 11, 0.4)'
                        }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* SECTION 2 & 3: TOOLS, LIBRARIES & WORKFLOW */}
        {(activeTab === 'All' || activeTab === 'Tools & Libraries') && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', marginBottom: '4rem' }}>
            
            {/* Developer Tools */}
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.5rem' }}>
                <Wrench size={24} color="var(--accent-orange)" />
                <h3 style={{ fontSize: '1.35rem' }}>Developer Tools & Environments</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                Industry-standard version control, code editors, and local runtime tooling.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {skillsData.tools.map((tool) => (
                  <span key={tool} className="tech-tag" style={{ padding: '0.5rem 1.15rem', fontSize: '0.9rem' }}>
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Python & React Packages */}
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '1.5rem' }}>
                <Package size={24} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '1.35rem' }}>Libraries & Utility Packages</h3>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginBottom: '1.5rem' }}>
                Data processing, ML modeling, desktop interfaces, and frontend routing utilities.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                {skillsData.libraries.map((lib) => (
                  <span key={lib} className="tech-tag" style={{ padding: '0.5rem 1.15rem', fontSize: '0.9rem' }}>
                    {lib}
                  </span>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* WORKFLOW PRACTICE HIGHLIGHT */}
        <div 
          className="glass-card" 
          style={{ 
            padding: '3rem 2.5rem', 
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '2rem',
            alignItems: 'center'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255, 107, 0, 0.1)', border: '1px solid var(--border-accent)', color: 'var(--accent-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <GitBranch size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>Git Version Control</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Branching workflows, descriptive commits, merge conflict handling, and pull requests.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(0, 229, 255, 0.1)', border: '1px solid var(--border-accent-cyan)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Terminal size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>Modern Build Tools</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Vite HMR bundling, clean npm dependencies, ES Modules, and production optimization.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
            <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.35)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <ShieldCheck size={22} />
            </div>
            <div>
              <h4 style={{ fontSize: '1.15rem', marginBottom: '0.35rem' }}>Data Integrity & Schema</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Relational foreign key constraints, SQL normalization, sanitization, and structured queries.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
