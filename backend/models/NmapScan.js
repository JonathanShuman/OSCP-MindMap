const mongoose = require('mongoose');

const nmapScanSchema = new mongoose.Schema({
  target: {
    type: String,
    required: true,
    trim: true
  },
  command: {
    type: String,
    required: true,
    trim: true
  },
  results: {
    type: String,
    required: true
  },
  scanType: {
    type: String,
    enum: ['basic', 'service', 'aggressive', 'stealth', 'custom'],
    default: 'custom'
  },
  ports: [{
    port: Number,
    state: String,
    service: String,
    version: String
  }],
  osDetection: {
    type: String,
    required: false
  },
  scanDuration: {
    type: String,
    required: false
  },
  notes: {
    type: String,
    required: false,
    trim: true
  }
}, {
  timestamps: true
});

// Index for better search performance
nmapScanSchema.index({ target: 1 });
nmapScanSchema.index({ scanType: 1 });
nmapScanSchema.index({ createdAt: -1 });

module.exports = mongoose.model('NmapScan', nmapScanSchema);