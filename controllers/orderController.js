const Order = require('../models/Order');
const Crop = require('../models/Crop');

exports.placeOrder = async (req, res) => {
  try {
    const { cropId, quantity } = req.body;
    const crop = await Crop.findById(cropId);
    if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });

    const totalPrice = crop.price * quantity;

    const order = new Order({
      buyerId: req.session.user.id,
      farmerId: crop.farmerId,
      cropId,
      quantity,
      totalPrice
    });

    await order.save();
    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyOrdersAsBuyer = async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.session.user.id })
      .populate('cropId', 'name price image')
      .populate('farmerId', 'name');
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrdersForFarmer = async (req, res) => {
  try {
    const orders = await Order.find({ farmerId: req.session.user.id })
      .populate('cropId', 'name')
      .populate('buyerId', 'name');
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};