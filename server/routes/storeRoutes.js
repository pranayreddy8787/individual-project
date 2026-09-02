const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');
const storeController = require('../controllers/storeController');

const router = express.Router();

router.get('/', storeController.getAllStores);
router.get('/:id', storeController.getStore);
router.post('/', authMiddleware, roleMiddleware('store'), upload.single('image'), storeController.createStore);
router.put('/:id', authMiddleware, roleMiddleware('store'), upload.single('image'), storeController.updateStore);
router.delete('/:id', authMiddleware, roleMiddleware('store'), storeController.deleteStore);

module.exports = router;
