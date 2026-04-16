const express = require('express');
const router = express.Router();
const contactController = require('../controllers/contactController');

// CRUD operations
router.post('/', contactController.createContact);
router.get('/', contactController.getAllContacts);
router.get('/search', contactController.searchContacts);
router.get('/search/by-name', contactController.searchByName);
router.get('/search/by-phone', contactController.searchByPhone);
router.get('/search/by-email', contactController.searchByEmail);
router.get('/:id', contactController.getContactById);
router.put('/:id', contactController.updateContact);
router.delete('/:id', contactController.deleteContact);

// Merge operation
router.post('/merge', contactController.mergeContacts);

module.exports = router;
