import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import Loading from '../../components/Loading';

const Cart = () => {
  const { cart, loading, removeFromCart, updateCartItem } = useCart();
  const navigate = useNavigate();

  if (loading) return <Loading />;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container" style={{ marginTop: '3rem', marginBottom: '3rem' }}>
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <button onClick={() => navigate('/')} className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="container" style={{ marginTop: '2rem', marginBottom: '2rem' }}>
      <h1>🛒 Your Cart</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', marginTop: '2rem' }}>
        <div>
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item._id}>
                  <td>{item.product?.name || 'Product'}</td>
                  <td>₹{item.price}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => updateCartItem(item._id, parseInt(e.target.value))}
                      className="form-input"
                      style={{ width: '60px', padding: '0.4rem' }}
                    />
                  </td>
                  <td>₹{item.price * item.quantity}</td>
                  <td>
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="btn btn-small btn-danger"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <h3>Order Summary</h3>
          <div style={{ borderTop: '1px solid var(--border-color)', marginTop: '1rem', paddingTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Subtotal:</span>
              <span>₹{cart.totalAmount}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Delivery Fee:</span>
              <span>₹0 (Calculated at checkout)</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
              <span>Total:</span>
              <span>₹{cart.totalAmount}</span>
            </div>

            <button
              onClick={handleCheckout}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1.5rem' }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
