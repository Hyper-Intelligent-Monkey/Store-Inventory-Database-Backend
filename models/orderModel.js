const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
            qty: { type: Number, required: true },
            price: { type: Number}
        }
    ],
    supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
    status: { type: String, enum: ['pending', 'ordered', 'canceled'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);
