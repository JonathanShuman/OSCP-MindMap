const Credential = require('../models/Credential');

// Get all credentials
const getCredentials = async (req, res) => {
  try {
    const credentials = await Credential.find().sort({ createdAt: -1 });
    res.json(credentials);
  } catch (error) {
    console.error('Error fetching credentials:', error);
    res.status(500).json({ error: 'Failed to fetch credentials' });
  }
};

// Get single credential by ID
const getCredentialById = async (req, res) => {
  try {
    const credential = await Credential.findById(req.params.id);
    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }
    res.json(credential);
  } catch (error) {
    console.error('Error fetching credential:', error);
    res.status(500).json({ error: 'Failed to fetch credential' });
  }
};

// Create or update credentials
const saveCredentials = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim() === '') {
      return res.status(400).json({ error: 'Content is required' });
    }

    // For now, we'll just save the content as one document
    // In the future, you could parse the content to extract individual credentials
    let credential = await Credential.findOne();
    
    if (credential) {
      credential.content = content.trim();
      credential = await credential.save();
    } else {
      credential = await Credential.create({
        content: content.trim()
      });
    }

    res.json({ 
      message: 'Credentials saved successfully',
      credential 
    });
  } catch (error) {
    console.error('Error saving credentials:', error);
    res.status(500).json({ error: 'Failed to save credentials' });
  }
};

// Create new credential entry
const createCredential = async (req, res) => {
  try {
    const { username, password, host, service, notes, content } = req.body;

    const credential = await Credential.create({
      username,
      password,
      host,
      service,
      notes,
      content: content || `${username}:${password}@${host}:${service}`
    });

    res.status(201).json({
      message: 'Credential created successfully',
      credential
    });
  } catch (error) {
    console.error('Error creating credential:', error);
    res.status(500).json({ error: 'Failed to create credential' });
  }
};

// Update credential
const updateCredential = async (req, res) => {
  try {
    const { username, password, host, service, notes, content } = req.body;

    const credential = await Credential.findByIdAndUpdate(
      req.params.id,
      { username, password, host, service, notes, content },
      { new: true, runValidators: true }
    );

    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }

    res.json({
      message: 'Credential updated successfully',
      credential
    });
  } catch (error) {
    console.error('Error updating credential:', error);
    res.status(500).json({ error: 'Failed to update credential' });
  }
};

// Delete credential
const deleteCredential = async (req, res) => {
  try {
    const credential = await Credential.findByIdAndDelete(req.params.id);

    if (!credential) {
      return res.status(404).json({ error: 'Credential not found' });
    }

    res.json({ message: 'Credential deleted successfully' });
  } catch (error) {
    console.error('Error deleting credential:', error);
    res.status(500).json({ error: 'Failed to delete credential' });
  }
};

module.exports = {
  getCredentials,
  getCredentialById,
  saveCredentials,
  createCredential,
  updateCredential,
  deleteCredential
};