const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { isAuthenticated } = require('../middleware/authMiddleware');

router.get('/chat/:receiverId', isAuthenticated, messageController.getChatHistory);

module.exports = router;