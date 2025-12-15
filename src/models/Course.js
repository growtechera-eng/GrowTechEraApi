const mongoose = require('mongoose');
const slugify = require('slugify');

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: String, required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    //slug: { type: String, required: true, unique: true },
    //slug: { type: String, default: null }
    //slug: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Course', courseSchema);
