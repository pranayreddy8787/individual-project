import React, { useState } from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ product, onAdded }) => {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, quantity, product.store);
      if (onAdded) onAdded();
      alert('Added to cart!');
    } catch (error) {
      alert('Error adding to cart');
    }
  };

  return (
    <div className="product-card">
      <img
        src={product.image || 'https://via.placeholder.com/250x200?text=Product'}
        alt={product.name}
      />
      <div className="product-info">
        <div className="product-name">{product.name}</div>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginBottom: '0.5rem' }}>
          {product.category}
        </div>
        <div className="product-price">₹{product.price}</div>
        {product.isAvailable ? (
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value)))}
              className="form-input"
              style={{ width: '50px', padding: '0.4rem' }}
            />
            <button onClick={handleAddToCart} className="btn btn-primary btn-small">
              Add
            </button>
          </div>
        ) : (
          <div className="badge badge-cancelled">Out of Stock</div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
