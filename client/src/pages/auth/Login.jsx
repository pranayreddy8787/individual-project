import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await login(formData.email, formData.password);
      
      // Redirect based on role
      switch (result.user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'store':
          navigate('/store/dashboard');
          break;
        case 'delivery_partner':
          navigate('/delivery/dashboard');
          break;
        case 'customer':
        default:
          navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '500px', marginTop: '3rem' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>Login to QuickDrop</h2>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Don't have an account? <Link to="/register">Register here</Link>
        </p>

        <hr style={{ margin: '1.5rem 0' }} />
        
        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
          <p><strong>Test Credentials:</strong></p>
          <p>👨‍💼 Admin: admin@quickdrop.com / admin123</p>
          <p>👨‍💼 Customer: rajesh@example.com / password123</p>
          <p>🍕 Store: foodhaven@example.com / password123</p>
          <p>🚴 Delivery: rohan.delivery@example.com / password123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
