const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a lesson title'],
      trim: true,
    },
    content: {
      type: String,
      default: '',
    },
    videoUrl: {
      type: String,
      default: '',
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    order: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  { timestamps: true }
);

lessonSchema.index({ course: 1, order: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);
