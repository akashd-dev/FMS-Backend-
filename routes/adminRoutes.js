const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { isAdmin } = require('../middleware/authMiddleware');

router.get('/stats', isAdmin, adminController.getDashboardStats);
router.get('/farmers', isAdmin, adminController.getAllFarmers);
router.get('/buyers', isAdmin, adminController.getAllBuyers);
router.delete('/user/:id', isAdmin, adminController.deleteUser);
router.delete('/crop/:id', isAdmin, adminController.deleteCrop);
router.get('/orders', isAdmin, adminController.getAllOrders);

module.exports = router;