const Cart = require('../models/Cart');
const Product = require('../models/Product');

// Get cart
exports.getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ customer: req.user.id }).populate({
      path: 'items.product',
      select: 'name price image',
    });

    if (!cart) {
      cart = await Cart.create({ customer: req.user.id });
    }

    res.status(200).json({
      success: true,
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// Add to cart
exports.addToCart = async (req, res, next) => {
  try {
    const { productId, quantity, storeId } = req.body;

    // Verify product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found',
      });
    }

    let cart = await Cart.findOne({ customer: req.user.id });

    if (!cart) {
      cart = await Cart.create({ customer: req.user.id });
    }

    // Check if product already in cart
    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Update quantity
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Add new item
      cart.items.push({
        product: productId,
        quantity,
        price: product.price,
        store: storeId,
      });
    }

    // Calculate total
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item added to cart',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// Update cart item
exports.updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;

    let cart = await Cart.findOne({ customer: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const item = cart.items.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    if (quantity <= 0) {
      // Remove item
      item.remove();
    } else {
      item.quantity = quantity;
    }

    // Recalculate total
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Cart updated',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// Remove from cart
exports.removeFromCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ customer: req.user.id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found',
      });
    }

    const item = cart.items.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Item not found in cart',
      });
    }

    item.remove();

    // Recalculate total
    cart.totalAmount = cart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    await cart.save();

    res.status(200).json({
      success: true,
      message: 'Item removed from cart',
      data: cart,
    });
  } catch (error) {
    next(error);
  }
};

// Clear cart
exports.clearCart = async (req, res, next) => {
  try {
    await Cart.findOneAndUpdate(
      { customer: req.user.id },
      { items: [], totalAmount: 0 },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Cart cleared',
    });
  } catch (error) {
    next(error);
  }
};
