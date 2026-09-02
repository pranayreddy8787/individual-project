const User = require('../models/User');

// Get user by ID
exports.getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Update user
exports.updateUser = async (req, res, next) => {
  try {
    // Prevent password update
    const { password, ...updateData } = req.body;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'User updated successfully',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// Get delivery partners nearby
exports.getNearbyDeliveryPartners = async (req, res, next) => {
  try {
    const { latitude, longitude, radius = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude required',
      });
    }

    // Simple proximity search (can be improved with geospatial queries)
    const partners = await User.find({
      role: 'delivery_partner',
      'location.latitude': {
        $gte: latitude - radius / 111,
        $lte: latitude + radius / 111,
      },
      'location.longitude': {
        $gte: longitude - radius / (111 * Math.cos(latitude * Math.PI / 180)),
        $lte: longitude + radius / (111 * Math.cos(latitude * Math.PI / 180)),
      },
    });

    res.status(200).json({
      success: true,
      data: partners,
    });
  } catch (error) {
    next(error);
  }
};
