const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');

const orderController = require('../controllers/orderController');

router.get('/orders', auth, orderController.getAllOrders);
router.get('/order/:id', auth, orderController.getOrder);
router.post('/order', auth, orderController.createOrder);
router.put('/order/:id', auth, orderController.updateOrder);
router.delete('/order/:id', auth, orderController.deleteOrder);

module.exports = router;
