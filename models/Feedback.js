const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Feedback title is required'],
      trim: true,
      minlength: [3, 'Title must be at least 3 characters'],
      maxlength: [100, 'Title cannot exceed 100 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['bug', 'feature', 'improvement', 'general'],
      default: 'general'
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      minlength: [10, 'Description must be at least 10 characters'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5']
    }
  },
  {
    timestamps: true
  }
);

// Virtual field to check if feedback is editable (within 15 minutes)
feedbackSchema.virtual('isEditable').get(function () {
  const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds
  const now = new Date();
  const createdAt = new Date(this.createdAt);
  return (now - createdAt) <= fifteenMinutes;
});

// Method to check if feedback can be edited
feedbackSchema.methods.canEdit = function () {
  const fifteenMinutes = 15 * 60 * 1000; // 15 minutes in milliseconds
  const now = new Date();
  const createdAt = new Date(this.createdAt);
  return (now - createdAt) <= fifteenMinutes;
};

// Include virtuals when converting to JSON
feedbackSchema.set('toJSON', { virtuals: true });
feedbackSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Feedback', feedbackSchema);
