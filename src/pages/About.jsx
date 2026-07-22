import React from 'react';
import { GraduationCap, Briefcase, Award, Users, Brain, MessageSquare, Clock, Zap, CheckCircle2 } from 'lucide-react';
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
        <div style={{ marginBottom: '5rem' }}>
          <SectionHeader
            badge="About Me"
            title="Passionate Full Stack Developer"
            subtitle="Bridging software engineering concepts with practical full-stack web application development."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            <div className="glass-card" style={{ padding: '2.5rem' }}>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--accent-primary)' }}>
                Professional Profile & Goal
              </h3>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1rem', marginBottom: '1.25rem' }}>
                {personalData.summary}
              </p>
              <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1rem' }}>
                My development workflow emphasizes write-ability, clean architectural code, responsive UI elements, and seamless database connectivity. I continuously refine my skills by exploring new frameworks like Next.js and Node.js alongside established stacks like PHP and MySQL.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div className="glass-card" style={{ padding: '1.75rem', textAlign: 'center' }}>
                <h4 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-primary)', marginBottom: '0.25rem' }}>2026</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>B.Sc. CS Graduation Year</p>
              </div>
              <div className="glass-card" style={{ padding: '1.75rem', textAlign: 'center' }}>
                <h4 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--accent-secondary)', marginBottom: '0.25rem' }}>3+</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Full Stack Projects Built</p>
              </div>
              <div className="glass-card" style={{ padding: '1.75rem', textAlign: 'center' }}>
                <h4 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#f59e0b', marginBottom: '0.25rem' }}>8+</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Languages & Tools</p>
              </div>
              <div className="glass-card" style={{ padding: '1.75rem', textAlign: 'center' }}>
                <h4 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981', marginBottom: '0.25rem' }}>100%</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Commitment & Passion</p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 2: ACADEMIC EDUCATION TIMELINE */}
        <div style={{ marginBottom: '5rem' }}>
          <SectionHeader
            badge="Education"
            title="Academic Background"
            subtitle="Foundation in Computer Science and secondary education in Gujarat."
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '850px', margin: '0 auto' }}>
            {educationData.map((edu) => (
              <div key={edu.id} className="glass-card" style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-glow)', border: '1px solid var(--border-accent)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <GraduationCap size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.25rem' }}>{edu.degree}</h3>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--accent-primary)', background: 'var(--bg-secondary)', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
                      {edu.duration}
                    </span>
                  </div>
                  <h4 style={{ fontSize: '1rem', color: 'var(--text-secondary)', fontWeight: 500, marginBottom: '0.5rem' }}>
                    {edu.institution} — <span style={{ color: 'var(--text-muted)' }}>{edu.location}</span>
                  </h4>
                  <p style={{ color: 'var(--accent-secondary)', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.75rem' }}>
                    {edu.grade}
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: '1.6' }}>
                    {edu.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: WORK EXPERIENCE TIMELINE */}
        <div style={{ marginBottom: '5rem' }}>
          <SectionHeader
            badge="Experience"
            title="Work & Internship Experience"
            subtitle="Hands-on full-stack development experience working on real-world client web applications."
          />

          <div style={{ maxWidth: '850px', margin: '0 auto' }}>
            {experienceData.map((exp) => (
              <div key={exp.id} className="glass-card" style={{ padding: '2.25rem', borderLeft: '4px solid var(--accent-primary)' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', marginBottom: '0.2rem' }}>{exp.role}</h3>
                    <h4 style={{ fontSize: '1rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>
                      {exp.company} — <span style={{ color: 'var(--text-secondary)' }}>{exp.location}</span>
                    </h4>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', background: 'var(--bg-secondary)', padding: '0.3rem 0.85rem', borderRadius: 'var(--radius-full)', border: '1px solid var(--border-color)' }}>
                      {exp.duration}
                    </span>
                  </div>
                </div>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.25rem', marginBottom: '1.5rem' }}>
                  {exp.bulletPoints.map((bullet, idx) => (
                    <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                      <CheckCircle2 size={18} color="var(--accent-primary)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                  {exp.technologies.map((tech) => (
                    <span key={tech} className="tech-tag" style={{ background: 'var(--bg-secondary)' }}>
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
            badge="Soft Skills"
            title="Collaborative Strengths"
            subtitle="Key interpersonal and problem-solving qualities essential for agile software teams."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            {skillsData.softSkills.map((skill) => (
              <div key={skill.name} className="glass-card" style={{ padding: '1.75rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-glow)', border: '1px solid var(--border-accent)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
                  {getIcon(skill.icon)}
                </div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 600 }}>{skill.name}</h4>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
