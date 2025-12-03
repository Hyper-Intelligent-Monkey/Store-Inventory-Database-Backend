const Order = require('../models/orderModel');
const Product = require('../models/productModel');

// Pending Order
exports.getMyPendingOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ supplierId: req.supplier._id, status: "pending" })
      .populate('items.productId'); // populate product details if needed

    if (!order) return res.status(404).json({ message: "No pending order" });

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all Orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get an Order
exports.getOrder = async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid order ID format" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.supplierId.toString() !== req.supplier._id.toString()) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create an Order
exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || !items.length) {
      return res.status(400).json({ error: "Order items required" });
    }
    let order = await Order.findOne({ supplierId: req.supplier._id, status: "pending" });

    const populatedItems = await Promise.all(
      items.map(async (item) => {
        const product = await Product.findById(item.productId);
        if (!product) throw new Error("Product not found");

        return {
          productId: item.productId,
          qty: item.qty,
          price: product.price * item.qty
        };
      })
    );

    if (order) {
      populatedItems.forEach(newItem => {
        const existingItem = order.items.find(i => i.productId.toString() === newItem.productId.toString());
        if (existingItem) {
          existingItem.qty += newItem.qty;
          existingItem.price += newItem.price;
        } else {
          order.items.push(newItem);
        }
      });

      await order.save();
    } else {
      order = new Order({
        items: populatedItems,
        supplierId: req.supplier._id
      });
      await order.save();
    }

    res.status(201).json(order);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Update an Order
exports.updateOrder = async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: 'Invalid order ID format' });
    }

    const { items, supplierId, status } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Update items if provided
    if (items && items.length) {
      order.items = await Promise.all(
        items.map(async (item) => {
          const productId = item.productId || order.items.find(i => i._id.equals(item._id))?.productId;
          if (!productId) throw new Error('productId is required for each item');

          const product = await Product.findById(productId);
          if (!product) throw new Error('Product not found');

          const qty = item.qty ?? order.items.find(i => i._id.equals(item._id))?.qty;
          return {
            productId,
            qty,
            price: product.price * qty
          };
        })
      );
    }

    if (supplierId) order.supplierId = supplierId;
    if (status) order.status = status;

    await order.save();

    const populatedOrder = await Order.findById(order._id)

    res.json(populatedOrder);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete an Order
exports.deleteOrder = async (req, res) => {
  try {
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid order ID format" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: "Order not found" });

    if (order.supplierId.toString() !== req.supplier._id.toString()) {
      return res.status(403).json({ error: "Unauthorized action" });
    }

    await order.deleteOne();
    res.json({ message: "Order deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Remove Item from Order Pending
exports.removeOrderItem = async (req, res) => {
  try {
    const { orderId, productId } = req.params;

    const order = await Order.findById(orderId);
    if (!order) return res.status(404).json({ message: "Order not found" });

    // remove item
    order.items = order.items.filter(
      item => item.productId.toString() !== productId
    );

    await order.save();

    res.json({ message: "Item removed", order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
