import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const contactAPI = {
  // Get all contacts
  getAllContacts: () => api.get('/contacts'),

  // Get single contact
  getContact: (id) => api.get(`/contacts/${id}`),

  // Create contact
  createContact: (contactData) => api.post('/contacts', contactData),

  // Update contact
  updateContact: (id, contactData) => api.put(`/contacts/${id}`, contactData),

  // Delete contact
  deleteContact: (id) => api.delete(`/contacts/${id}`),

  // Search contacts
  searchContacts: (query) => api.get('/contacts/search', { params: { query } }),

  // Search by name
  searchByName: (name) => api.get('/contacts/search/by-name', { params: { name } }),

  // Search by phone
  searchByPhone: (phone) => api.get('/contacts/search/by-phone', { params: { phone } }),

  // Search by email
  searchByEmail: (email) => api.get('/contacts/search/by-email', { params: { email } }),

  // Merge contacts
  mergeContacts: (primaryId, secondaryId) => 
    api.post('/contacts/merge', { primaryId, secondaryId }),
};

export default api;
