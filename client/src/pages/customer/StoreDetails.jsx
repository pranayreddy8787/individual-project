import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import ProductCard from '../../components/ProductCard';
import Loading from '../../components/Loading';

const StoreDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStoreAndProducts();
  }, [id]);

  const fetchStoreAndProducts = async () => {
    try {
      setLoading(true);
      const [storeRes, productsRes] = await Promise.all([
        api.get(`/stores/${id}`),
        api.get(`/products?storeId=${id}`),
      ]);
      setStore(storeRes.data.data);
      setProducts(productsRes.data.data);
    } catch (error) {
      alert('Failed to load store details');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!store) return <div className="container"><p>Store not found</p></div>;

  return (
    <div className="container" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <button onClick={() => navigate('/')} className="btn btn-outline">← Back</button>

      <div className="card" style={{ marginTop: '1rem' }}>
        <img
          src={store.image || 'https://via.placeholder.com/600x300?text=Store'}
          alt={store.name}
          style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '8px' }}
        />
        <div style={{ marginTop: '1.5rem' }}>
          <h1>{store.name}</h1>
          <p>{store.description}</p>
          <div style={{ display: 'flex', gap: '2rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <div>⭐ Rating: {store.rating}</div>
            <div>📍 Category: {store.category}</div>
            <div>⏱️ Prep Time: {store.averagePreparationTime} min</div>
            <div>💵 Min Order: ₹{store.minimumOrder}</div>
          </div>
        </div>
      </div>

      <h2 style={{ marginTop: '2rem', marginBottom: '1.5rem' }}>Products</h2>

      {products.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h3>No products available</h3>
        </div>
      ) : (
        <div className="grid grid-4">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default StoreDetails;
