const express = require('express');
const router = express.Router();
const inquiryController = require('../controllers/inquiryController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.post('/', isAuthenticated, inquiryController.createInquiry);
router.get('/farmer', isAuthenticated, inquiryController.getFarmerInquiries);
router.get('/buyer', isAuthenticated, inquiryController.getBuyerInquiries);
router.post('/reply', isAuthenticated, inquiryController.replyToInquiry);

module.exports = router;