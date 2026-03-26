const express = require('express');
const router = express.Router();
const cropController = require('../controllers/cropController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.post('/add', isAuthenticated, cropController.uploadMiddleware, cropController.addCrop);
router.get('/my', isAuthenticated, cropController.getMyCrops);
router.get('/all', cropController.getAllCrops);

module.exports = router;