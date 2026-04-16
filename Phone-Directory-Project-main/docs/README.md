# Contact Book Application - Complete Documentation

## Project Overview

This is a **Personal Contact Book Application** built with modern web technologies. It allows users to manage their personal contacts with features like adding, searching, updating, deleting, and merging contacts.

## Features Implemented

### ✅ Core Features (As Requested)

1. **Enter Personal Information for a Contact**
   - First Name, Last Name
   - Email Address
   - Phone Number
   - Full Address (Street, City, State, Zip Code, Country)
   - Birth Date
   - Personal Notes
   - Timestamps (Created & Updated)

2. **Search for a Contact**
   - By Name (First or Last)
   - By Phone Number
   - By Email Address
   - General Search (across all fields)

3. **Delete a Contact**
   - Soft delete with confirmation
   - Cascade delete for related merge records

4. **Merge Two Contacts**
   - Select 2 contacts to merge
   - Combines information intelligently
   - Preserves data from both contacts
   - Records merge history
   - Deletes secondary contact after merge

### ✅ Additional Features

- Contact list with sorting (by name, email, phone)
- View detailed contact information
- Edit existing contacts
- Real-time search filtering
- Input validation and error handling
- User-friendly UI with responsive design
- Success/Error message notifications

---

## Technology Stack

### Backend
- **Framework**: Express.js (Node.js)
- **Database**: SQLite3
- **Architecture**: MVC (Model-View-Controller)
- **Language**: JavaScript (ES6+)

### Frontend
- **Framework**: React 18
- **Styling**: CSS3 with responsive design
- **HTTP Client**: Axios
- **Language**: JavaScript (ES6+, JSX)

### Tools & Utilities
- **Version Control**: Git
- **Package Manager**: npm
- **Environment**: Node.js 14+

---

## Project Structure

```
Sushant Project/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Express app setup
│   │   ├── controllers/
│   │   │   └── contactController.js    # Business logic
│   │   ├── models/
│   │   │   └── database.js        # Database connection & operations
│   │   └── routes/
│   │       └── contacts.js        # API endpoints
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── ContactForm.jsx    # Add/Edit form
│   │   │   ├── ContactForm.css
│   │   │   ├── ContactList.jsx    # Display contacts
│   │   │   └── ContactList.css
│   │   ├── services/
│   │   │   └── api.js            # API calls
│   │   ├── App.jsx               # Main component
│   │   ├── App.css
│   │   └── index.jsx
│   ├── package.json
│   ├── .env.example
│   └── .gitignore
│
└── docs/
    ├── README.md
    ├── SETUP.md
    ├── API_DOCUMENTATION.md
    └── ARCHITECTURE.md (for web deployment)
```

---

## API Endpoints

### Contacts CRUD

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contacts` | Create new contact |
| GET | `/api/contacts` | Get all contacts |
| GET | `/api/contacts/:id` | Get contact by ID |
| PUT | `/api/contacts/:id` | Update contact |
| DELETE | `/api/contacts/:id` | Delete contact |

### Search Endpoints

| Method | Endpoint | Query Param | Description |
|--------|----------|------------|-------------|
| GET | `/api/contacts/search` | `query` | Search by any field |
| GET | `/api/contacts/search/by-name` | `name` | Search by name |
| GET | `/api/contacts/search/by-phone` | `phone` | Search by phone |
| GET | `/api/contacts/search/by-email` | `email` | Search by email |

### Contact Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/contacts/merge` | Merge two contacts |

---

## Database Schema

### contacts table
```sql
CREATE TABLE contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  firstName TEXT NOT NULL,
  lastName TEXT,
  email TEXT UNIQUE,
  phone TEXT UNIQUE,
  address TEXT,
  city TEXT,
  state TEXT,
  zipCode TEXT,
  country TEXT,
  birthDate TEXT,
  notes TEXT,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### contact_merges table
```sql
CREATE TABLE contact_merges (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  primaryContactId INTEGER NOT NULL,
  mergedContactId INTEGER NOT NULL,
  mergedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(primaryContactId) REFERENCES contacts(id),
  FOREIGN KEY(mergedContactId) REFERENCES contacts(id)
);
```

---

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)

### Installation & Running

1. **Clone or Extract Project**
   ```bash
   cd "Sushant Project"
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   npm start
   ```
   Backend runs on `http://localhost:3001`

3. **Setup Frontend** (in new terminal)
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   npm start
   ```
   Frontend runs on `http://localhost:3000`

4. **Access Application**
   - Open browser and go to `http://localhost:3000`

---

## Usage Guide

### Add a Contact
1. Click "Add New Contact" button
2. Fill in contact details (First Name is required)
3. Click "Save Contact"

### Search for Contact
1. Select search type (All, Name, Email, Phone)
2. Enter search term
3. Matching contacts appear automatically

### Edit Contact
1. Find contact in list
2. Click "Edit" button
3. Modify details
4. Click "Save Contact"

### Delete Contact
1. Find contact in list
2. Click "Delete" button
3. Confirm deletion

### View Contact Details
1. Click on contact card in list
2. View full contact information
3. Click "Back" to return to list

### Merge Contacts
1. Check checkboxes for 2 contacts to merge
2. Click "Merge Selected" button
3. Confirm merge operation
4. Secondary contact is deleted, data combined

---

## Key Components

### Backend

#### `app.js`
- Express server configuration
- Middleware setup (CORS, JSON parsing)
- Route registration
- Error handling

#### `database.js`
- SQLite3 connection
- Promise-based query methods
- Table initialization
- CRUD operations

#### `contactController.js`
- Business logic for all operations
- Input validation
- Error handling
- Search functionality
- Merge algorithm

#### `contacts.js` (Routes)
- RESTful API endpoint definitions
- Request routing to controllers

### Frontend

#### `App.jsx`
- Main application component
- State management
- View switching (list, form, edit, details)
- API integration
- Message notifications

#### `ContactList.jsx`
- Display contacts in list
- Sorting functionality
- Contact selection for merge
- Edit/Delete/View actions

#### `ContactForm.jsx`
- Form for adding/editing contacts
- Input validation
- Field management

#### `api.js` (Services)
- Axios configuration
- API helper methods
- Centralized HTTP requests

---

## Error Handling

The application handles the following errors:

1. **Validation Errors**
   - Required fields
   - Email format validation
   - Phone number validation

2. **Database Errors**
   - Duplicate email/phone
   - Foreign key constraints

3. **API Errors**
   - Server errors
   - Network errors
   - Not found errors

4. **User Feedback**
   - Success messages
   - Error notifications
   - Validation messages

---

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## Performance Features

- Efficient database queries with indexing on unique fields
- Filtered search on client side for instant results
- Responsive UI with optimized re-renders
- CSS animations for smooth transitions

---

## Security Considerations

- Input validation on both frontend and backend
- SQL injection prevention through parameterized queries
- CORS configuration for cross-origin requests
- Error messages don't expose sensitive information
- Environment variables for sensitive configuration

---

## Future Enhancements

1. User authentication & multi-user support
2. Contact groups/categories
3. Photo/avatar support
4. Social media links
5. Contact import/export (CSV, vCard)
6. Backup & restore functionality
7. Advanced search filters
8. Contact reminders (birthdays, anniversaries)
9. Mobile app version
10. Cloud synchronization

---

## Support & Contact

For issues or questions, please create an issue or contact the development team.

**Created**: 2024
**Version**: 1.0.0
**License**: MIT
