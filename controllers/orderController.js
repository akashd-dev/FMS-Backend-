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
      .populate('farmerId', 'name location')   // Important
      .populate('cropId', 'name');
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getOrdersForFarmer = async (req, res) => {
  try {
    const orders = await Order.find({ farmerId: req.session.user.id })
      .populate('buyerId', 'name location')   // Important: populate buyer details
      .populate('cropId', 'name');
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Get buyers who ordered from this farmer
exports.getMyBuyers = async (req, res) => {
  try {
    const farmerId = req.session.user.id;

    const orders = await Order.find({ farmer: farmerId })
      .populate('buyer', 'name email location');

    // Remove duplicates buyers
    const buyersMap = new Map();

    orders.forEach(order => {
      if (order.buyer) {
        buyersMap.set(order.buyer._id.toString(), order.buyer);
      }
    });

    const buyers = Array.from(buyersMap.values());

    res.json({ buyers });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching buyers' });
  }
};
