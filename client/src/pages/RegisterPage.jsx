import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Eye, EyeOff, AlertCircle, CheckCircle2, User, Mail, Lock,
  ShieldCheck, ArrowRight, Sparkles
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) {
      errs.name = 'Full Name is required';
    } else if (form.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    if (!form.email.trim()) {
      errs.email = 'College Email ID is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!form.password) {
      errs.password = 'Password is required';
    } else if (form.password.length < 6) {
      errs.password = 'Password must be at least 6 characters';
    }

    if (!form.confirmPassword) {
      errs.confirmPassword = 'Confirm Password is required';
    } else if (form.password !== form.confirmPassword) {
      errs.confirmPassword = 'Passwords do not match';
    }

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name] || errors.general) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        delete next.general;
        return next;
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        password: form.password,
      });

      toast.success('Registration Successful — Your account has been created successfully.');
      // Redirect strictly to Login page
      navigate('/login');
    } catch (err) {
      const msg = err.friendlyMessage || 'Registration failed. Please check your details.';
      toast.error(msg);
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  // Password strength meter
  const getPasswordStrength = () => {
    const p = form.password;
    if (!p) return null;
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p) || /[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score; // 1 to 4
  };

  const strengthScore = getPasswordStrength();
  const strengthColors = ['#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
  const strengthLabels = ['Weak', 'Moderate', 'Good', 'Strong'];

  return (
    <div className="auth-split-wrapper">
      {/* ── Left Side: Campus Showcase ─────────────────────────────────── */}
      <div className="auth-showcase-panel">
        <div className="showcase-header">
          <div className="showcase-badge">
            <Sparkles size={16} />
            <span>New Student Onboarding • Campus Community</span>
          </div>

          {/* College Student Life Hero Banner Image */}
          <div className="showcase-hero-banner">
            <img
              src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80"
              alt="Students on College Campus"
              className="showcase-hero-img"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="showcase-hero-gradient" />
            <div className="showcase-hero-tag">
              🎓 Student Network • Secure Belonging Protection
            </div>
          </div>

          <h1 className="showcase-title">
            Join Your Campus Network.<br />
            <span>Never Lose What Matters.</span>
          </h1>
          <p className="showcase-desc">
            Register your student profile to report items you’ve lost or found across
            lecture halls, libraries, cafeterias, and campus grounds.
          </p>
        </div>

        {/* Visual Item Cards with Photos */}
        <div className="showcase-items-grid">
          <div className="showcase-item-card">
            <img
              src="https://images.unsplash.com/photo-1578852612716-854e527abf50?auto=format&fit=crop&w=120&q=80"
              alt="Student ID Card"
              className="item-card-photo"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="item-card-info">
              <strong>College ID &amp; Hall Ticket</strong>
              <span>Exam Center &amp; Labs</span>
            </div>
            <span className="item-status-pill recovered">Protected</span>
          </div>

          <div className="showcase-item-card">
            <img
              src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=120&q=80"
              alt="Backpack"
              className="item-card-photo"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="item-card-info">
              <strong>Backpacks &amp; Laptops</strong>
              <span>Library &amp; Study Cubicles</span>
            </div>
            <span className="item-status-pill safe">Traceable</span>
          </div>

          <div className="showcase-item-card">
            <img
              src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=120&q=80"
              alt="Water Bottle"
              className="item-card-photo"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="item-card-info">
              <strong>Bottles &amp; Flasks</strong>
              <span>Cafeteria &amp; Sports Ground</span>
            </div>
            <span className="item-status-pill resolved">Recovered</span>
          </div>

          <div className="showcase-item-card">
            <img
              src="https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=120&q=80"
              alt="Keys"
              className="item-card-photo"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="item-card-info">
              <strong>Hostel &amp; Vehicle Keys</strong>
              <span>Parking &amp; Hostel Blocks</span>
            </div>
            <span className="item-status-pill returned">Returned</span>
          </div>
        </div>

        {/* Showcase Footer Features */}
        <div className="showcase-footer">
          <div className="footer-feature">
            <span className="feature-dot"></span>
            <span>Bcrypt Hashed Passwords</span>
          </div>
          <div className="footer-feature">
            <span className="feature-dot"></span>
            <span>Verified Student Access</span>
          </div>
          <div className="footer-feature">
            <span className="feature-dot"></span>
            <span>Instant MongoDB Sync</span>
          </div>
        </div>
      </div>

      {/* ── Right Side: Modern Registration Form ───────────────────────── */}
      <div className="auth-form-panel">
        <div className="auth-form-inner">
          <div className="auth-brand-row">
            <div className="brand-logo-circle">
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: 28, height: 28 }}>
                <rect width="36" height="36" rx="10" fill="#4F46E5"/>
                <circle cx="18" cy="18" r="8" stroke="white" strokeWidth="2.5" fill="none"/>
                <circle cx="18" cy="18" r="2.5" fill="white"/>
                <path d="M18 12v2M18 22v2M12 18h2M22 18h2" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div>
              <div className="brand-name">Campus Lost &amp; Found</div>
              <div className="brand-tagline">Student Account Registration</div>
            </div>
          </div>

          <div className="form-header-text">
            <h2>Create Student Account</h2>
            <p>Fill in your details below to register on the campus portal.</p>
          </div>

          {errors.general && (
            <div className="auth-alert error" role="alert">
              <AlertCircle size={18} />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Full Name */}
            <div className="form-group-modern">
              <label htmlFor="reg-name">Full Name</label>
              <div className="input-icon-wrapper">
                <User size={18} className="input-icon" />
                <input
                  id="reg-name"
                  type="text"
                  name="name"
                  className={`form-control-modern ${errors.name ? 'has-error' : ''}`}
                  placeholder="e.g., Nishika Sumer Kalamkar"
                  value={form.name}
                  onChange={handleChange}
                  autoComplete="name"
                  aria-required="true"
                  aria-invalid={!!errors.name}
                />
              </div>
              {errors.name && (
                <span className="field-error-msg">
                  <AlertCircle size={13} /> {errors.name}
                </span>
              )}
            </div>

            {/* College Email ID */}
            <div className="form-group-modern">
              <label htmlFor="reg-email">College Email ID</label>
              <div className="input-icon-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  id="reg-email"
                  type="email"
                  name="email"
                  className={`form-control-modern ${errors.email ? 'has-error' : ''}`}
                  placeholder="e.g., student@college.edu"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  aria-required="true"
                  aria-invalid={!!errors.email}
                />
              </div>
              {errors.email && (
                <span className="field-error-msg">
                  <AlertCircle size={13} /> {errors.email}
                </span>
              )}
            </div>

            {/* Password */}
            <div className="form-group-modern">
              <label htmlFor="reg-password">Password</label>
              <div className="input-icon-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="reg-password"
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  className={`form-control-modern ${errors.password ? 'has-error' : ''}`}
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  style={{ paddingRight: '2.8rem' }}
                  aria-required="true"
                  aria-invalid={!!errors.password}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPwd((prev) => !prev)}
                  aria-label={showPwd ? 'Hide password' : 'Show password'}
                  title={showPwd ? 'Hide password' : 'Show password'}
                >
                  {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Password strength indicator */}
              {form.password && (
                <div className="password-strength-wrap">
                  <div className="strength-bars">
                    {[1, 2, 3, 4].map((level) => (
                      <span
                        key={level}
                        className="strength-bar-segment"
                        style={{
                          backgroundColor:
                            strengthScore >= level
                              ? strengthColors[strengthScore - 1]
                              : '#e2e8f0',
                        }}
                      />
                    ))}
                  </div>
                  <div className="strength-label" style={{ color: strengthColors[strengthScore - 1] || 'var(--text-muted)' }}>
                    Strength: <strong>{strengthLabels[strengthScore - 1] || 'Too short'}</strong>
                  </div>
                </div>
              )}

              {errors.password && (
                <span className="field-error-msg">
                  <AlertCircle size={13} /> {errors.password}
                </span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group-modern">
              <label htmlFor="reg-confirm-password">Confirm Password</label>
              <div className="input-icon-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="reg-confirm-password"
                  type={showConfirmPwd ? 'text' : 'password'}
                  name="confirmPassword"
                  className={`form-control-modern ${errors.confirmPassword ? 'has-error' : ''}`}
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  style={{ paddingRight: '2.8rem' }}
                  aria-required="true"
                  aria-invalid={!!errors.confirmPassword}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowConfirmPwd((prev) => !prev)}
                  aria-label={showConfirmPwd ? 'Hide confirm password' : 'Show confirm password'}
                  title={showConfirmPwd ? 'Hide password' : 'Show password'}
                >
                  {showConfirmPwd ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Match indicator */}
              {form.confirmPassword && form.password === form.confirmPassword && (
                <span className="field-success-msg">
                  <CheckCircle2 size={13} /> Passwords match
                </span>
              )}

              {errors.confirmPassword && (
                <span className="field-error-msg">
                  <AlertCircle size={13} /> {errors.confirmPassword}
                </span>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-auth-primary"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <span className="btn-loading-content">
                  <span className="btn-spinner" /> Registering Account...
                </span>
              ) : (
                <span className="btn-text-content">
                  Create Student Account <ArrowRight size={17} />
                </span>
              )}
            </button>
          </form>

          {/* Login Redirect Link */}
          <div className="auth-footer-prompt">
            <span>Already have an account?</span>{' '}
            <Link to="/login" className="auth-link-highlight">
              Sign In here
            </Link>
          </div>

          <div className="auth-security-note">
            <ShieldCheck size={14} />
            <span>FLEXI CA-3 Project • Secure Student Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
}
