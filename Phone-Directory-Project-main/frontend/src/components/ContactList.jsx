import React, { useState, useEffect } from 'react';
import './ContactList.css';

const ContactList = ({ contacts, onEdit, onDelete, onMerge, isLoading = false, onViewDetails }) => {
  const [selectedContacts, setSelectedContacts] = useState([]);
  const [sortBy, setSortBy] = useState('name');

  const sortedContacts = [...contacts].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a.firstName + a.lastName).localeCompare(b.firstName + b.lastName);
      case 'email':
        return (a.email || '').localeCompare(b.email || '');
      case 'phone':
        return (a.phone || '').localeCompare(b.phone || '');
      default:
        return 0;
    }
  });

  const toggleSelectContact = (id) => {
    setSelectedContacts(prev =>
      prev.includes(id) ? prev.filter(cid => cid !== id) : [...prev, id]
    );
  };

  const handleMerge = () => {
    if (selectedContacts.length === 2) {
      onMerge(selectedContacts[0], selectedContacts[1]);
      setSelectedContacts([]);
    }
  };

  const handleSelectAll = () => {
    if (selectedContacts.length === contacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(contacts.map(c => c.id));
    }
  };

  if (isLoading) {
    return <div className="loading">Loading contacts...</div>;
  }

  if (contacts.length === 0) {
    return (
      <div className="no-contacts">
        <h3>No contacts found</h3>
        <p>Start by adding your first contact!</p>
      </div>
    );
  }

  return (
    <div className="contact-list-container">
      <div className="list-header">
        <div className="sort-controls">
          <label htmlFor="sortBy">Sort by:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="phone">Phone</option>
          </select>
        </div>

        {selectedContacts.length > 0 && (
          <div className="merge-section">
            <span className="selected-count">
              {selectedContacts.length} selected
            </span>
            {selectedContacts.length === 2 && (
              <button
                className="btn btn-merge"
                onClick={handleMerge}
              >
                Merge Selected
              </button>
            )}
            {selectedContacts.length > 2 && (
              <span className="merge-hint">Select exactly 2 contacts to merge</span>
            )}
          </div>
        )}
      </div>

      <div className="contact-list">
        {sortedContacts.map(contact => (
          <div key={contact.id} className="contact-card">
            <div className="card-checkbox">
              <input
                type="checkbox"
                checked={selectedContacts.includes(contact.id)}
                onChange={() => toggleSelectContact(contact.id)}
              />
            </div>

            <div className="card-content" onClick={() => onViewDetails && onViewDetails(contact.id)}>
              <div className="card-name">
                {contact.firstName} {contact.lastName}
              </div>
              <div className="card-details">
                {contact.email && (
                  <div className="detail-item">
                    <span className="label">Email:</span>
                    <a href={`mailto:${contact.email}`}>{contact.email}</a>
                  </div>
                )}
                {contact.phone && (
                  <div className="detail-item">
                    <span className="label">Phone:</span>
                    <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                  </div>
                )}
                {contact.city && contact.state && (
                  <div className="detail-item">
                    <span className="label">Location:</span>
                    {contact.city}, {contact.state}
                  </div>
                )}
              </div>
            </div>

            <div className="card-actions">
              <button
                className="btn btn-sm btn-edit"
                onClick={() => onEdit(contact.id)}
                title="Edit contact"
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-delete"
                onClick={() => onDelete(contact.id)}
                title="Delete contact"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="list-footer">
        <p>{sortedContacts.length} contact{sortedContacts.length !== 1 ? 's' : ''}</p>
      </div>
    </div>
  );
};

export default ContactList;
