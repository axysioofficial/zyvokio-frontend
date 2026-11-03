import React, { useState } from 'react';
import { 
  Send, 
  Mail, 
  User, 
  MessageSquare, 
  Tag, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  Cpu, 
  HelpCircle,
  Copy,
  Check,
  RotateCcw,
  Loader2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sendContactMessage } from '../utils/api';

const INQUIRY_CATEGORIES = [
  { id: 'feature', label: 'Feature or Format Request', icon: Sparkles, placeholder: 'e.g., Support for AVIF, TIFF, or OCR batching' },
  { id: 'bug', label: 'Bug or Conversion Issue', icon: AlertCircle, placeholder: 'e.g., Conversion failed with error code on large file' },
  { id: 'performance', label: 'Performance & Speed Feedback', icon: Cpu, placeholder: 'e.g., Processing latency observations' },
  { id: 'general', label: 'General Inquiry / Question', icon: HelpCircle, placeholder: 'e.g., Question about in-memory pipeline or licensing' },
  { id: 'business', label: 'API & Business Collaboration', icon: Tag, placeholder: 'e.g., Embedding Zyvokio engine into custom workflow' }
];

const QUICK_TOPICS = [
  { label: '✨ Request AVIF/HEIC', category: 'Feature or Format Request', subject: 'Feature Request: Add AVIF / HEIC image support' },
  { label: '⚡ Higher Size Limit', category: 'Feature or Format Request', subject: 'Feature Request: Increase max upload buffer limit' },
  { label: '🐛 Report Image Glitch', category: 'Bug or Conversion Issue', subject: 'Bug Report: Image color shift / rendering issue' },
  { label: '🚀 Custom API Access', category: 'API & Business Collaboration', subject: 'Inquiry: Direct REST API endpoints access' }
];

