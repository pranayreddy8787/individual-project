import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/navbar.css';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getRolePath = () => {
    if (!isAuthenticated) return '/';
    switch (user?.role) {
      case 'admin':
        return '/admin/dashboard';
      case 'store':
        return '/store/dashboard';
      case 'delivery_partner':
        return '/delivery/dashboard';
      case 'customer':
      default:
        return '/';
    }
  };

  return (
    <nav className="navbar">
      <div className="container">
        <div className="nav-content">
          <Link to={getRolePath()} className="logo">
            🚀 QuickDrop
          </Link>

          <ul className="nav-links">
            {!isAuthenticated ? (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
              </>
            ) : (
              <>
                {user?.role === 'customer' && (
                  <>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/orders">My Orders</Link></li>
                    <li><Link to="/cart">Cart</Link></li>
                  </>
                )}
                {user?.role === 'store' && (
                  <>
                    <li><Link to="/store/dashboard">Dashboard</Link></li>
                    <li><Link to="/store/products">Products</Link></li>
                    <li><Link to="/store/orders">Orders</Link></li>
                  </>
                )}
                {user?.role === 'delivery_partner' && (
                  <>
                    <li><Link to="/delivery/dashboard">Dashboard</Link></li>
                    <li><Link to="/delivery/history">History</Link></li>
                  </>
                )}
                {user?.role === 'admin' && (
                  <>
                    <li><Link to="/admin/dashboard">Dashboard</Link></li>
                    <li><Link to="/admin/orders">Orders</Link></li>
                  </>
                )}
                <li>
                  <span style={{ color: 'var(--text-light)' }}>
                    {user?.name}
                  </span>
                </li>
                <li>
                  <button onClick={handleLogout} className="btn btn-small btn-primary">
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
