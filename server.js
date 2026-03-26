const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');

const User = require('./models/User');
const bcrypt = require('bcryptjs');
const dashboardRoutes = require('./routes/dashboardRoutes');
dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
    credentials: true
  }
});

app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded images
app.use('/uploads', express.static('uploads'));

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,        // set true in production with HTTPS
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000
  }
}));

// MongoDB Connection + Default Admin
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log('✅ MongoDB connected');

    // Create default admin if not exists
    const adminExists = await User.findOne({ email: 'admin@admin.com' });
    if (!adminExists) {
      const hashed = await bcrypt.hash('admin123', 10);
      await new User({
        name: 'Super Admin',
        email: 'admin@admin.com',
        phone: '0000000000',
        password: hashed,
        location: 'Jamshedpur',
        role: 'admin'
      }).save();
      console.log('✅ Default admin created: admin@admin.com / admin123');
    }
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/crops', require('./routes/cropRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));
app.use('/api/weather', require('./routes/weatherRoutes'));
app.use('/api/dashboard', dashboardRoutes);

// Socket.IO Real-time Chat
io.on('connection', (socket) => {
  console.log('🔌 User connected to socket');

  socket.on('joinChat', ({ senderId, receiverId }) => {
    const room = [senderId, receiverId].sort().join('-');
    socket.join(room);
    console.log(`Joined room: ${room}`);
  });

  socket.on('sendMessage', async (data) => {
    const { senderId, receiverId, message } = data;
    try {
      const newMsg = new Message({ senderId, receiverId, message });
      await newMsg.save();

      const room = [senderId, receiverId].sort().join('-');
      io.to(room).emit('receiveMessage', newMsg);
    } catch (err) {
      console.error('Message save error:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('🔌 User disconnected');
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});