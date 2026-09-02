const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const cartController = require('../controllers/cartController');

const router = express.Router();

router.get('/', authMiddleware, cartController.getCart);
router.post('/', authMiddleware, cartController.addToCart);
router.put('/:itemId', authMiddleware, cartController.updateCartItem);
router.delete('/:itemId', authMiddleware, cartController.removeFromCart);
router.delete('/', authMiddleware, cartController.clearCart);

module.exports = router;
