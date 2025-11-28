const express = require('express');
const Course = require('../models/Course');
const verifyToken = require('../middlewares/authMiddleware');
const { requireRole } = require('../middlewares/roleMiddleware');

const router = express.Router();

// Create Course - Protected Route
router.post("/create", verifyToken, requireRole("admin", "instructor") ,async (req, res) => {
  try {
    const { title, description, price, duration } = req.body;

    if (!title || !description || !price || !duration) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newCourse = await Course.create({
      title,
      description,
      price,
      duration,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating course", error: error.message });
  }
});

// Get All Courses (Public route - no token required)
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find().populate("createdBy", "name email");

    res.status(200).json({
      message: "Courses fetched successfully",
      total: courses.length,
      courses,
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error: error.message });
  }
});

// =============================
// GET Course by ID (Public)
// =============================
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const course = await Course.findById(id).populate("createdBy", "name email");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.status(200).json({
      message: "Course fetched successfully",
      course,
    });

  } catch (error) {
    res.status(500).json({ message: "Error fetching the course", error: error.message });
  }
});

// =============================
// UPDATE Course (Protected)
// =============================
router.put("/:id", verifyToken, requireRole("admin", "instructor"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, price, duration } = req.body;

    // Find course by ID
    const course = await Course.findById(id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if logged-in user is the creator of the course
    if (course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied. You can update only your created courses." });
    }

    // Update fields
    course.title = title || course.title;
    course.description = description || course.description;
    course.price = price || course.price;
    course.duration = duration || course.duration;

    await course.save();

    res.status(200).json({
      message: "Course updated successfully",
      course,
    });

  } catch (error) {
    res.status(500).json({ message: "Error updating course", error: error.message });
  }
});

router.delete("/:id", verifyToken, requireRole("admin") , async (req, res) => {
  try {
    const courseId = req.params.id;
    // Find course by ID
    const course = await Course.findById(courseId );

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if logged-in user is the creator of the course
    if (course.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Access denied. You can delete only your created courses." });
    }

await Course.findByIdAndDelete(courseId);

    res.status(200).json({
      message: "Course deleted successfully",
      course,
    });

  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error: error.message , error: error.stack });
  }
});

module.exports = router;
