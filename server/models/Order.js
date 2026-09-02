const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    deliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        name: String,
        quantity: Number,
        price: Number,
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    deliveryFee: {
      type: Number,
      default: 0,
    },
    tax: {
      type: Number,
      default: 0,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    deliveryAddress: {
      type: String,
      required: true,
    },
    deliveryLocation: {
      latitude: Number,
      longitude: Number,
    },
    status: {
      type: String,
      enum: [
        'pending',
        'confirmed',
        'preparing',
        'ready_for_pickup',
        'assigned',
        'accepted',
        'picked_up',
        'out_for_delivery',
        'delivered',
        'cancelled',
        'rejected',
        'failed',
      ],
      default: 'pending',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'card'],
      default: 'cash',
    },
    paymentStatus: {
      type: String,
      enum: ['pending', 'completed', 'failed'],
      default: 'pending',
    },
    cancellationReason: {
      type: String,
      default: null,
    },
    estimatedDeliveryTime: {
      type: Number,
      default: null, // in minutes
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Order', orderSchema);
