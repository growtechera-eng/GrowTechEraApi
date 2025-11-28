const Course = require('../models/Course');

exports.createCourse = async (req, res) => {
  try {
    const { title, description, duration } = req.body;
    const newCourse = await Course.create({ title, description, duration });

    res.status(201).json({ message: 'Course Created Successfully', course: newCourse });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
