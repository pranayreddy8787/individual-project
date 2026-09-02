import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../../components/Loading';
import { formatDate } from '../../utils/helpers';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders');
      setOrders(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;

  return (
    <div className="container" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <h1>📦 My Orders</h1>

      {orders.length === 0 ? (
        <div className="empty-state" style={{ marginTop: '3rem' }}>
          <div className="empty-state-icon">📦</div>
          <h3>No orders yet</h3>
          <p>Start ordering from your favorite stores</p>
          <Link to="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Browse Stores
          </Link>
        </div>
      ) : (
        <div className="grid grid-2" style={{ marginTop: '2rem' }}>
          {orders.map((order) => (
            <div key={order._id} className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>Order ID</div>
                  <div style={{ fontWeight: 'bold' }}>{order._id.substring(0, 12)}...</div>
                </div>
                <span className={`badge badge-${order.status}`}>{order.status}</span>
              </div>

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem', marginBottom: '1rem' }}>
                <p><strong>Store:</strong> {order.store?.name}</p>
                <p><strong>Items:</strong> {order.items.length}</p>
                <p><strong>Total:</strong> ₹{order.totalAmount}</p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                  {formatDate(order.createdAt)}
                </p>
              </div>

              <Link to={`/order/${order._id}`} className="btn btn-primary btn-small">
                Track Order
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
