const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const upload = require('../middleware/uploadMiddleware');
const productController = require('../controllers/productController');

const router = express.Router();

router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProduct);
router.post('/', authMiddleware, roleMiddleware('store'), upload.single('image'), productController.createProduct);
router.put('/:id', authMiddleware, roleMiddleware('store'), upload.single('image'), productController.updateProduct);
router.delete('/:id', authMiddleware, roleMiddleware('store'), productController.deleteProduct);

module.exports = router;
