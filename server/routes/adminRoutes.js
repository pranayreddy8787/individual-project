const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const adminController = require('../controllers/adminController');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authMiddleware, roleMiddleware('admin'));

router.get('/dashboard', adminController.getDashboard);
router.get('/orders', adminController.getAllOrders);
router.get('/deliveries', adminController.getAllDeliveries);
router.put('/orders/:id/assign', adminController.assignDeliveryPartner);
router.put('/deliveries/:id/reassign', adminController.reassignDeliveryPartner);
router.get('/users', adminController.getAllUsers);
router.get('/stores', adminController.getAllStores);

module.exports = router;
