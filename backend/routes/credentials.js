const express = require('express');
const router = express.Router();
const {
  getCredentials,
  getCredentialById,
  saveCredentials,
  createCredential,
  updateCredential,
  deleteCredential
} = require('../controllers/credentialsController');

// GET /api/credentials - Get all credentials
router.get('/', getCredentials);

// GET /api/credentials/:id - Get single credential
router.get('/:id', getCredentialById);

// POST /api/credentials/save - Save/update credentials (for text area)
router.post('/save', saveCredentials);

// POST /api/credentials - Create new credential
router.post('/', createCredential);

// PUT /api/credentials/:id - Update credential
router.put('/:id', updateCredential);

// DELETE /api/credentials/:id - Delete credential
router.delete('/:id', deleteCredential);

module.exports = router;