export default function ContactSection({ onNotify }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'Feature or Format Request',
    subject: '',
    message: '',
    urgency: 'Normal'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);
  const [copiedTicket, setCopiedTicket] = useState(false);

  // Validate form
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your name.';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters.';
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email address.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please provide a valid email (e.g. name@domain.com).';
    }

    if (!formData.message.trim()) {
      newErrors.message = 'Please write a message.';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const copy = { ...prev };
        delete copy[field];
        return copy;
      });
    }
  };

  const handleSelectQuickTopic = (topic) => {
    setFormData(prev => ({
      ...prev,
      category: topic.category,
      subject: topic.subject
    }));
    if (onNotify) {
      onNotify(`Applied topic: "${topic.label}"`, 'info');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const result = await sendContactMessage({
        ...formData,
        subject: formData.subject.trim() || `${formData.category} from ${formData.name.trim()}`
      });

      setSubmittedTicket({
        ticketId: result.ticketId,
        name: formData.name.trim(),
        email: formData.email.trim(),
        category: formData.category,
        message: result.message
      });

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 65,
          spread: 70,
          origin: { y: 0.75 },
          colors: ['#19E68C', '#12CFE5', '#087FAF', '#39F2A1']
        });
      } catch (err) {
        // Confetti optional
      }

      if (onNotify) {
        onNotify(`Message sent! Reference #${result.ticketId}`, 'success');
      }
    } catch (err) {
      if (onNotify) {
        onNotify(err.message || 'Failed to send message. Please try again.', 'error');
      } else {
        setErrors(prev => ({ ...prev, submit: err.message || 'Failed to send message.' }));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyTicket = () => {
    if (!submittedTicket?.ticketId) return;
    navigator.clipboard.writeText(submittedTicket.ticketId);
    setCopiedTicket(true);
    setTimeout(() => setCopiedTicket(false), 2200);
    if (onNotify) {
      onNotify('Ticket ID copied to clipboard', 'info');
    }
  };

  const handleReset = () => {
    setSubmittedTicket(null);
    setFormData({
      name: '',
      email: '',
      category: 'Feature or Format Request',
      subject: '',
      message: '',
      urgency: 'Normal'
    });
    setErrors({});
  };

  return (
    <section id="contact-section" className="contact-section" aria-labelledby="contact-heading">
      <div className="contact-glow-ambient" aria-hidden="true" />

      <div className="contact-container">
        {/* Left Column: Context & Direct Engineering Highlights */}
        <div className="contact-info-col">
          <div className="contact-badge-wrap">
            <span className="badge badge-primary">
              <Sparkles size={13} className="text-cyan" />
              <span>Direct Support & Engineering Desk</span>
            </span>
          </div>

          <h2 id="contact-heading" className="contact-title">
            Have Questions or Need a <span className="gradient-text">Custom Tool?</span>
          </h2>

          <p className="contact-subtitle">
            Whether you ran into an edge case with an image format, need batch processing limits raised, 
            or want to propose a new PDF feature — our engineering team reads every transmission.
          </p>

          {/* Quick Info Grid */}
          <div className="contact-features-list">
            <div className="contact-feature-item glass-panel">
              <div className="contact-feature-icon-box">
                <Clock size={18} className="text-cyan" />
              </div>
              <div className="contact-feature-text">
                <h3 className="contact-feature-title">Fast Response Guarantee</h3>
                <p className="contact-feature-desc">Inquiries typically answered within 2 hours during active deployment cycles.</p>
              </div>
            </div>

            <div className="contact-feature-item glass-panel">
              <div className="contact-feature-icon-box">
                <ShieldCheck size={18} className="text-emerald" />
              </div>
              <div className="contact-feature-text">
                <h3 className="contact-feature-title">Privacy Protected</h3>
                <p className="contact-feature-desc">Zero message tracking. In-memory buffers ensure your inquiry is never shared.</p>
              </div>
            </div>

            <div className="contact-feature-item glass-panel">
              <div className="contact-feature-icon-box">
                <Cpu size={18} className="text-indigo" />
              </div>
              <div className="contact-feature-text">
                <h3 className="contact-feature-title">Direct to Engineers</h3>
                <p className="contact-feature-desc">Your suggestions directly influence our Sharp & Libvips rendering pipeline.</p>
              </div>
            </div>
          </div>

          {/* Quick Topic Prompts */}
          <div className="contact-quick-topics">
            <span className="quick-topics-label">Quick topics to auto-fill:</span>
            <div className="quick-topics-pills">
              {QUICK_TOPICS.map((topic, i) => (
                <button
                  key={i}
                  type="button"
                  className="quick-topic-pill"
                  onClick={() => handleSelectQuickTopic(topic)}
                  title={`Select ${topic.category}`}
                >
                  {topic.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Form Card */}
        <div className="contact-form-col">
          <div className="contact-card glass-panel">
            {submittedTicket ? (
              /* Success State Screen */
              <div className="contact-success-state fade-in" role="status" aria-live="polite">
                <div className="success-icon-bubble">
                  <CheckCircle2 size={42} className="text-emerald" />
                </div>

                <h3 className="success-title">Message Delivered!</h3>
                <p className="success-desc">
                  Thank you, <strong>{submittedTicket.name}</strong>. Your inquiry has been logged directly with our tools team.
                </p>

                <div className="ticket-box">
                  <div className="ticket-label">Tracking Reference Number</div>
                  <div className="ticket-value-row">
                    <code className="ticket-id" id="contact-ticket-id">{submittedTicket.ticketId}</code>
                    <button 
                      type="button" 
                      className="ticket-copy-btn" 
                      onClick={handleCopyTicket}
                      title="Copy Ticket ID"
                      aria-label="Copy Ticket ID"
                    >
                      {copiedTicket ? <Check size={15} className="text-emerald" /> : <Copy size={15} />}
                      <span>{copiedTicket ? 'Copied!' : 'Copy'}</span>
                    </button>
                  </div>
                  <div className="ticket-hint">A confirmation receipt has been generated. Response will be dispatched to <strong>{submittedTicket.email}</strong>.</div>
                </div>

                <button 
                  type="button"
                  id="contact-send-another-btn"
                  className="btn-secondary send-another-btn"
                  onClick={handleReset}
                >
                  <RotateCcw size={15} />
                  <span>Send Another Message</span>
                </button>
              </div>
            ) : (
              /* Contact Form */
              <form 
                id="contact-form" 
                className="contact-form-element" 
                onSubmit={handleSubmit} 
                noValidate
              >
                <div className="form-header-bar">
                  <div className="form-header-left">
                    <span className="live-status-dot" />
                    <span className="form-header-title">Send a Transmission</span>
                  </div>
                  <span className="form-header-tag">SSL Encrypted</span>
                </div>

                {errors.submit && (
                  <div className="form-global-error" role="alert">
                    <AlertCircle size={16} />
                    <span>{errors.submit}</span>
                  </div>
                )}

                {/* Name & Email Row */}
                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="contact-name" className="form-label">
                      Your Name <span className="required-star">*</span>
                    </label>
                    <div className={`input-field-wrap ${errors.name ? 'has-error' : ''}`}>
                      <User size={16} className="input-icon" />
                      <input
                        id="contact-name"
                        type="text"
                        className="form-input"
                        placeholder="Alex Morgan"
                        value={formData.name}
                        onChange={(e) => handleChange('name', e.target.value)}
                        disabled={isSubmitting}
                        aria-invalid={!!errors.name}
                        aria-describedby={errors.name ? 'contact-name-error' : undefined}
                        required
                      />
                    </div>
                    {errors.name && (
                      <span id="contact-name-error" className="field-error-text">
                        <AlertCircle size={12} /> {errors.name}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-email" className="form-label">
                      Email Address <span className="required-star">*</span>
                    </label>
                    <div className={`input-field-wrap ${errors.email ? 'has-error' : ''}`}>
                      <Mail size={16} className="input-icon" />
                      <input
                        id="contact-email"
                        type="email"
                        className="form-input"
                        placeholder="alex@domain.com"
                        value={formData.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        disabled={isSubmitting}
                        aria-invalid={!!errors.email}
                        aria-describedby={errors.email ? 'contact-email-error' : undefined}
                        required
                      />
                    </div>
                    {errors.email && (
                      <span id="contact-email-error" className="field-error-text">
                        <AlertCircle size={12} /> {errors.email}
                      </span>
                    )}
                  </div>
                </div>

                {/* Category & Urgency Row */}
                <div className="form-grid-2">
                  <div className="form-group">
                    <label htmlFor="contact-category" className="form-label">
                      Inquiry Category
                    </label>
                    <div className="input-field-wrap">
                      <Tag size={16} className="input-icon" />
                      <select
                        id="contact-category"
                        className="form-select"
                        value={formData.category}
                        onChange={(e) => handleChange('category', e.target.value)}
                        disabled={isSubmitting}
                      >
                        {INQUIRY_CATEGORIES.map(cat => (
                          <option key={cat.id} value={cat.label}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Priority Level</label>
                    <div className="urgency-pill-group" role="radiogroup" aria-label="Priority Level">
                      {['Normal', 'High', 'Critical'].map((level) => (
                        <button
                          key={level}
                          type="button"
                          role="radio"
                          aria-checked={formData.urgency === level}
                          className={`urgency-pill ${formData.urgency === level ? 'active' : ''} ${level.toLowerCase()}`}
                          onClick={() => handleChange('urgency', level)}
                          disabled={isSubmitting}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Subject Line */}
                <div className="form-group">
                  <label htmlFor="contact-subject" className="form-label">
                    Subject Line
                  </label>
                  <div className="input-field-wrap">
                    <MessageSquare size={16} className="input-icon" />
                    <input
                      id="contact-subject"
                      type="text"
                      className="form-input"
                      placeholder="Brief overview of your request or feedback"
                      value={formData.subject}
                      onChange={(e) => handleChange('subject', e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                {/* Message Textarea */}
                <div className="form-group">
                  <div className="form-label-row">
                    <label htmlFor="contact-message" className="form-label">
                      Your Message <span className="required-star">*</span>
                    </label>
                    <span className="char-count">
                      {formData.message.length} characters (min 10)
                    </span>
                  </div>
                  <div className={`input-field-wrap textarea-wrap ${errors.message ? 'has-error' : ''}`}>
                    <textarea
                      id="contact-message"
                      rows={4}
                      className="form-textarea"
                      placeholder="Tell us what tool or feature you'd like to see, or describe the steps to reproduce any issue you encountered..."
                      value={formData.message}
                      onChange={(e) => handleChange('message', e.target.value)}
                      disabled={isSubmitting}
                      aria-invalid={!!errors.message}
                      aria-describedby={errors.message ? 'contact-message-error' : undefined}
                      required
                    />
                  </div>
                  {errors.message && (
                    <span id="contact-message-error" className="field-error-text">
                      <AlertCircle size={12} /> {errors.message}
                    </span>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  id="contact-submit-btn"
                  className="btn-primary contact-submit-btn"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="spinner-icon" />
                      <span>Transmitting Message...</span>
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      <span>Send Transmission</span>
                    </>
                  )}
                </button>

                <div className="form-footer-assurance">
                  <ShieldCheck size={13} className="text-emerald" />
                  <span>Protected by in-memory privacy engine. No spam, ever.</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
