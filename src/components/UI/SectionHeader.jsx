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
        <h2 style={{ fontSize: '2.25rem', marginBottom: '0.75rem' }}>
          {title}
        </h2>
      )}
      {subtitle && (
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.6' }}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
