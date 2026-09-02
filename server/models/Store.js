const mongoose = require('mongoose');

const storeSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide store name'],
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      enum: ['food', 'grocery', 'pharmacy', 'electronics', 'other'],
      default: 'food',
    },
    image: {
      type: String,
      default: null,
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
    },
    address: {
      type: String,
      required: [true, 'Please provide address'],
    },
    location: {
      latitude: {
        type: Number,
        required: true,
      },
      longitude: {
        type: Number,
        required: true,
      },
    },
    deliveryRadius: {
      type: Number,
      default: 5, // in km
    },
    minimumOrder: {
      type: Number,
      default: 100,
    },
    averagePreparationTime: {
      type: Number,
      default: 20, // in minutes
    },
    isOpen: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Store', storeSchema);
