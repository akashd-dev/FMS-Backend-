const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String }, // path like /uploads/filename.jpg
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Crop', cropSchema);