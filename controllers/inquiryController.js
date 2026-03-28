const Inquiry = require('../models/Inquiry');
const Crop = require('../models/Crop');

// Buyer sends inquiry on a crop
exports.createInquiry = async (req, res) => {
  try {
    const { cropId, message } = req.body;
    const crop = await Crop.findById(cropId);
    
    if (!crop) return res.status(404).json({ success: false, message: 'Crop not found' });

    const inquiry = new Inquiry({
      cropId,
      buyerId: req.session.user.id,
      farmerId: crop.farmerId,
      message
    });

    await inquiry.save();
    res.status(201).json({ success: true, inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Farmer gets all his inquiries
exports.getFarmerInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ farmerId: req.session.user.id })
      .populate('buyerId', 'name location')
      .populate('cropId', 'name price')
      .sort({ createdAt: -1 });
    res.json({ success: true, inquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Buyer gets his inquiries
exports.getBuyerInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.find({ buyerId: req.session.user.id })
      .populate('farmerId', 'name location')
      .populate('cropId', 'name price')
      .sort({ createdAt: -1 });
    res.json({ success: true, inquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Reply to inquiry (both can reply)
exports.replyToInquiry = async (req, res) => {
  try {
    const { inquiryId, message } = req.body;
    const inquiry = await Inquiry.findById(inquiryId);

    if (!inquiry) return res.status(404).json({ success: false, message: 'Inquiry not found' });

    inquiry.replies.push({
      senderId: req.session.user.id,
      message
    });

    if (inquiry.status === 'pending') inquiry.status = 'replied';

    await inquiry.save();
    res.json({ success: true, inquiry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

