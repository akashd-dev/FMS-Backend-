const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop', required: true },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'delivered'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);