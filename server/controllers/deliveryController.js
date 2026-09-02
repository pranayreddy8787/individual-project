const Delivery = require('../models/Delivery');
const Order = require('../models/Order');
const User = require('../models/User');
const calculateDistance = require('../utils/calculateDistance');

// Get available delivery partners for assignment
exports.getAvailablePartners = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude required',
      });
    }

    // Get delivery partners who don't have active deliveries
    const partners = await User.find({
      role: 'delivery_partner',
      'location.latitude': { $exists: true, $ne: null },
      'location.longitude': { $exists: true, $ne: null },
    });

    // Calculate distance for each partner
    const partnersWithDistance = partners.map((partner) => {
      const distance = calculateDistance(
        latitude,
        longitude,
        partner.location.latitude,
        partner.location.longitude
      );
      return {
        ...partner.toObject(),
        distance,
      };
    });

    // Sort by distance
    partnersWithDistance.sort((a, b) => a.distance - b.distance);

    res.status(200).json({
      success: true,
      data: partnersWithDistance,
    });
  } catch (error) {
    next(error);
  }
};

// Get my deliveries
exports.getMyDeliveries = async (req, res, next) => {
  try {
    const deliveries = await Delivery.find({ deliveryPartner: req.user.id })
      .populate('order')
      .populate('deliveryPartner', 'name phone')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: deliveries,
    });
  } catch (error) {
    next(error);
  }
};

// Accept delivery assignment
exports.acceptDelivery = async (req, res, next) => {
  try {
    let delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found',
      });
    }

    if (delivery.deliveryPartner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to accept this delivery',
      });
    }

    if (delivery.status !== 'assigned') {
      return res.status(400).json({
        success: false,
        message: 'Cannot accept delivery in current status',
      });
    }

    delivery.status = 'accepted';
    delivery.acceptedAt = new Date();

    // Update order status
    const order = await Order.findByIdAndUpdate(delivery.order, { status: 'accepted' }, { new: true });

    await delivery.save();

    res.status(200).json({
      success: true,
      message: 'Delivery accepted',
      data: delivery,
    });
  } catch (error) {
    next(error);
  }
};

// Reject delivery assignment
exports.rejectDelivery = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found',
      });
    }

    if (delivery.deliveryPartner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    await Delivery.findByIdAndDelete(req.params.id);

    // Reset order status
    await Order.findByIdAndUpdate(delivery.order, { status: 'ready_for_pickup', deliveryPartner: null });

    res.status(200).json({
      success: true,
      message: 'Delivery rejected',
    });
  } catch (error) {
    next(error);
  }
};

// Update delivery status
exports.updateDeliveryStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = [
      'accepted',
      'picked_up',
      'out_for_delivery',
      'delivered',
      'rejected',
      'failed',
    ];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status',
      });
    }

    let delivery = await Delivery.findById(req.params.id);

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found',
      });
    }

    if (delivery.deliveryPartner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized',
      });
    }

    delivery.status = status;

    if (status === 'picked_up') {
      delivery.pickedUpAt = new Date();
    } else if (status === 'delivered') {
      delivery.deliveredAt = new Date();
    }

    await delivery.save();

    // Update order status
    const statusMap = {
      accepted: 'accepted',
      picked_up: 'picked_up',
      out_for_delivery: 'out_for_delivery',
      delivered: 'delivered',
      failed: 'failed',
    };

    await Order.findByIdAndUpdate(delivery.order, { status: statusMap[status] });

    res.status(200).json({
      success: true,
      message: 'Delivery status updated',
      data: delivery,
    });
  } catch (error) {
    next(error);
  }
};

// Get delivery details
exports.getDeliveryDetails = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id)
      .populate('order')
      .populate('deliveryPartner', 'name phone')
      .populate('assignedBy', 'name');

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found',
      });
    }

    res.status(200).json({
      success: true,
      data: delivery,
    });
  } catch (error) {
    next(error);
  }
};
