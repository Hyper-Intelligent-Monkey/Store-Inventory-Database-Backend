const Supplier = require('../models/supplierModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Get all suppliers
exports.getSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.find();
    res.json(suppliers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get supplier by ID
exports.getSupplier = async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid supplier ID format' });
    }

    const supplier = await Supplier.findById(req.params.id);
    if (!supplier) return res.status(404).json({ error: 'Supplier not found' });

    res.json(supplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create supplier (register)
exports.createSupplier = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // check if email exists
    const existing = await Supplier.findOne({ email });
    if (existing) return res.status(409).json({ error: 'Email already registered' });

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newSupplier = await Supplier.create({
      email,
      password: hashedPassword
    });

    res.status(201).json(newSupplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login supplier
exports.loginSupplier = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const supplier = await Supplier.findOne({ email });
    if (!supplier) return res.status(404).json({ error: 'Account not found' });

    const match = await bcrypt.compare(password, supplier.password);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign(
      { id: supplier._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    res.json({
      message: 'Login successful',
      token,
      supplier: {
        _id: supplier._id,
        email: supplier.email
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update supplier
exports.updateSupplier = async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid supplier ID format' });
    }

    const updatedSupplier = await Supplier.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedSupplier);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete supplier
exports.deleteSupplier = async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid supplier ID format' });
    }

    await Supplier.findByIdAndDelete(req.params.id);
    res.json({ message: 'Supplier deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
