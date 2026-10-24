import React from 'react';
import { 
  GraduationCap, 
  Briefcase, 
  Award, 
  Users, 
  Brain, 
  MessageSquare, 
  Clock, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Code2,
  Calendar,
  MapPin,
  Sparkles
} from 'lucide-react';
import SectionHeader from '../components/UI/SectionHeader';
import { personalData, educationData, experienceData, skillsData } from '../data/portfolioData';

export default function About() {
  const getIcon = (iconName) => {
    switch (iconName) {
      case 'Users': return <Users size={22} />;
      case 'Brain': return <Brain size={22} />;
      case 'MessageSquare': return <MessageSquare size={22} />;
      case 'Clock': return <Clock size={22} />;
      case 'Zap': return <Zap size={22} />;
      default: return <Award size={22} />;
    }
  };

  return (
    <div className="animate-fade-in section">
      <div className="container">
        
        {/* SECTION 1: DETAILED PROFESSIONAL BIO */}
        <div style={{ marginBottom: '6rem' }}>
          <SectionHeader
            badge="Developer Profile"
            title="Background & Engineering Focus"
            subtitle="Bridging core computer science fundamentals with modern interactive full-stack web application engineering."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'stretch' }}>
            
            {/* Bio Card */}
            <div className="glass-card" style={{ padding: '3rem 2.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem', color: 'var(--accent-orange)' }}>
                <Sparkles size={18} />
                <span style={{ fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                  Professional Philosophy
                </span>
              </div>

              <h3 style={{ fontSize: '1.85rem', marginBottom: '1.25rem', lineHeight: '1.2' }}>
                Engineering for clarity, responsiveness, and scale.
              </h3>

              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.85', fontSize: '1.02rem', marginBottom: '1.25rem' }}>
                {personalData.summary}
              </p>

              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.85', fontSize: '1.02rem' }}>
                My engineering workflow prioritizes readability, modular design patterns, reliable relational database schemas, 
                and accessible interfaces. I enjoy connecting backend REST APIs and database logic with modern, interactive 
                frontends and real-time graphics.
              </p>
            </div>

            {/* Visual Stats Matrix */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.75rem' }}>
              <div 
                className="glass-card" 
                style={{ 
                  padding: '2.25rem', 
                  textAlign: 'center',
                  border: '1px solid var(--border-accent)',
                  background: 'radial-gradient(circle at top, rgba(255, 107, 0, 0.12) 0%, rgba(13, 16, 24, 0.8) 100%)'
                }}
              >
                <h4 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--accent-orange)', marginBottom: '0.35rem', fontFamily: 'var(--font-heading)' }}>
                  2026
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', fontWeight: 500 }}>B.Sc. CS Graduation</p>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Veer Narmad South Gujarat Univ</span>
              </div>

              <div 
                className="glass-card" 
                style={{ 
                  padding: '2.25rem', 
                  textAlign: 'center',
                  border: '1px solid var(--border-accent-cyan)',
                  background: 'radial-gradient(circle at top, rgba(0, 229, 255, 0.1) 0%, rgba(13, 16, 24, 0.8) 100%)'
                }}
              >
                <h4 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '0.35rem', fontFamily: 'var(--font-heading)' }}>
                  3+
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', fontWeight: 500 }}>Software Systems</p>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Web, Desktop & ML</span>
              </div>

              <div 
                className="glass-card" 
                style={{ 
                  padding: '2.25rem', 
                  textAlign: 'center',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  background: 'radial-gradient(circle at top, rgba(245, 158, 11, 0.1) 0%, rgba(13, 16, 24, 0.8) 100%)'
                }}
              >
                <h4 style={{ fontSize: '2.8rem', fontWeight: 800, color: 'var(--accent-amber)', marginBottom: '0.35rem', fontFamily: 'var(--font-heading)' }}>
                  8+
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', fontWeight: 500 }}>Languages & Tools</p>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>React, PHP, MySQL, Python</span>
              </div>

              <div 
                className="glass-card" 
                style={{ 
                  padding: '2.25rem', 
                  textAlign: 'center',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  background: 'radial-gradient(circle at top, rgba(16, 185, 129, 0.1) 0%, rgba(13, 16, 24, 0.8) 100%)'
                }}
              >
                <h4 style={{ fontSize: '2.8rem', fontWeight: 800, color: '#10b981', marginBottom: '0.35rem', fontFamily: 'var(--font-heading)' }}>
                  100%
                </h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', fontWeight: 500 }}>Dedication</p>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Continuous Learning & Growth</span>
              </div>
            </div>

          </div>
        </div>

        {/* SECTION 2: ACADEMIC EDUCATION TIMELINE */}
        <div style={{ marginBottom: '6rem' }}>
          <SectionHeader
            badge="Academic Foundation"
            title="Education Timeline"
            subtitle="Computer Science foundation and higher secondary education in Gujarat."
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '900px', margin: '0 auto' }}>
            {educationData.map((edu) => (
              <div 
                key={edu.id} 
                className="glass-card" 
                style={{ 
                  padding: '2.5rem', 
                  display: 'flex', 
                  gap: '1.75rem', 
                  alignItems: 'flex-start',
                  borderLeft: '4px solid var(--accent-orange)'
                }}
              >
                <div 
                  style={{ 
                    width: '52px', 
                    height: '52px', 
                    borderRadius: '50%', 
                    background: 'rgba(255, 107, 0, 0.12)', 
                    border: '1px solid var(--border-accent)', 
                    color: 'var(--accent-orange)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    flexShrink: 0 
                  }}
                >
                  <GraduationCap size={26} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.35rem' }}>{edu.degree}</h3>
                    <span 
                      style={{ 
                        fontSize: '0.85rem', 
                        fontWeight: 600, 
                        color: 'var(--accent-orange)', 
                        background: 'rgba(255, 107, 0, 0.1)', 
                        padding: '0.3rem 0.85rem', 
                        borderRadius: 'var(--radius-full)', 
                        border: '1px solid var(--border-accent)' 
                      }}
                    >
                      {edu.duration}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '0.5rem' }}>
                    {edu.institution} — <span style={{ color: 'var(--text-muted)' }}>{edu.location}</span>
                  </h4>

                  <p style={{ color: 'var(--accent-amber)', fontWeight: 600, fontSize: '0.92rem', marginBottom: '0.85rem' }}>
                    {edu.grade}
                  </p>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.7' }}>
                    {edu.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: WORK EXPERIENCE TIMELINE */}
        <div style={{ marginBottom: '6rem' }}>
          <SectionHeader
            badge="Verified Experience"
            title="Work & Internship Experience"
            subtitle="Hands-on full-stack development experience building responsive, client-tailored web applications."
          />

          <div style={{ maxWidth: '900px', margin: '0 auto' }}>
            {experienceData.map((exp) => (
              <div 
                key={exp.id} 
                className="glass-card" 
                style={{ 
                  padding: '2.75rem', 
                  borderLeft: '4px solid var(--accent-cyan)' 
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{exp.role}</h3>
                    <h4 style={{ fontSize: '1.1rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                      {exp.company} — <span style={{ color: 'var(--text-secondary)' }}>{exp.location}</span>
                    </h4>
                  </div>
                  <div>
                    <span 
                      style={{ 
                        fontSize: '0.85rem', 
                        fontWeight: 600, 
                        color: 'var(--text-primary)', 
                        background: 'rgba(0, 229, 255, 0.1)', 
                        padding: '0.35rem 0.95rem', 
                        borderRadius: 'var(--radius-full)', 
                        border: '1px solid var(--border-accent-cyan)' 
                      }}
                    >
                      {exp.duration}
                    </span>
                  </div>
                </div>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '1.5rem', marginBottom: '1.75rem' }}>
                  {exp.bulletPoints.map((bullet, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: '1.7' }}>
                      <CheckCircle2 size={18} color="var(--accent-cyan)" style={{ marginTop: '0.25rem', flexShrink: 0 }} />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.25rem' }}>
                  {exp.technologies.map((tech) => (
                    <span key={tech} className="tech-tag">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 4: CORE SOFT SKILLS */}
        <div>
          <SectionHeader
            badge="Collaborative Strengths"
            title="Interpersonal & Professional Attributes"
            subtitle="Qualities that facilitate agile communication, collaborative software delivery, and problem resolution."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.75rem' }}>
            {skillsData.softSkills.map((skill) => (
              <div 
                key={skill.name} 
                className="glass-card" 
                style={{ 
                  padding: '2.25rem 1.5rem', 
                  textAlign: 'center', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center' 
                }}
              >
                <div 
                  style={{ 
                    width: '52px', 
                    height: '52px', 
                    borderRadius: '50%', 
                    background: 'rgba(255, 107, 0, 0.12)', 
                    border: '1px solid var(--border-accent)', 
                    color: 'var(--accent-orange)', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center', 
                    marginBottom: '1.25rem' 
                  }}
                >
                  {getIcon(skill.icon)}
                </div>
                <h4 style={{ fontSize: '1.1rem', fontWeight: 600 }}>{skill.name}</h4>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
