const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const { auth } = require('../middlewares/authMiddleware');

router.post('/', auth, async (req, res) => {
  const { courseId } = req.body;
  const existing = await Enrollment.findOne({ user: req.user.id, course: courseId });
  if (existing) return res.status(400).json({ message: 'Already enrolled' });
  const enroll = await Enrollment.create({ user: req.user.id, course: courseId });
  res.status(201).json(enroll);
});

router.get('/me', auth, async (req, res) => {
  const list = await Enrollment.find({ user: req.user.id }).populate('course');
  res.json(list);
});

module.exports = router;
