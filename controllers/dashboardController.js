const Crop = require('../models/Crop');
const Order = require('../models/Order');

exports.getDashboardStats = async (req, res) => {
  try {
    const farmerId = req.user.id;

    // 🌱 Crops
    const totalCrops = await Crop.countDocuments({ farmer: farmerId });
    const activeCrops = await Crop.countDocuments({ farmer: farmerId, status: 'active' });

    // 📦 Orders
    const totalOrders = await Order.countDocuments({ farmer: farmerId });
    const pendingOrders = await Order.countDocuments({ farmer: farmerId, status: 'pending' });

    // 💰 Profit
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const todayOrders = await Order.find({
      farmer: farmerId,
      status: 'completed',
      createdAt: { $gte: today }
    });

    const yesterdayOrders = await Order.find({
      farmer: farmerId,
      status: 'completed',
      createdAt: { 
        $gte: yesterday, 
        $lt: today 
      }
    });

    const todayProfit = todayOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const yesterdayProfit = yesterdayOrders.reduce((sum, o) => sum + o.totalAmount, 0);

    res.json({
      success: true,
      totalCrops,
      activeCrops,
      totalOrders,
      pendingOrders,
      todayProfit,
      yesterdayProfit
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Dashboard stats error'
    });
  }
};