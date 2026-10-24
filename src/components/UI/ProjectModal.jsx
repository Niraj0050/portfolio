import React from 'react';
import { X, ExternalLink, Github, CheckCircle2, Sparkles, Layers } from 'lucide-react';

export default function ProjectModal({ project, onClose }) {
  if (!project) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 2000,
        background: 'rgba(5, 7, 10, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
      onClick={onClose}
    >
      <div
        className="glass-card"
        style={{
          width: '100%',
          maxWidth: '720px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2.5rem',
          position: 'relative',
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-accent)',
          borderRadius: 'var(--radius-lg)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(255, 107, 0, 0.15)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          aria-label="Close Case Study"
          style={{
            position: 'absolute',
            top: '1.5rem',
            right: '1.5rem',
            padding: '0.6rem',
            borderRadius: '50%',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            transition: 'var(--transition-fast)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-orange)';
            e.currentTarget.style.color = 'var(--accent-orange)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-color)';
            e.currentTarget.style.color = 'var(--text-primary)';
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
            <span 
              className="tech-tag" 
              style={{ 
                background: 'rgba(255, 107, 0, 0.12)', 
                color: 'var(--accent-orange)', 
                borderColor: 'var(--border-accent)', 
                fontWeight: 600 
              }}
            >
              {project.category}
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Verified Architecture</span>
          </div>

          <h3 style={{ fontSize: '2rem', marginBottom: '1rem', lineHeight: '1.2' }}>
            {project.title}
          </h3>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {project.tags.map((tag) => (
              <span key={tag} className="tech-tag" style={{ fontSize: '0.8rem' }}>{tag}</span>
            ))}
          </div>
        </div>

        {/* Project Description */}
        <div style={{ marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.75rem' }}>
          <h4 style={{ fontSize: '1.15rem', marginBottom: '0.65rem', color: 'var(--accent-orange)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Layers size={18} />
            <span>Architecture & System Overview</span>
          </h4>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '0.98rem' }}>
            {project.fullDesc}
          </p>
        </div>

        {/* Key Features List */}
        {project.features && (
          <div style={{ marginBottom: '2.5rem' }}>
            <h4 style={{ fontSize: '1.15rem', marginBottom: '1rem', color: 'var(--accent-amber)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Sparkles size={18} />
              <span>Core Engineering Implementations</span>
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {project.features.map((feat, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                  <CheckCircle2 size={18} color="var(--accent-orange)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-color)', paddingTop: '1.75rem' }}>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
              style={{ flex: 1, padding: '0.85rem' }}
            >
              <Github size={18} />
              <span>Inspect GitHub Repository</span>
            </a>
          )}
          {project.demo && project.demo !== '#' && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
              style={{ flex: 1, padding: '0.85rem' }}
            >
              <ExternalLink size={18} />
              <span>Launch Live Project</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
