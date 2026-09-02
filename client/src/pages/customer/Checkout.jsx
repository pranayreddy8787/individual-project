import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Checkout = () => {
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    deliveryAddress: user?.address || '',
    deliveryLatitude: user?.location?.latitude || '',
    deliveryLongitude: user?.location?.longitude || '',
    paymentMethod: 'cash',
  });

  if (!cart || cart.items.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Group products by store
      const storeGroups = {};
      cart.items.forEach((item) => {
        const storeId = item.store.toString();
        if (!storeGroups[storeId]) {
          storeGroups[storeId] = [];
        }
        storeGroups[storeId].push(item);
      });

      // Create order for first store (simplification)
      const storeId = Object.keys(storeGroups)[0];

      const response = await api.post('/orders', {
        storeId,
        deliveryAddress: formData.deliveryAddress,
        deliveryLatitude: parseFloat(formData.deliveryLatitude),
        deliveryLongitude: parseFloat(formData.deliveryLongitude),
        paymentMethod: formData.paymentMethod,
      });

      await clearCart();
      navigate(`/order/${response.data.data._id}`);
    } catch (error) {
      alert(error.response?.data?.message || 'Order creation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ marginTop: '2rem', marginBottom: '2rem', maxWidth: '600px' }}>
      <h1>📍 Checkout</h1>

      <div className="card" style={{ marginTop: '2rem' }}>
        <form onSubmit={handleSubmit}>
          <h3>Delivery Address</h3>

          <div className="form-group">
            <label className="form-label">Address</label>
            <textarea
              name="deliveryAddress"
              value={formData.deliveryAddress}
              onChange={handleChange}
              className="form-textarea"
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Latitude</label>
              <input
                type="number"
                step="0.0001"
                name="deliveryLatitude"
                value={formData.deliveryLatitude}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Longitude</label>
              <input
                type="number"
                step="0.0001"
                name="deliveryLongitude"
                value={formData.deliveryLongitude}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
          </div>

          <h3 style={{ marginTop: '2rem' }}>Payment Method</h3>

          <div className="form-group">
            <label className="form-label">Select Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="form-select"
            >
              <option value="cash">Cash on Delivery</option>
              <option value="card">Credit/Debit Card (Mock)</option>
            </select>
          </div>

          <h3 style={{ marginTop: '2rem' }}>Order Summary</h3>

          <div className="card" style={{ backgroundColor: 'var(--bg-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span>Subtotal:</span>
              <span>₹{cart.totalAmount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
              <span>Total:</span>
              <span>₹{cart.totalAmount}</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1.5rem' }}
            disabled={loading}
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
