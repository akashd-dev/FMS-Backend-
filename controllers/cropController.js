const Crop = require('../models/Crop');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only images allowed'));
  }
});

exports.uploadMiddleware = upload.single('image');

exports.addCrop = async (req, res) => {
  try {
    const { name, price, quantity, description } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : null;

    const crop = new Crop({
      farmerId: req.session.user.id,
      name,
      price,
      quantity,
      description,
      image
    });

    await crop.save();
    res.status(201).json({ success: true, crop });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMyCrops = async (req, res) => {
  try {
    const crops = await Crop.find({ farmerId: req.session.user.id });
    res.json({ success: true, crops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getAllCrops = async (req, res) => {
  try {
    const { search, minPrice, maxPrice, location } = req.query;
    let query = {};

    if (search) query.name = { $regex: search, $options: 'i' };
    if (minPrice) query.price = { ...query.price, $gte: Number(minPrice) };
    if (maxPrice) query.price = { ...query.price, $lte: Number(maxPrice) };
    if (location) query['farmer.location'] = { $regex: location, $options: 'i' }; // join if needed

    const crops = await Crop.find(query).populate('farmerId', 'name location');
    res.json({ success: true, crops });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};