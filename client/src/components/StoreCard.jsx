import React from 'react';
import { Link } from 'react-router-dom';

const StoreCard = ({ store }) => {
  return (
    <Link to={`/store/${store._id}`} style={{ textDecoration: 'none' }}>
      <div className="store-card">
        <img
          src={store.image || 'https://via.placeholder.com/300x200?text=Store'}
          alt={store.name}
        />
        <div className="store-info">
          <div className="store-name">{store.name}</div>
          <div className="store-rating">
            ⭐ {store.rating} • {store.category}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
            Delivery: {store.deliveryRadius} km
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
            Min Order: ₹{store.minimumOrder}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default StoreCard;
