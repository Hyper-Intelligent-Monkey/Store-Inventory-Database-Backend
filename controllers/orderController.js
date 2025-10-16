const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// Get all Orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('items.productId')
      .populate('supplierId');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get an Order
exports.getOrder = async (req, res) => {
try {
const order = await Order.findById(req.params.id);
if (!order) return res.status(404).json({ error: 'Order not found' });
res.json(order);
} catch (err) {
res.status(500).json({ error: err.message });
}
};

// Create an Order
exports.createOrder = async (req, res) => {
  try {
    const { items, supplierId } = req.body;

    const populatedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error('Product not found');
        const totalPrice = product.price * item.qty; // Multiply the product price to the item quantity to provide the order price

        return {
          productId: item.productId,
          qty: item.qty,
          price: totalPrice
        };
      })
    );

    const newOrder = new Order({ // Updates the order with the correct price
      items: populatedItems,
      supplierId
    });

    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an Order
exports.updateOrder = async (req, res) => {
  try {
    const updated = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete an Order
exports.deleteOrder = async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
