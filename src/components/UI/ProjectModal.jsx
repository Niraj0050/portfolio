import React from 'react';
import { X, ExternalLink, Github, CheckCircle2 } from 'lucide-react';

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
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)',
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
          maxWidth: '680px',
          maxHeight: '90vh',
          overflowY: 'auto',
          padding: '2rem',
          position: 'relative',
          background: 'var(--bg-secondary)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            padding: '0.5rem',
            borderRadius: '50%',
            background: 'var(--bg-primary)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        {/* Modal Header */}
        <div style={{ marginBottom: '1.5rem' }}>
          <span className="tech-tag" style={{ marginBottom: '0.75rem', background: 'var(--accent-glow)', color: 'var(--accent-primary)', borderColor: 'var(--border-accent)' }}>
            {project.category}
          </span>
          <h3 style={{ fontSize: '1.75rem', marginTop: '0.25rem', marginBottom: '0.75rem' }}>
            {project.title}
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {project.tags.map((tag) => (
              <span key={tag} className="tech-tag">{tag}</span>
            ))}
          </div>
        </div>

        {/* Project Description */}
        <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--accent-secondary)' }}>Overview</h4>
          <p style={{ color: 'var(--text-secondary)', lineHeight: '1.7', fontSize: '0.95rem' }}>
            {project.fullDesc}
          </p>
        </div>

        {/* Key Features List */}
        {project.features && (
          <div style={{ marginBottom: '2rem' }}>
            <h4 style={{ fontSize: '1.1rem', marginBottom: '0.75rem', color: 'var(--accent-secondary)' }}>Key Implementation Features</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {project.features.map((feat, idx) => (
                <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                  <CheckCircle2 size={16} color="var(--accent-primary)" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {project.github && (
            <a
              href={project.github}
              target="_blank"
              rel="noreferrer"
              className="btn btn-outline"
              style={{ flex: 1 }}
            >
              <Github size={18} />
              <span>View Source Code</span>
            </a>
          )}
          {project.demo && project.demo !== '#' && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="btn btn-primary"
              style={{ flex: 1 }}
            >
              <ExternalLink size={18} />
              <span>Live Application</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
