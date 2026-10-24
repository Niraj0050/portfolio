import React from 'react';

export default function SectionHeader({ badge, title, subtitle, center = true }) {
  return (
    <div className={`section-header ${center ? 'text-center' : ''}`}>
      {badge && (
        <span className="section-badge">
          {badge}
        </span>
      )}
      {title && (
        <h2 
          style={{ 
            fontSize: 'clamp(2rem, 3.8vw, 2.75rem)', 
            marginBottom: '1rem', 
            letterSpacing: '-0.025em',
            lineHeight: '1.2'
          }}
        >
          {title}
        </h2>
      )}
      {subtitle && (
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.08rem', lineHeight: '1.7', maxWidth: '680px', margin: center ? '0 auto' : '0' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
