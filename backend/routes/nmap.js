const express = require('express');
const router = express.Router();
const {
  getNmapScans,
  getNmapScanById,
  saveNmapScan,
  updateNmapScan,
  deleteNmapScan,
  searchNmapScans
} = require('../controllers/nmapController');

// GET /api/nmap - Get all nmap scans
router.get('/', getNmapScans);

// GET /api/nmap/search - Search nmap scans by target
router.get('/search', searchNmapScans);

// GET /api/nmap/:id - Get single nmap scan
router.get('/:id', getNmapScanById);

// POST /api/nmap - Save new nmap scan
router.post('/', saveNmapScan);

// PUT /api/nmap/:id - Update nmap scan
router.put('/:id', updateNmapScan);

// DELETE /api/nmap/:id - Delete nmap scan
router.delete('/:id', deleteNmapScan);

module.exports = router;