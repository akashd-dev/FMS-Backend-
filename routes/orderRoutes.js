const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.post('/place', isAuthenticated, orderController.placeOrder);
router.get('/my', isAuthenticated, orderController.getMyOrdersAsBuyer);
router.get('/farmer', isAuthenticated, orderController.getOrdersForFarmer);

module.exports = router;