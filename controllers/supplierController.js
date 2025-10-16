const Supplier = require('../models/supplierModel');
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
const supplier = await Supplier.findById(req.params.id);
if (!supplier) return res.status(404).json({ error: 'Supplier not found' });
res.json(supplier);
} catch (err) {
res.status(500).json({ error: err.message });
}
};
// Create supplier
exports.createSupplier = async (req, res) => {
try {
const newSupplier = await Supplier.create(req.body);
res.status(201).json(newSupplier);
} catch (err) {
res.status(500).json({ error: err.message });
}
};
// Update supplier
exports.updateSupplier = async (req, res) => {
try {
const updatedSupplier = await Supplier.findByIdAndUpdate(req.params.id, req.body, { new: true
});
res.json(updatedSupplier);
} catch (err) {
res.status(500).json({ error: err.message });
}
};

// Delete supplier
exports.deleteSupplier = async (req, res) => {
try {
await Supplier.findByIdAndDelete(req.params.id);
res.json({ message: 'Supplier deleted' });
} catch (err) {
   res.status(500).json({ error: err.message });
 }
};