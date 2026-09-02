const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    deliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    assignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    pickupLocation: {
      latitude: Number,
      longitude: Number,
    },
    deliveryLocation: {
      latitude: Number,
      longitude: Number,
    },
    status: {
      type: String,
      enum: [
        'assigned',
        'accepted',
        'picked_up',
        'out_for_delivery',
        'delivered',
        'rejected',
        'failed',
      ],
      default: 'assigned',
    },
    assignedAt: {
      type: Date,
      default: Date.now,
    },
    acceptedAt: {
      type: Date,
      default: null,
    },
    pickedUpAt: {
      type: Date,
      default: null,
    },
    deliveredAt: {
      type: Date,
      default: null,
    },
    estimatedTime: {
      type: Number,
      default: null, // in minutes
    },
    distance: {
      type: Number,
      default: null, // in km
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Delivery', deliverySchema);
