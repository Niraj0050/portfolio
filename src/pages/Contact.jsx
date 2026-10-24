import React, { useState } from 'react';
import { Mail, Phone, MapPin, Linkedin, Github, Send, CheckCircle2, AlertCircle, Sparkles, Clock, Globe } from 'lucide-react';
import SectionHeader from '../components/UI/SectionHeader';
import { personalData } from '../data/portfolioData';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setError('Please provide your name, valid email, and message content.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Send through web3forms endpoint directly to nirajkumar851127@gmail.com
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          access_key: 'fc0f70b8-1c0e-4cc4-a15f-8a80af40e283',
          name: formData.name,
          email: formData.email,
          subject: formData.subject || 'Portfolio 3D Contact Inquiry',
          message: formData.message,
          to_email: personalData.email
        })
      });

      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in section">
      <div className="container">
        
        <SectionHeader
          badge="Direct Communication"
          title="Let's Connect & Collaborate"
          subtitle="Looking for an ambitious Full Stack Web Developer intern or junior engineer in Gujarat or remote? Reach out today."
        />

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', marginBottom: '4.5rem' }}>
          
          {/* SECTION 1: CONTACT INFORMATION CARDS */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Email Card */}
            <a 
              href={`mailto:${personalData.email}`} 
              className="glass-card" 
              style={{ 
                padding: '1.75rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1.25rem',
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
                <Mail size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                  Email Directly
                </span>
                <h4 style={{ fontSize: '1.1rem', marginTop: '0.2rem', wordBreak: 'break-all' }}>
                  {personalData.email}
                </h4>
              </div>
            </a>

            {/* Phone Card */}
            <a 
              href={`tel:${personalData.phone}`} 
              className="glass-card" 
              style={{ 
                padding: '1.75rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1.25rem',
                borderLeft: '4px solid var(--accent-cyan)' 
              }}
            >
              <div 
                style={{ 
                  width: '52px', 
                  height: '52px', 
                  borderRadius: '50%', 
                  background: 'rgba(0, 229, 255, 0.12)', 
                  border: '1px solid var(--border-accent-cyan)', 
                  color: 'var(--accent-cyan)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  flexShrink: 0 
                }}
              >
                <Phone size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                  Phone / WhatsApp
                </span>
                <h4 style={{ fontSize: '1.1rem', marginTop: '0.2rem' }}>
                  {personalData.phone}
                </h4>
              </div>
            </a>

            {/* Location Card */}
            <div 
              className="glass-card" 
              style={{ 
                padding: '1.75rem', 
                display: 'flex', 
                alignItems: 'center', 
                gap: '1.25rem',
                borderLeft: '4px solid var(--accent-amber)' 
              }}
            >
              <div 
                style={{ 
                  width: '52px', 
                  height: '52px', 
                  borderRadius: '50%', 
                  background: 'rgba(245, 158, 11, 0.12)', 
                  border: '1px solid rgba(245, 158, 11, 0.35)', 
                  color: 'var(--accent-amber)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  flexShrink: 0 
                }}
              >
                <MapPin size={24} />
              </div>
              <div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600 }}>
                  Primary Location
                </span>
                <h4 style={{ fontSize: '1.1rem', marginTop: '0.2rem' }}>
                  {personalData.location}
                </h4>
              </div>
            </div>

            {/* Social Links Bar */}
            <div className="glass-card" style={{ padding: '1.75rem' }}>
              <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 600, display: 'block', marginBottom: '1.2rem' }}>
                Verified Profiles
              </span>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <a
                  href={personalData.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline"
                  style={{ flex: 1, padding: '0.75rem', fontSize: '0.9rem' }}
                >
                  <Linkedin size={18} />
                  <span>LinkedIn Profile</span>
                </a>
                <a
                  href={personalData.github}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-outline"
                  style={{ flex: 1, padding: '0.75rem', fontSize: '0.9rem' }}
                >
                  <Github size={18} />
                  <span>GitHub Profile</span>
                </a>
              </div>
            </div>

          </div>

          {/* SECTION 2: INTERACTIVE CONTACT FORM */}
          <div className="glass-card" style={{ padding: '3rem 2.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-orange)', marginBottom: '0.5rem' }}>
              <Sparkles size={18} />
              <span style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Send Message
              </span>
            </div>

            <h3 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>Get in Touch Directly</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '2rem' }}>
              Have a developer role, internship opportunity, or project inquiry? Drop a message below.
            </p>

            {submitted ? (
              <div 
                style={{ 
                  padding: '2.5rem 2rem', 
                  background: 'rgba(16, 185, 129, 0.1)', 
                  border: '1px solid rgba(16, 185, 129, 0.35)', 
                  borderRadius: 'var(--radius-md)', 
                  textAlign: 'center', 
                  color: '#10b981' 
                }}
              >
                <CheckCircle2 size={48} style={{ marginBottom: '1rem' }} />
                <h4 style={{ fontSize: '1.35rem', marginBottom: '0.5rem', color: '#10b981' }}>Message Received!</h4>
                <p style={{ color: 'var(--text-primary)', fontSize: '0.98rem', maxWidth: '420px', margin: '0 auto' }}>
                  Thank you for reaching out. Pandit Nirajkumar Balistar will review your inquiry promptly.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn btn-outline"
                  style={{ marginTop: '1.75rem', padding: '0.65rem 1.4rem', fontSize: '0.88rem' }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
                {error && (
                  <div 
                    style={{ 
                      padding: '0.85rem 1.1rem', 
                      background: 'rgba(239, 68, 68, 0.12)', 
                      border: '1px solid rgba(239, 68, 68, 0.35)', 
                      borderRadius: 'var(--radius-sm)', 
                      color: '#ef4444', 
                      fontSize: '0.9rem', 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '0.6rem' 
                    }}
                  >
                    <AlertCircle size={18} />
                    <span>{error}</span>
                  </div>
                )}

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                    Your Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. Rahul Sharma"
                    style={{
                      width: '100%',
                      padding: '0.9rem 1.1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      fontSize: '0.98rem',
                      outline: 'none',
                      transition: 'var(--transition-fast)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-orange)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                    Your Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="e.g. rahul@example.com"
                    style={{
                      width: '100%',
                      padding: '0.9rem 1.1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      fontSize: '0.98rem',
                      outline: 'none',
                      transition: 'var(--transition-fast)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-orange)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Full-Stack Developer Role / Project Inquiry"
                    style={{
                      width: '100%',
                      padding: '0.9rem 1.1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      fontSize: '0.98rem',
                      outline: 'none',
                      transition: 'var(--transition-fast)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-orange)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about the role, project, or timeline..."
                    style={{
                      width: '100%',
                      padding: '0.9rem 1.1rem',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      fontSize: '0.98rem',
                      outline: 'none',
                      resize: 'vertical',
                      transition: 'var(--transition-fast)'
                    }}
                    onFocus={(e) => e.target.style.borderColor = 'var(--accent-orange)'}
                    onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
                  ></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={loading}
                  className="btn btn-primary" 
                  style={{ padding: '0.95rem', fontSize: '1rem', marginTop: '0.5rem' }}
                >
                  <Send size={18} />
                  <span>{loading ? 'Transmitting...' : 'Send Message'}</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* SECTION 3: AVAILABILITY STATUS BADGE & TIMELINE */}
        <div 
          className="glass-card" 
          style={{ 
            padding: '2.5rem', 
            textAlign: 'center', 
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-lg)'
          }}
        >
          <div 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.65rem', 
              padding: '0.45rem 1.2rem', 
              borderRadius: 'var(--radius-full)', 
              background: 'rgba(16, 185, 129, 0.12)', 
              border: '1px solid rgba(16, 185, 129, 0.35)', 
              color: '#10b981', 
              fontWeight: 600, 
              marginBottom: '1rem' 
            }}
          >
            <span className="status-beacon"></span>
            <span>Current Status: Actively Interviewing & Available</span>
          </div>

          <h4 style={{ fontSize: '1.45rem', marginBottom: '0.5rem' }}>
            Full Stack Web Developer & Software Engineering Roles
          </h4>

          <p style={{ color: 'var(--text-secondary)', fontSize: '0.96rem', maxWidth: '600px', margin: '0 auto' }}>
            Available for immediate onboarding for on-site positions in Surat, Vapi, Valsad, or remote positions across India and worldwide.
          </p>
        </div>

      </div>
    </div>
  );
}
