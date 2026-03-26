const Message = require('../models/Message');

exports.getChatHistory = async (req, res) => {
  const { receiverId } = req.params;
  const messages = await Message.find({
    $or: [
      { senderId: req.session.user.id, receiverId },
      { senderId: receiverId, receiverId: req.session.user.id }
    ]
  }).sort({ createdAt: 1 });

  res.json({ success: true, messages });
};