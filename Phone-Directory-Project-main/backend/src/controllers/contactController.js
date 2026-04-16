const db = require('../models/database');

// Create a new contact
exports.createContact = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, address, city, state, zipCode, country, birthDate, notes } = req.body;

    // Validate required fields
    if (!firstName) {
      return res.status(400).json({ error: 'First name is required' });
    }

    const sql = `
      INSERT INTO contacts (firstName, lastName, email, phone, address, city, state, zipCode, country, birthDate, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await db.run(sql, [
      firstName,
      lastName || null,
      email || null,
      phone || null,
      address || null,
      city || null,
      state || null,
      zipCode || null,
      country || null,
      birthDate || null,
      notes || null
    ]);

    res.status(201).json({
      message: 'Contact created successfully',
      id: result.id
    });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Email or phone number already exists' });
    }
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get all contacts
exports.getAllContacts = async (req, res) => {
  try {
    const contacts = await db.all('SELECT * FROM contacts ORDER BY firstName, lastName');
    res.json({
      total: contacts.length,
      contacts
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Get contact by ID
exports.getContactById = async (req, res) => {
  try {
    const { id } = req.params;
    const contact = await db.get('SELECT * FROM contacts WHERE id = ?', [id]);

    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    res.json(contact);
  } catch (error) {
    console.error('Error fetching contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Search contacts by name, email, or phone
exports.searchContacts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === '') {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const searchTerm = `%${query}%`;
    const sql = `
      SELECT * FROM contacts
      WHERE firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR phone LIKE ?
      ORDER BY firstName, lastName
    `;

    const contacts = await db.all(sql, [searchTerm, searchTerm, searchTerm, searchTerm]);

    res.json({
      query,
      total: contacts.length,
      contacts
    });
  } catch (error) {
    console.error('Error searching contacts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Search by name
exports.searchByName = async (req, res) => {
  try {
    const { name } = req.query;

    if (!name || name.trim() === '') {
      return res.status(400).json({ error: 'Name is required' });
    }

    const searchTerm = `%${name}%`;
    const contacts = await db.all(
      'SELECT * FROM contacts WHERE firstName LIKE ? OR lastName LIKE ? ORDER BY firstName, lastName',
      [searchTerm, searchTerm]
    );

    res.json({ total: contacts.length, contacts });
  } catch (error) {
    console.error('Error searching by name:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Search by phone
exports.searchByPhone = async (req, res) => {
  try {
    const { phone } = req.query;

    if (!phone || phone.trim() === '') {
      return res.status(400).json({ error: 'Phone number is required' });
    }

    const contact = await db.get('SELECT * FROM contacts WHERE phone = ?', [phone]);

    if (!contact) {
      return res.json({ message: 'No contact found with this phone number', contacts: [] });
    }

    res.json({ total: 1, contacts: [contact] });
  } catch (error) {
    console.error('Error searching by phone:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Search by email
exports.searchByEmail = async (req, res) => {
  try {
    const { email } = req.query;

    if (!email || email.trim() === '') {
      return res.status(400).json({ error: 'Email is required' });
    }

    const contact = await db.get('SELECT * FROM contacts WHERE email = ?', [email]);

    if (!contact) {
      return res.json({ message: 'No contact found with this email', contacts: [] });
    }

    res.json({ total: 1, contacts: [contact] });
  } catch (error) {
    console.error('Error searching by email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Update a contact
exports.updateContact = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, phone, address, city, state, zipCode, country, birthDate, notes } = req.body;

    // Check if contact exists
    const existingContact = await db.get('SELECT * FROM contacts WHERE id = ?', [id]);
    if (!existingContact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    const sql = `
      UPDATE contacts
      SET firstName = ?, lastName = ?, email = ?, phone = ?, address = ?, city = ?, state = ?, zipCode = ?, country = ?, birthDate = ?, notes = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await db.run(sql, [
      firstName || existingContact.firstName,
      lastName !== undefined ? lastName : existingContact.lastName,
      email !== undefined ? email : existingContact.email,
      phone !== undefined ? phone : existingContact.phone,
      address !== undefined ? address : existingContact.address,
      city !== undefined ? city : existingContact.city,
      state !== undefined ? state : existingContact.state,
      zipCode !== undefined ? zipCode : existingContact.zipCode,
      country !== undefined ? country : existingContact.country,
      birthDate !== undefined ? birthDate : existingContact.birthDate,
      notes !== undefined ? notes : existingContact.notes,
      id
    ]);

    res.json({ message: 'Contact updated successfully' });
  } catch (error) {
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(400).json({ error: 'Email or phone number already exists' });
    }
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Delete a contact
exports.deleteContact = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if contact exists
    const contact = await db.get('SELECT * FROM contacts WHERE id = ?', [id]);
    if (!contact) {
      return res.status(404).json({ error: 'Contact not found' });
    }

    // Delete merge records
    await db.run('DELETE FROM contact_merges WHERE primaryContactId = ? OR mergedContactId = ?', [id, id]);

    // Delete contact
    await db.run('DELETE FROM contacts WHERE id = ?', [id]);

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// Merge two contacts
exports.mergeContacts = async (req, res) => {
  try {
    const { primaryId, secondaryId } = req.body;

    if (!primaryId || !secondaryId) {
      return res.status(400).json({ error: 'Both primaryId and secondaryId are required' });
    }

    if (primaryId === secondaryId) {
      return res.status(400).json({ error: 'Cannot merge a contact with itself' });
    }

    // Get both contacts
    const primaryContact = await db.get('SELECT * FROM contacts WHERE id = ?', [primaryId]);
    const secondaryContact = await db.get('SELECT * FROM contacts WHERE id = ?', [secondaryId]);

    if (!primaryContact || !secondaryContact) {
      return res.status(404).json({ error: 'One or both contacts not found' });
    }

    // Merge data - keep primary contact data, fill gaps with secondary contact data
    const mergedData = {
      firstName: primaryContact.firstName || secondaryContact.firstName,
      lastName: primaryContact.lastName || secondaryContact.lastName,
      email: primaryContact.email || secondaryContact.email,
      phone: primaryContact.phone || secondaryContact.phone,
      address: primaryContact.address || secondaryContact.address,
      city: primaryContact.city || secondaryContact.city,
      state: primaryContact.state || secondaryContact.state,
      zipCode: primaryContact.zipCode || secondaryContact.zipCode,
      country: primaryContact.country || secondaryContact.country,
      birthDate: primaryContact.birthDate || secondaryContact.birthDate,
      notes: (primaryContact.notes || '') + (secondaryContact.notes ? '\n---Merged---\n' + secondaryContact.notes : '')
    };

    // Update primary contact
    const sql = `
      UPDATE contacts
      SET firstName = ?, lastName = ?, email = ?, phone = ?, address = ?, city = ?, state = ?, zipCode = ?, country = ?, birthDate = ?, notes = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    await db.run(sql, [
      mergedData.firstName,
      mergedData.lastName,
      mergedData.email,
      mergedData.phone,
      mergedData.address,
      mergedData.city,
      mergedData.state,
      mergedData.zipCode,
      mergedData.country,
      mergedData.birthDate,
      mergedData.notes,
      primaryId
    ]);

    // Record the merge
    await db.run(
      'INSERT INTO contact_merges (primaryContactId, mergedContactId) VALUES (?, ?)',
      [primaryId, secondaryId]
    );

    // Delete secondary contact
    await db.run('DELETE FROM contacts WHERE id = ?', [secondaryId]);

    res.json({
      message: 'Contacts merged successfully',
      primaryId,
      mergedContact: mergedData
    });
  } catch (error) {
    console.error('Error merging contacts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
