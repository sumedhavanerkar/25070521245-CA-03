import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const redirect = params.get('redirect') || '/';

  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.email) e.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) { setErrors(v); return; }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 👋');
      navigate(redirect);
    } catch (err) {
      toast.error(err.friendlyMessage || 'Login failed');
      setErrors({ general: err.friendlyMessage || 'Invalid credentials' });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((prev) => { const n = { ...prev }; delete n[name]; return n; });
  };

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
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Sign in to your Campus L&amp;F account</p>

        {errors.general && (
          <div role="alert" style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius)', padding: '0.75rem 1rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--danger)' }}>
            <AlertCircle size={16} aria-hidden="true" /> {errors.general}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate aria-label="Login form">
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email"
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

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPwd ? 'text' : 'password'}
                name="password"
                className={`form-control${errors.password ? ' error' : ''}`}
                placeholder="Your password"
                value={form.password}
                onChange={handleChange}
                autoComplete="current-password"
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
            {errors.password && <span className="form-error" role="alert"><AlertCircle size={13} aria-hidden="true" /> {errors.password}</span>}
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={loading} aria-busy={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="auth-divider"><span>OR</span></div>

        <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius)', padding: '0.875rem 1rem', fontSize: '0.8125rem', color: 'var(--text-secondary)', textAlign: 'center', border: '1px solid var(--border)' }}>
          <strong>Demo credentials:</strong><br />
          Admin: admin@campus.edu / Admin@12345<br />
          Student: priya@student.edu / Student@123
        </div>

        <p className="auth-footer">
          Don't have an account? <Link to="/register">Sign up here</Link>
        </p>
      </div>
    </div>
  );
}
