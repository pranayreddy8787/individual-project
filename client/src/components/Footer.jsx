import React from 'react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
          <div>
            <h3 style={{ color: 'var(--primary-color)' }}>🚀 QuickDrop</h3>
            <p>Fast, Fresh, Delivered to Your Door</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul style={{ listStyle: 'none' }}>
              <li><a href="/" style={{ color: 'white', textDecoration: 'none' }}>Home</a></li>
              <li><a href="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</a></li>
              <li><a href="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</a></li>
            </ul>
          </div>
          <div>
            <h4>For Stores</h4>
            <ul style={{ listStyle: 'none' }}>
              <li><a href="/register" style={{ color: 'white', textDecoration: 'none' }}>Become a Seller</a></li>
              <li><a href="/login" style={{ color: 'white', textDecoration: 'none' }}>Seller Login</a></li>
            </ul>
          </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '2rem', textAlign: 'center' }}>
          <p>&copy; 2024 QuickDrop. All rights reserved.</p>
          <p>Hyper-Local Delivery Platform</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
