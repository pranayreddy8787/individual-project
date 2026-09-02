const Store = require('../models/Store');
const calculateDistance = require('../utils/calculateDistance');

// Get all stores
exports.getAllStores = async (req, res, next) => {
  try {
    const { latitude, longitude } = req.query;
    let stores = await Store.find({ isOpen: true }).populate('owner', 'name email phone');

    // Filter by distance if location provided
    if (latitude && longitude) {
      stores = stores.filter((store) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          store.location.latitude,
          store.location.longitude
        );
        return distance <= store.deliveryRadius;
      });
    }

    res.status(200).json({
      success: true,
      data: stores,
    });
  } catch (error) {
    next(error);
  }
};

// Get store by ID
exports.getStore = async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.id).populate('owner', 'name email phone');

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found',
      });
    }

    res.status(200).json({
      success: true,
      data: store,
    });
  } catch (error) {
    next(error);
  }
};

// Create store
exports.createStore = async (req, res, next) => {
  try {
    const { name, description, category, phone, address, latitude, longitude, deliveryRadius, minimumOrder } = req.body;

    const store = await Store.create({
      owner: req.user.id,
      name,
      description,
      category,
      phone,
      address,
      location: {
        latitude,
        longitude,
      },
      deliveryRadius,
      minimumOrder,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.status(201).json({
      success: true,
      message: 'Store created successfully',
      data: store,
    });
  } catch (error) {
    next(error);
  }
};

// Update store
exports.updateStore = async (req, res, next) => {
  try {
    let store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found',
      });
    }

    // Verify ownership
    if (store.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this store',
      });
    }

    const updateData = req.body;
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    store = await Store.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Store updated successfully',
      data: store,
    });
  } catch (error) {
    next(error);
  }
};

// Delete store
exports.deleteStore = async (req, res, next) => {
  try {
    const store = await Store.findById(req.params.id);

    if (!store) {
      return res.status(404).json({
        success: false,
        message: 'Store not found',
      });
    }

    // Verify ownership
    if (store.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this store',
      });
    }

    await Store.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Store deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
