import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Eye, EyeOff, AlertCircle, Mail, Lock, ShieldCheck,
  Search, CheckCircle2, ArrowRight, Tag, BookOpen, Key, CreditCard
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect to original attempted page or dashboard
  const from = location.state?.from?.pathname || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.email.trim()) {
      errs.email = 'Email ID is required';
    } else if (!/^\S+@\S+\.\S+$/.test(form.email) && !/^[0-9A-Za-z]{4,20}$/.test(form.email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!form.password) {
      errs.password = 'Password is required';
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
      await login(form.email.trim(), form.password);
      toast.success('Welcome back! Successfully signed in.');
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.friendlyMessage || 'Invalid email or password. Please try again.';
      toast.error(msg);
      setErrors({ general: msg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-split-wrapper">
      {/* ── Left Side: Campus Showcase ─────────────────────────────────── */}
      <div className="auth-showcase-panel">
        <div className="showcase-header">
          <div className="showcase-badge">
            <ShieldCheck size={16} />
            <span>Campus Community Platform</span>
          </div>

          {/* College Campus Hero Banner Image */}
          <div className="showcase-hero-banner">
            <img
              src="https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80"
              alt="College Campus Library"
              className="showcase-hero-img"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="showcase-hero-gradient" />
            <div className="showcase-hero-tag">
              🏫 Engineering Campus • Active Lost &amp; Found Desk
            </div>
          </div>

          <h1 className="showcase-title">
            Lost Something on Campus?<br />
            <span>We’ll Help You Find It.</span>
          </h1>
          <p className="showcase-desc">
            The official centralized portal for students to report lost belongings,
            browse found items, and safely reunite with essential campus gear.
          </p>
        </div>

        {/* Visual Item Cards with Photos */}
        <div className="showcase-items-grid">
          <div className="showcase-item-card">
            <img
              src="https://images.unsplash.com/photo-1578852612716-854e527abf50?auto=format&fit=crop&w=120&q=80"
              alt="College ID Card"
              className="item-card-photo"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="item-card-info">
              <strong>College ID Card</strong>
              <span>Library &amp; Gate Entry • Safe Recovery</span>
            </div>
            <span className="item-status-pill recovered">Verified</span>
          </div>

          <div className="showcase-item-card">
            <img
              src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=120&q=80"
              alt="Backpack & Books"
              className="item-card-photo"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="item-card-info">
              <strong>Bags &amp; Textbooks</strong>
              <span>Lecture Hall Block A &amp; Labs</span>
            </div>
            <span className="item-status-pill safe">Active</span>
          </div>

          <div className="showcase-item-card">
            <img
              src="https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=120&q=80"
              alt="Campus Keys"
              className="item-card-photo"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="item-card-info">
              <strong>Keys &amp; Accessories</strong>
              <span>Hostel, Vehicle &amp; Locker Keys</span>
            </div>
            <span className="item-status-pill returned">Returned</span>
          </div>

          <div className="showcase-item-card">
            <img
              src="https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=120&q=80"
              alt="Water Bottle"
              className="item-card-photo"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="item-card-info">
              <strong>Water Bottles &amp; Flasks</strong>
              <span>Sports Ground &amp; Gym Area</span>
            </div>
            <span className="item-status-pill resolved">Safe Keep</span>
          </div>

          <div className="showcase-item-card">
            <img
              src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=120&q=80"
              alt="Phones & Electronics"
              className="item-card-photo"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="item-card-info">
              <strong>Phones &amp; Electronics</strong>
              <span>Cafeteria &amp; Seminar Hall</span>
            </div>
            <span className="item-status-pill resolved">Claimed</span>
          </div>

          <div className="showcase-item-card">
            <img
              src="https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=120&q=80"
              alt="Books & Notebooks"
              className="item-card-photo"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <div className="item-card-info">
              <strong>Notebooks &amp; Calculators</strong>
              <span>Study Hall &amp; Exam Center</span>
            </div>
            <span className="item-status-pill safe">Found</span>
          </div>
        </div>

        {/* Showcase Footer Features */}
        <div className="showcase-footer">
          <div className="footer-feature">
            <span className="feature-dot"></span>
            <span>Verified Student Access</span>
          </div>
          <div className="footer-feature">
            <span className="feature-dot"></span>
            <span>Real-time MongoDB Cloud</span>
          </div>
          <div className="footer-feature">
            <span className="feature-dot"></span>
            <span>100% Campus Privacy</span>
          </div>
        </div>
      </div>

      {/* ── Right Side: Modern Login Form ──────────────────────────────── */}
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
              <div className="brand-tagline">Student Authentication Portal</div>
            </div>
          </div>

          <div className="form-header-text">
            <h2>Welcome Back</h2>
            <p>Please enter your registered student credentials to enter the portal.</p>
          </div>

          {errors.general && (
            <div className="auth-alert error" role="alert">
              <AlertCircle size={18} />
              <span>{errors.general}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email ID Field */}
            <div className="form-group-modern">
              <label htmlFor="login-email">
                <span>College Email ID</span>
              </label>
              <div className="input-icon-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  id="login-email"
                  type="email"
                  name="email"
                  className={`form-control-modern ${errors.email ? 'has-error' : ''}`}
                  placeholder="student@college.edu"
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

            {/* Password Field with Show/Hide option */}
            <div className="form-group-modern">
              <div className="label-row">
                <label htmlFor="login-password">
                  <span>Password</span>
                </label>
              </div>
              <div className="input-icon-wrapper">
                <Lock size={18} className="input-icon" />
                <input
                  id="login-password"
                  type={showPwd ? 'text' : 'password'}
                  name="password"
                  className={`form-control-modern ${errors.password ? 'has-error' : ''}`}
                  placeholder="Enter your account password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
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
              {errors.password && (
                <span className="field-error-msg">
                  <AlertCircle size={13} /> {errors.password}
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
                  <span className="btn-spinner" /> Signing In...
                </span>
              ) : (
                <span className="btn-text-content">
                  Sign In to Portal <ArrowRight size={17} />
                </span>
              )}
            </button>
          </form>

          {/* Registration Redirect Link */}
          <div className="auth-footer-prompt">
            <span>New to the campus portal?</span>{' '}
            <Link to="/register" className="auth-link-highlight">
              Create an account
            </Link>
          </div>

          <div className="auth-security-note">
            <ShieldCheck size={14} />
            <span>FLEXI CA-3 Project • Verified Session Guard</span>
          </div>
        </div>
      </div>
    </div>
  );
}
