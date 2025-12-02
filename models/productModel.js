const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    sku: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    stock: { type: Number, required: true },

    supplier: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Supplier', 
        required: true 
    }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
