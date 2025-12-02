const Product = require('../models/productModel');

// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a Product
exports.getProduct = async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid product ID format' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a Product
exports.createProduct = async (req, res) => {
  try {
    const { name, price, sku, stock } = req.body;
    if (!name || !price || !sku || !stock) {
      return res.status(400).json({ error: 'SKU, name, price and stock are required' });
    }
    const product = new Product({
      sku,
      name,
      price,
      stock,
      supplier: req.supplier._id // logged-in supplier ID
    });
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update a Product
exports.updateProduct = async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid product ID format' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (product.supplier.toString() !== req.supplier._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized action' });
    }

    const { name, price, sku, stock } = req.body;
    if (name) product.name = name;
    if (price) product.price = price;
    if (sku) product.sku = sku;
    if (stock) product.stock = stock;

    const updated = await product.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete a Product
exports.deleteProduct = async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid product ID format' });
    }

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    // Ownership check
    if (product.supplier.toString() !== req.supplier._id.toString()) {
      return res.status(403).json({ error: 'Unauthorized action' });
    }

    await product.deleteOne();
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
