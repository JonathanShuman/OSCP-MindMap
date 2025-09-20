const mongoose = require('mongoose');

const checklistItemSchema = new mongoose.Schema({
  itemId: {
    type: Number,
    required: true
  },
  checked: {
    type: Boolean,
    default: false
  },
  notes: {
    type: String,
    default: ''
  }
});

const webAppChecklistSchema = new mongoose.Schema({
  target: {
    type: String,
    required: [true, 'Target IP/URL is required'],
    trim: true,
    index: true
  },
  items: [checklistItemSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
webAppChecklistSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create compound index for efficient queries
webAppChecklistSchema.index({ target: 1, updatedAt: -1 });

const WebAppChecklist = mongoose.model('WebAppChecklist', webAppChecklistSchema);

module.exports = WebAppChecklist;