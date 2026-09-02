import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import StoreCard from '../../components/StoreCard';
import Loading from '../../components/Loading';
import { useAuth } from '../../context/AuthContext';

const Home = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      });
    }

    fetchStores();
  }, []);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const params = {};
      if (latitude && longitude) {
        params.latitude = latitude;
        params.longitude = longitude;
      }
      const response = await api.get('/stores', { params });
      setStores(response.data.data || []);
    } catch (err) {
      setError('Failed to load stores');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading nearby stores..." />;

  return (
    <div className="container" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1>👋 Welcome to QuickDrop</h1>
        <p>Fast, Fresh, Delivered to Your Door</p>
        {user && <p>Hello, {user.name}!</p>}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      <h2 style={{ marginBottom: '1.5rem' }}>🏪 Nearby Stores</h2>

      {stores.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏪</div>
          <h3>No stores available</h3>
          <p>No stores are available in your area right now</p>
        </div>
      ) : (
        <div className="grid grid-3">
          {stores.map((store) => (
            <StoreCard key={store._id} store={store} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
