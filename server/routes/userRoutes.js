const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const userController = require('../controllers/userController');

const router = express.Router();

router.get('/:id', userController.getUser);
router.put('/:id', authMiddleware, userController.updateUser);
router.get('/nearby/delivery-partners', userController.getNearbyDeliveryPartners);

module.exports = router;
