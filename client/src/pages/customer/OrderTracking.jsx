import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Loading from '../../components/Loading';

const OrderTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data.data);
    } catch (error) {
      alert('Order not found');
      navigate('/orders');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading />;
  if (!order) return null;

  const statusFlow = [
    'pending', 'confirmed', 'preparing', 'ready_for_pickup',
    'assigned', 'accepted', 'picked_up', 'out_for_delivery', 'delivered'
  ];
  const currentIndex = statusFlow.indexOf(order.status);

  return (
    <div className="container" style={{ marginTop: '2rem', marginBottom: '2rem', maxWidth: '600px' }}>
      <button onClick={() => navigate('/orders')} className="btn btn-outline">← Back</button>

      <div className="card" style={{ marginTop: '1.5rem' }}>
        <h2>Order Tracking</h2>
        <div style={{ marginBottom: '1rem', color: 'var(--text-light)' }}>
          Order ID: {order._id.substring(0, 20)}...
        </div>

        <div style={{ marginTop: '2rem' }}>
          {statusFlow.map((status, index) => (
            <div key={status} style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: index <= currentIndex ? 'var(--primary-color)' : 'var(--border-color)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                flexShrink: 0,
              }}>
                {index < currentIndex ? '✓' : index === currentIndex ? '●' : '○'}
              </div>
              <div>
                <div style={{
                  fontWeight: index === currentIndex ? 'bold' : 'normal',
                  color: index === currentIndex ? 'var(--primary-color)' : 'var(--text-dark)',
                }}>
                  {status.replace(/_/g, ' ').toUpperCase()}
                </div>
                {index < currentIndex && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--success-color)' }}>Completed</div>
                )}
                {index === currentIndex && (
                  <div style={{ fontSize: '0.85rem', color: 'var(--primary-color)' }}>In Progress</div>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '2rem', paddingTop: '1rem' }}>
          <h3>Order Details</h3>
          <p><strong>Store:</strong> {order.store?.name}</p>
          <p><strong>Status:</strong> <span className={`badge badge-${order.status}`}>{order.status}</span></p>
          <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
          <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
          {order.deliveryPartner && (
            <p><strong>Delivery Partner:</strong> {order.deliveryPartner?.name} ({order.deliveryPartner?.phone})</p>
          )}
          <p><strong>Estimated Delivery:</strong> {order.estimatedDeliveryTime} minutes</p>
        </div>

        {['pending', 'confirmed', 'preparing', 'ready_for_pickup', 'assigned'].includes(order.status) && (
          <button
            onClick={() => alert('Order cancellation feature coming soon')}
            className="btn btn-danger"
            style={{ marginTop: '1.5rem', width: '100%' }}
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
};

export default OrderTracking;
