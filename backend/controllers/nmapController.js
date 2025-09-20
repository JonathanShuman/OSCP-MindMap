const NmapScan = require('../models/NmapScan');

// Get all nmap scans
const getNmapScans = async (req, res) => {
  try {
    const scans = await NmapScan.find().sort({ createdAt: -1 });
    res.json(scans);
  } catch (error) {
    console.error('Error fetching nmap scans:', error);
    res.status(500).json({ error: 'Failed to fetch nmap scans' });
  }
};

// Get single nmap scan by ID
const getNmapScanById = async (req, res) => {
  try {
    const scan = await NmapScan.findById(req.params.id);
    if (!scan) {
      return res.status(404).json({ error: 'Nmap scan not found' });
    }
    res.json(scan);
  } catch (error) {
    console.error('Error fetching nmap scan:', error);
    res.status(500).json({ error: 'Failed to fetch nmap scan' });
  }
};

// Save nmap scan results
const saveNmapScan = async (req, res) => {
  try {
    const { target, command, results, scanType, ports, osDetection, scanDuration, notes } = req.body;

    if (!target || !command || !results) {
      return res.status(400).json({ 
        error: 'Target, command, and results are required' 
      });
    }

    const scan = await NmapScan.create({
      target: target.trim(),
      command: command.trim(),
      results: results.trim(),
      scanType: scanType || 'custom',
      ports: ports || [],
      osDetection,
      scanDuration,
      notes
    });

    res.status(201).json({
      message: 'Nmap scan saved successfully',
      scan
    });
  } catch (error) {
    console.error('Error saving nmap scan:', error);
    res.status(500).json({ error: 'Failed to save nmap scan' });
  }
};

// Update nmap scan
const updateNmapScan = async (req, res) => {
  try {
    const { target, command, results, scanType, ports, osDetection, scanDuration, notes } = req.body;

    const scan = await NmapScan.findByIdAndUpdate(
      req.params.id,
      { target, command, results, scanType, ports, osDetection, scanDuration, notes },
      { new: true, runValidators: true }
    );

    if (!scan) {
      return res.status(404).json({ error: 'Nmap scan not found' });
    }

    res.json({
      message: 'Nmap scan updated successfully',
      scan
    });
  } catch (error) {
    console.error('Error updating nmap scan:', error);
    res.status(500).json({ error: 'Failed to update nmap scan' });
  }
};

// Delete nmap scan
const deleteNmapScan = async (req, res) => {
  try {
    const scan = await NmapScan.findByIdAndDelete(req.params.id);

    if (!scan) {
      return res.status(404).json({ error: 'Nmap scan not found' });
    }

    res.json({ message: 'Nmap scan deleted successfully' });
  } catch (error) {
    console.error('Error deleting nmap scan:', error);
    res.status(500).json({ error: 'Failed to delete nmap scan' });
  }
};

// Search nmap scans by target
const searchNmapScans = async (req, res) => {
  try {
    const { target } = req.query;
    
    if (!target) {
      return res.status(400).json({ error: 'Target parameter is required' });
    }

    const scans = await NmapScan.find({
      target: { $regex: target, $options: 'i' }
    }).sort({ createdAt: -1 });

    res.json(scans);
  } catch (error) {
    console.error('Error searching nmap scans:', error);
    res.status(500).json({ error: 'Failed to search nmap scans' });
  }
};

module.exports = {
  getNmapScans,
  getNmapScanById,
  saveNmapScan,
  updateNmapScan,
  deleteNmapScan,
  searchNmapScans
};