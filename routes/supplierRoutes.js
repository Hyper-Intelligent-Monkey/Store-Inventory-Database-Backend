const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');
const auth = require('../middleware/authMiddleware');

router.get('/users', supplierController.getSuppliers);
router.get('/user/:id', supplierController.getSupplier);
router.post('/user', supplierController.createSupplier);
router.post('/login', supplierController.loginSupplier);
//router.put('/user/:id', supplierController.updateSupplier);
router.delete('/my-account', auth, supplierController.deleteSupplier);

module.exports = router;