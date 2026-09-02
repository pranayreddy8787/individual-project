const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Store',
      required: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide product name'],
    },
    description: {
      type: String,
      default: '',
    },
    category: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Please provide price'],
      min: 0,
    },
    image: {
      type: String,
      default: null,
    },
    stock: {
      type: Number,
      default: 0,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Product', productSchema);
