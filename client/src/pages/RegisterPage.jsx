import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    else if (form.name.trim().length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email address';
    if (!form.password) e.password = 'Password is required';
    else if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      toast.success('Account created! Welcome to Campus L&F 🎉');
      navigate('/');
    } catch (err) {
      toast.error(err.friendlyMessage || 'Registration failed');
      setErrors({ general: err.friendlyMessage || 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
  };

  const passwordStrength = (() => {
    const p = form.password;
    if (!p) return null;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score;
  })();

  const strengthColors = ['var(--danger)', 'var(--warning)', '#f59e0b', 'var(--success)'];
  const strengthLabels = ['Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo" aria-hidden="true">
          <svg viewBox="0 0 52 52" fill="none" style={{ width: 52, height: 52 }}>
            <rect width="52" height="52" rx="14" fill="#4F46E5"/>
            <circle cx="26" cy="26" r="12" stroke="white" strokeWidth="3" fill="none"/>
            <circle cx="26" cy="26" r="4" fill="white"/>
            <path d="M26 16v3M26 33v3M16 26h3M33 26h3" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
        </div>
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join the Campus L&amp;F community</p>

        {errors.general && (
          <div role="alert" style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius)', padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--danger)' }}>
            <AlertCircle size={16} aria-hidden="true" /> {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate aria-label="Registration form">
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              name="name"
              className={`form-control${errors.name ? ' error' : ''}`}
              placeholder="Your full name"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              aria-required="true"
              aria-invalid={!!errors.name}
            />
            {errors.name && <span className="form-error" role="alert"><AlertCircle size={13} aria-hidden="true" /> {errors.name}</span>}
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" htmlFor="reg-email">College Email</label>
            <input
              id="reg-email"
              type="email"
              name="email"
              className={`form-control${errors.email ? ' error' : ''}`}
              placeholder="student@college.edu"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              aria-required="true"
              aria-invalid={!!errors.email}
            />
            {errors.email && <span className="form-error" role="alert"><AlertCircle size={13} aria-hidden="true" /> {errors.email}</span>}
          </div>

          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" htmlFor="reg-password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="reg-password"
                type={showPwd ? 'text' : 'password'}
                name="password"
                className={`form-control${errors.password ? ' error' : ''}`}
                placeholder="At least 8 characters"
                value={form.password}
                onChange={handleChange}
                autoComplete="new-password"
                style={{ paddingRight: '2.75rem' }}
                aria-required="true"
                aria-invalid={!!errors.password}
              />
              <button
                type="button"
                onClick={() => setShowPwd((s) => !s)}
                aria-label={showPwd ? 'Hide password' : 'Show password'}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
              >
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {/* Password strength indicator */}
            {passwordStrength !== null && (
              <div style={{ marginTop: '0.4rem' }}>
                <div style={{ display: 'flex', gap: '3px', marginBottom: '0.25rem' }}>
                  {[1, 2, 3, 4].map((s) => (
                    <div key={s} style={{ flex: 1, height: 4, borderRadius: 2, background: passwordStrength >= s ? strengthColors[passwordStrength - 1] : 'var(--border)', transition: 'background 0.2s' }} />
                  ))}
                </div>
                <span style={{ fontSize: '0.75rem', color: strengthColors[passwordStrength - 1], fontWeight: 600 }}>
                  {strengthLabels[passwordStrength - 1]}
                </span>
              </div>
            )}
            {errors.password && <span className="form-error" role="alert"><AlertCircle size={13} aria-hidden="true" /> {errors.password}</span>}
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type={showPwd ? 'text' : 'password'}
              name="confirmPassword"
              className={`form-control${errors.confirmPassword ? ' error' : ''}`}
              placeholder="Repeat your password"
              value={form.confirmPassword}
              onChange={handleChange}
              autoComplete="new-password"
              aria-required="true"
              aria-invalid={!!errors.confirmPassword}
            />
            {form.confirmPassword && form.password === form.confirmPassword && !errors.confirmPassword && (
              <span style={{ fontSize: '0.8rem', color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                <CheckCircle size={13} aria-hidden="true" /> Passwords match
              </span>
            )}
            {errors.confirmPassword && <span className="form-error" role="alert"><AlertCircle size={13} aria-hidden="true" /> {errors.confirmPassword}</span>}
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading} aria-busy={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
