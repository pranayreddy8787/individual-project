const Order = require('../models/Order');
const Delivery = require('../models/Delivery');
const User = require('../models/User');
const Store = require('../models/Store');
const calculateDistance = require('../utils/calculateDistance');

// Get dashboard stats
exports.getDashboard = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const activeDeliveries = await Delivery.countDocuments({
      status: { $in: ['assigned', 'accepted', 'picked_up', 'out_for_delivery'] },
    });
    const completedDeliveries = await Delivery.countDocuments({ status: 'delivered' });
    const availablePartners = await User.countDocuments({
      role: 'delivery_partner',
    });

    res.status(200).json({
      success: true,
      data: {
        totalOrders,
        pendingOrders,
        activeDeliveries,
        completedDeliveries,
        availablePartners,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all orders with filters
exports.getAllOrders = async (req, res, next) => {
  try {
    const { status, startDate, endDate, page = 1, limit = 10 } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    const skip = (page - 1) * limit;

    const orders = await Order.find(query)
      .populate('customer', 'name phone')
      .populate('store', 'name')
      .populate('deliveryPartner', 'name phone')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
      success: true,
      data: orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all deliveries
exports.getAllDeliveries = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;

    let query = {};

    if (status) {
      query.status = status;
    }

    const skip = (page - 1) * limit;

    const deliveries = await Delivery.find(query)
      .populate('order')
      .populate('deliveryPartner', 'name phone')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Delivery.countDocuments(query);

    res.status(200).json({
      success: true,
      data: deliveries,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Assign delivery partner to order
exports.assignDeliveryPartner = async (req, res, next) => {
  try {
    const { deliveryPartnerId } = req.body;
    const orderId = req.params.id;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found',
      });
    }

    if (order.status !== 'ready_for_pickup') {
      return res.status(400).json({
        success: false,
        message: 'Order must be ready for pickup',
      });
    }

    const partner = await User.findById(deliveryPartnerId);

    if (!partner || partner.role !== 'delivery_partner') {
      return res.status(404).json({
        success: false,
        message: 'Delivery partner not found',
      });
    }

    const store = await Store.findById(order.store);

    // Create delivery record
    const delivery = await Delivery.create({
      order: orderId,
      deliveryPartner: deliveryPartnerId,
      assignedBy: req.user.id,
      pickupLocation: {
        latitude: store.location.latitude,
        longitude: store.location.longitude,
      },
      deliveryLocation: order.deliveryLocation,
      estimatedTime: order.estimatedDeliveryTime,
      distance: calculateDistance(
        store.location.latitude,
        store.location.longitude,
        order.deliveryLocation.latitude,
        order.deliveryLocation.longitude
      ),
    });

    // Update order
    order.status = 'assigned';
    order.deliveryPartner = deliveryPartnerId;
    await order.save();

    res.status(201).json({
      success: true,
      message: 'Delivery partner assigned',
      data: delivery,
    });
  } catch (error) {
    next(error);
  }
};

// Reassign delivery partner
exports.reassignDeliveryPartner = async (req, res, next) => {
  try {
    const { deliveryPartnerId } = req.body;

    let delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found',
      });
    }

    // Check if already accepted
    if (delivery.status !== 'assigned') {
      return res.status(400).json({
        success: false,
        message: 'Can only reassign assigned deliveries',
      });
    }

    const partner = await User.findById(deliveryPartnerId);

    if (!partner || partner.role !== 'delivery_partner') {
      return res.status(404).json({
        success: false,
        message: 'Delivery partner not found',
      });
    }

    delivery.deliveryPartner = deliveryPartnerId;
    delivery.assignedAt = new Date();
    await delivery.save();

    // Update order
    await Order.findByIdAndUpdate(delivery.order, { deliveryPartner: deliveryPartnerId });

    res.status(200).json({
      success: true,
      message: 'Delivery reassigned',
      data: delivery,
    });
  } catch (error) {
    next(error);
  }
};

// Get all users
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;

    let query = {};

    if (role) {
      query.role = role;
    }

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get all stores
exports.getAllStores = async (req, res, next) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const stores = await Store.find()
      .populate('owner', 'name email phone')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Store.countDocuments();

    res.status(200).json({
      success: true,
      data: stores,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};
