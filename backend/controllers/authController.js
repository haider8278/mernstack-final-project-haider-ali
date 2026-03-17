const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (id, role) => {
  return jwt.sign(
    { id, role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please provide name, email and password.' });
    }
    // Public registration: only student role (instructor/admin created via admin APIs)
    const roleToUse = 'student';
    const existing = await User.findOne({ email: email.trim().toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: roleToUse,
    });
    const token = generateToken(user._id, user.role);
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json({ user: userResponse, token });
  } catch (err) {
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: err.message || 'Validation failed.' });
    }
    res.status(500).json({ message: err.message || 'Server error.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }
    const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password.' });
    }
    const token = generateToken(user._id, user.role);
    const userResponse = user.toObject();
    delete userResponse.password;
    res.json({ user: userResponse, token });
  } catch (err) {
    res.status(500).json({ message: err.message || 'Server error.' });
  }
};

module.exports = { register, login };
