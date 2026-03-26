const User = require('../models/User');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
  try {
    const { name, email, phone, password, location, role } = req.body;
    if (!['farmer', 'buyer'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, phone, password: hashedPassword, location, role });
    await user.save();

    res.status(201).json({ success: true, message: 'Registration successful. Please login.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    req.session.user = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location
    };

    res.json({ success: true, user: req.session.user, message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ success: false, message: 'Logout failed' });
    res.json({ success: true, message: 'Logged out successfully' });
  });
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.session.user.id).select('-password');
    res.json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};