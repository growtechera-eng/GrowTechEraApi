require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

const seed = async () => {
  await connectDB();
  const existing = await User.findOne({ email: 'admin@growtechera.com' });
  if (existing) { console.log('Admin exists'); process.exit(0); }

  const hashed = await bcrypt.hash('AdminPass123', 10);
  const user = await User.create({ name: 'Admin', email: 'admin@growtechera.com', password: hashed, role: 'admin' });
  console.log('Admin created', user.email);
  process.exit(0);
};

seed();
