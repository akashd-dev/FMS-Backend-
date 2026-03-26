const User = require('../models/User');
const Crop = require('../models/Crop');
const Order = require('../models/Order');

exports.getDashboardStats = async (req, res) => {
  try {
    const farmers = await User.countDocuments({ role: 'farmer' });
    const buyers = await User.countDocuments({ role: 'buyer' });
    const crops = await Crop.countDocuments();
    const orders = await Order.countDocuments();

    res.json({ success: true, stats: { farmers, buyers, crops, orders } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllFarmers = async (req, res) => {
  const farmers = await User.find({ role: 'farmer' }).select('-password');
  res.json({ success: true, farmers });
};

exports.getAllBuyers = async (req, res) => {
  const buyers = await User.find({ role: 'buyer' }).select('-password');
  res.json({ success: true, buyers });
};

exports.deleteUser = async (req, res) => {
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'User deleted' });
};

exports.deleteCrop = async (req, res) => {
  await Crop.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Crop deleted' });
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate('buyerId farmerId cropId', 'name email');
  res.json({ success: true, orders });
};