const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const orderController = require('../controllers/orderController');

const router = express.Router();

router.post('/', authMiddleware, roleMiddleware('customer'), orderController.createOrder);
router.get('/', authMiddleware, orderController.getCustomerOrders);
router.get('/:id', authMiddleware, orderController.getOrder);
router.put('/:id/status', authMiddleware, orderController.updateOrderStatus);
router.put('/:id/cancel', authMiddleware, roleMiddleware('customer'), orderController.cancelOrder);
router.get('/store/orders', authMiddleware, roleMiddleware('store'), orderController.getStoreOrders);

module.exports = router;
