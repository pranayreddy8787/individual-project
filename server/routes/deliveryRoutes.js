const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const deliveryController = require('../controllers/deliveryController');

const router = express.Router();

router.get('/available', deliveryController.getAvailablePartners);
router.get('/my-deliveries', authMiddleware, roleMiddleware('delivery_partner'), deliveryController.getMyDeliveries);
router.put('/:id/accept', authMiddleware, roleMiddleware('delivery_partner'), deliveryController.acceptDelivery);
router.put('/:id/reject', authMiddleware, roleMiddleware('delivery_partner'), deliveryController.rejectDelivery);
router.put('/:id/status', authMiddleware, roleMiddleware('delivery_partner'), deliveryController.updateDeliveryStatus);
router.get('/:id', authMiddleware, deliveryController.getDeliveryDetails);

module.exports = router;
