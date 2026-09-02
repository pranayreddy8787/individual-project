const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Store = require('../models/Store');
const calculateDeliveryFee = require('../utils/calculateDeliveryFee');
const calculateDistance = require('../utils/calculateDistance');

// Create order
exports.createOrder = async (req, res, next) => {
  try {
    const { storeId, deliveryAddress, deliveryLatitude, deliveryLongitude, paymentMethod } = req.body;

    // Get cart
    const cart = await Cart.findOne({ customer: req.user.id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Cart is empty',
      });
    }

    // Get store
    const store = await Store.findById(storeId);
    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found',
      });
    }

    // Calculate distance and delivery fee
    const distance = calculateDistance(
      store.location.latitude,
      store.location.longitude,
      deliveryLatitude,
      deliveryLongitude
    );

    if (distance > store.deliveryRadius) {
      return res.status(400).json({
        success: false,
        message: 'Delivery location is outside service area',
      });
    }

    const deliveryFee = calculateDeliveryFee(distance);
    const tax = Math.round(cart.totalAmount * 0.05); // 5% tax

    // Create order
    const order = await Order.create({
      customer: req.user.id,
      store: storeId,
      items: cart.items.map((item) => ({
        product: item.product._id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
      })),
      subtotal: cart.totalAmount,
      deliveryFee,
      tax,
      totalAmount: cart.totalAmount + deliveryFee + tax,
      deliveryAddress,
      deliveryLocation: {
        latitude: deliveryLatitude,
        longitude: deliveryLongitude,
      },
      paymentMethod: paymentMethod || 'cash',
      estimatedDeliveryTime: store.averagePreparationTime + Math.ceil(distance * 2), // Rough estimate
    });

    // Clear cart
    await Cart.updateOne(
      { customer: req.user.id },
      { items: [], totalAmount: 0 }
    );

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Get customer orders
exports.getCustomerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ customer: req.user.id })
      .populate('store', 'name image')
      .populate('deliveryPartner', 'name phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};

// Get order by ID
exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name phone')
      .populate('store', 'name phone')
      .populate('deliveryPartner', 'name phone');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Update order status
exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = [
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
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    // Authorization check for store
    if (req.user.role === 'store') {
      const store = await Store.findById(order.store);
      if (store.owner.toString() !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized',
        });
      }
    }

    order.status = status;
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order status updated',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Cancel order
exports.cancelOrder = async (req, res, next) => {
  try {
    const { cancellationReason } = req.body;

    let order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.customer.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this order',
      });
    }

    if (['delivered', 'cancelled', 'rejected', 'failed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Cannot cancel order in current status',
      });
    }

    order.status = 'cancelled';
    order.cancellationReason = cancellationReason || '';
    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

// Get store orders
exports.getStoreOrders = async (req, res, next) => {
  try {
    const store = await Store.findOne({ owner: req.user.id });

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found',
      });
    }

    const orders = await Order.find({ store: store._id })
      .populate('customer', 'name phone address')
      .populate('deliveryPartner', 'name phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: orders,
    });
  } catch (error) {
    next(error);
  }
};
