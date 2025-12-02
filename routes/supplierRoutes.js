const express = require('express');
const router = express.Router();
const supplierController = require('../controllers/supplierController');

router.get('/users', supplierController.getSuppliers);
router.get('/user/:id', supplierController.getSupplier);
router.post('/user', supplierController.createSupplier);
router.post('/login', supplierController.loginSupplier);
router.put('/user/:id', supplierController.updateSupplier);
router.delete('/user/:id', supplierController.deleteSupplier);

module.exports = router;