const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const productController = require('../controllers/productController');

router.get('/products', auth, productController.getAllProducts);
router.get('/product/:id', productController.getProduct);
router.post('/product', auth, productController.createProduct);  // Protected
router.put('/product/:id', auth, productController.updateProduct);
router.delete('/product/:id', auth, productController.deleteProduct);

module.exports = router;
