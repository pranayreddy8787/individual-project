const Product = require('../models/Product');
const Store = require('../models/Store');

// Get all products
exports.getAllProducts = async (req, res, next) => {
  try {
    const { storeId } = req.query;
    let query = { isAvailable: true };

    if (storeId) {
      query.store = storeId;
    }

    const products = await Product.find(query)
      .populate('store', 'name category')
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// Get product by ID
exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('store', 'name');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Create product
exports.createProduct = async (req, res, next) => {
  try {
    const { name, description, category, price, stock, storeId } = req.body;

    // Verify store ownership
    const store = await Store.findById(storeId);
    if (!store || store.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add products to this store',
      });
    }

    const product = await Product.create({
      store: storeId,
      name,
      description,
      category,
      price,
      stock,
      image: req.file ? `/uploads/${req.file.filename}` : null,
    });

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Update product
exports.updateProduct = async (req, res, next) => {
  try {
    let product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Verify store ownership
    const store = await Store.findById(product.store);
    if (store.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this product',
      });
    }

    const updateData = req.body;
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    product = await Product.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// Delete product
exports.deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    // Verify store ownership
    const store = await Store.findById(product.store);
    if (store.owner.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this product',
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Product deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};
