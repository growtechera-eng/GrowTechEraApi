const express = require('express');
const router = express.Router();
const { register, login, me } = require('../controllers/authController');
const auth = require('../middlewares/authMiddleware');

router.post('/register', register);
// router.post("/register",register, async (req, res) => {
//   const { username, email, password, role } = req.body;

//   try {
//     const newUser = new User({
//       username,
//       email,
//       password,
//       role: role || "student"    // default student
//     });

//     await newUser.save();
//     res.status(201).json({ message: "User registered successfully" });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Registration failed" });
//   }
// });

router.post('/login', login);
router.get('/me', auth, me);

module.exports = router;
