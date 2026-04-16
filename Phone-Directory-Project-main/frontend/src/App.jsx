import React, { useState, useEffect } from 'react';
import { contactAPI } from './services/api';
import ContactForm from './components/ContactForm';
import ContactList from './components/ContactList';
import './App.css';

function App() {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [view, setView] = useState('list'); // list, form, edit, details
  const [editingContactId, setEditingContactId] = useState(null);
  const [editingContact, setEditingContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('all');
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [selectedContactDetails, setSelectedContactDetails] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // success, error

  // Load contacts on mount
  useEffect(() => {
    loadContacts();
  }, []);

  // Filter contacts when search changes
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredContacts(contacts);
    } else {
      const filtered = contacts.filter(contact => {
        const name = `${contact.firstName} ${contact.lastName}`.toLowerCase();
        const query = searchQuery.toLowerCase();

        switch (searchType) {
          case 'name':
            return name.includes(query);
          case 'email':
            return (contact.email || '').toLowerCase().includes(query);
          case 'phone':
            return (contact.phone || '').includes(query);
          default:
            return name.includes(query) ||
              (contact.email || '').toLowerCase().includes(query) ||
              (contact.phone || '').includes(query);
        }
      });
      setFilteredContacts(filtered);
    }
  }, [searchQuery, searchType, contacts]);

  const showMessage = (text, type) => {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 4000);
  };

  const loadContacts = async () => {
    setIsLoading(true);
    try {
      const response = await contactAPI.getAllContacts();
      setContacts(response.data.contacts || []);
      setFilteredContacts(response.data.contacts || []);
    } catch (error) {
      console.error('Error loading contacts:', error);
      showMessage('Failed to load contacts', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddContact = () => {
    setEditingContactId(null);
    setEditingContact(null);
    setView('form');
  };

  const handleEditContact = async (id) => {
    try {
      const response = await contactAPI.getContact(id);
      setEditingContactId(id);
      setEditingContact(response.data);
      setView('edit');
    } catch (error) {
      console.error('Error loading contact:', error);
      showMessage('Failed to load contact', 'error');
    }
  };

  const handleViewContactDetails = async (id) => {
    try {
      const response = await contactAPI.getContact(id);
      setSelectedContactId(id);
      setSelectedContactDetails(response.data);
      setView('details');
    } catch (error) {
      console.error('Error loading contact details:', error);
      showMessage('Failed to load contact details', 'error');
    }
  };

  const handleDeleteContact = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      setIsLoading(true);
      try {
        await contactAPI.deleteContact(id);
        setContacts(contacts.filter(c => c.id !== id));
        showMessage('Contact deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting contact:', error);
        showMessage('Failed to delete contact', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleMergeContacts = async (primaryId, secondaryId) => {
    if (window.confirm('Are you sure you want to merge these contacts? The secondary contact will be deleted.')) {
      setIsLoading(true);
      try {
        await contactAPI.mergeContacts(primaryId, secondaryId);
        await loadContacts();
        showMessage('Contacts merged successfully', 'success');
      } catch (error) {
        console.error('Error merging contacts:', error);
        showMessage('Failed to merge contacts', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleSubmitContact = async (formData) => {
    setIsLoading(true);
    try {
      if (editingContactId) {
        // Update existing contact
        await contactAPI.updateContact(editingContactId, formData);
        showMessage('Contact updated successfully', 'success');
      } else {
        // Create new contact
        await contactAPI.createContact(formData);
        showMessage('Contact created successfully', 'success');
      }
      await loadContacts();
      setView('list');
    } catch (error) {
      console.error('Error saving contact:', error);
      if (error.response?.data?.error) {
        showMessage(error.response.data.error, 'error');
      } else {
        showMessage('Failed to save contact', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelForm = () => {
    setView('list');
    setEditingContactId(null);
    setEditingContact(null);
  };

  const handleCancelDetails = () => {
    setView('list');
    setSelectedContactId(null);
    setSelectedContactDetails(null);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>📇 Contact Book</h1>
          <p className="tagline">Manage your personal contacts efficiently</p>
        </div>
      </header>

      {message && (
        <div className={`message message-${messageType}`}>
          {message}
        </div>
      )}

      <main className="app-main">
        {view === 'list' ? (
          <div className="list-view">
            <div className="list-controls">
              <button
                className="btn btn-primary btn-lg"
                onClick={handleAddContact}
              >
                + Add New Contact
              </button>

              <div className="search-box">
                <div className="search-inputs">
                  <select
                    value={searchType}
                    onChange={(e) => setSearchType(e.target.value)}
                    className="search-type"
                  >
                    <option value="all">Search All</option>
                    <option value="name">By Name</option>
                    <option value="email">By Email</option>
                    <option value="phone">By Phone</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Search contacts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                </div>
                {searchQuery && (
                  <p className="search-results">
                    Found {filteredContacts.length} contact{filteredContacts.length !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>

            <ContactList
              contacts={filteredContacts}
              onEdit={handleEditContact}
              onDelete={handleDeleteContact}
              onMerge={handleMergeContacts}
              onViewDetails={handleViewContactDetails}
              isLoading={isLoading}
            />
          </div>
        ) : view === 'form' ? (
          <div className="form-view">
            <h2>Add New Contact</h2>
            <ContactForm
              onSubmit={handleSubmitContact}
              onCancel={handleCancelForm}
              isLoading={isLoading}
            />
          </div>
        ) : view === 'edit' ? (
          <div className="form-view">
            <h2>Edit Contact</h2>
            {editingContact && (
              <ContactForm
                contact={editingContact}
                onSubmit={handleSubmitContact}
                onCancel={handleCancelForm}
                isLoading={isLoading}
              />
            )}
          </div>
        ) : view === 'details' ? (
          <div className="details-view">
            {selectedContactDetails && (
              <>
                <div className="details-header">
                  <h2>{selectedContactDetails.firstName} {selectedContactDetails.lastName}</h2>
                  <button
                    className="btn btn-secondary"
                    onClick={handleCancelDetails}
                  >
                    Back
                  </button>
                </div>

                <div className="details-container">
                  <div className="details-card">
                    <h3>Contact Information</h3>
                    {selectedContactDetails.email && (
                      <div className="detail-row">
                        <span className="label">Email:</span>
                        <a href={`mailto:${selectedContactDetails.email}`}>
                          {selectedContactDetails.email}
                        </a>
                      </div>
                    )}
                    {selectedContactDetails.phone && (
                      <div className="detail-row">
                        <span className="label">Phone:</span>
                        <a href={`tel:${selectedContactDetails.phone}`}>
                          {selectedContactDetails.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {(selectedContactDetails.address || selectedContactDetails.city || selectedContactDetails.state || selectedContactDetails.zipCode || selectedContactDetails.country) && (
                    <div className="details-card">
                      <h3>Address</h3>
                      {selectedContactDetails.address && (
                        <div className="detail-row">
                          <span className="label">Address:</span>
                          {selectedContactDetails.address}
                        </div>
                      )}
                      {selectedContactDetails.city && (
                        <div className="detail-row">
                          <span className="label">City:</span>
                          {selectedContactDetails.city}
                        </div>
                      )}
                      {selectedContactDetails.state && (
                        <div className="detail-row">
                          <span className="label">State:</span>
                          {selectedContactDetails.state}
                        </div>
                      )}
                      {selectedContactDetails.zipCode && (
                        <div className="detail-row">
                          <span className="label">Zip Code:</span>
                          {selectedContactDetails.zipCode}
                        </div>
                      )}
                      {selectedContactDetails.country && (
                        <div className="detail-row">
                          <span className="label">Country:</span>
                          {selectedContactDetails.country}
                        </div>
                      )}
                    </div>
                  )}

                  {selectedContactDetails.birthDate && (
                    <div className="details-card">
                      <h3>Personal Information</h3>
                      <div className="detail-row">
                        <span className="label">Birth Date:</span>
                        {new Date(selectedContactDetails.birthDate).toLocaleDateString()}
                      </div>
                    </div>
                  )}

                  {selectedContactDetails.notes && (
                    <div className="details-card">
                      <h3>Notes</h3>
                      <p>{selectedContactDetails.notes}</p>
                    </div>
                  )}

                  <div className="details-actions">
                    <button
                      className="btn btn-edit"
                      onClick={() => handleEditContact(selectedContactDetails.id)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-delete"
                      onClick={() => handleDeleteContact(selectedContactDetails.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : null}
      </main>

      <footer className="app-footer">
        <p>&copy; 2024 Contact Book Application. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
