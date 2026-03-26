const isAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ success: false, message: 'Unauthorized. Please login.' });
};

const isAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Access denied. Admin only.' });
};

module.exports = { isAuthenticated, isAdmin };