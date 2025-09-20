const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
  username: {
    type: String,
    required: false,
    trim: true
  },
  password: {
    type: String,
    required: false,
    trim: true
  },
  host: {
    type: String,
    required: false,
    trim: true
  },
  service: {
    type: String,
    required: false,
    trim: true
  },
  notes: {
    type: String,
    required: false,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Index for better search performance
credentialSchema.index({ host: 1, service: 1 });
credentialSchema.index({ username: 1 });

module.exports = mongoose.model('Credential', credentialSchema);