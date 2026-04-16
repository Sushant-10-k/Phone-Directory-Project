# Contact Book Application - Setup Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **npm** (v6 or higher) - Usually comes with Node.js
- **Git** (optional, for version control) - [Download](https://git-scm.com/)

To verify installation, run:
```bash
node --version
npm --version
```

---

## Project Setup

### 1. Extract/Clone the Project

```bash
cd "Sushant Project"
```

### 2. Backend Setup

#### Navigate to Backend Directory
```bash
cd backend
```

#### Install Dependencies
```bash
npm install
```

Expected output:
```
added 250 packages, and audited 251 packages
```

#### Create Environment File
```bash
cp .env.example .env
```

Or manually create `.env` file with:
```
PORT=3001
NODE_ENV=development
DATABASE_PATH=./data/contacts.db
```

#### Start Backend Server
```bash
npm start
```

Expected output:
```
Server running on http://localhost:3001
Connected to SQLite database
Contacts table initialized
Contact merges table initialized
```

**The backend is now running!** ✅

### 3. Frontend Setup

#### Open New Terminal Window
(Keep the backend running in the first terminal)

#### Navigate to Frontend Directory
```bash
cd frontend
```

#### Install Dependencies
```bash
npm install
```

Expected output:
```
added 850 packages, and audited 851 packages
```

#### Create Environment File
```bash
cp .env.example .env
```

Or manually create `.env` file with:
```
REACT_APP_API_URL=http://localhost:3001/api
```

#### Start Frontend Server
```bash
npm start
```

Expected output:
```
Compiled successfully!

You can now view contact-book-frontend in the browser.

  Local:            http://localhost:3000
  
Note that the development build is not optimized.
To create a production build, use npm run build.
```

---

## Accessing the Application

1. Open your browser
2. Navigate to `http://localhost:3000`
3. You should see the Contact Book application

### First Time Setup
- The database will be automatically created when the backend starts
- You can now start adding contacts!

---

## Stopping the Application

### To Stop Backend
In the backend terminal:
```bash
Ctrl + C
```

### To Stop Frontend
In the frontend terminal:
```bash
Ctrl + C
```

---

## Troubleshooting

### Port Already in Use

**Issue**: `Error: listen EADDRINUSE: address already in use :::3001`

**Solution 1**: Kill the process using the port
```bash
# On Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# On macOS/Linux
lsof -ti:3001 | xargs kill -9
```

**Solution 2**: Change the port in `.env`
```
PORT=3002
```

### Module Not Found

**Issue**: `Cannot find module 'express'`

**Solution**: Reinstall dependencies
```bash
rm -rf node_modules
npm install
```

### Database Connection Error

**Issue**: `Error opening database: Error: ENOENT: no such file or directory`

**Solution**: Create the data directory
```bash
mkdir data
npm start
```

### Frontend Cannot Connect to Backend

**Issue**: Network Error when submitting form

**Solution**: 
1. Ensure backend is running on `http://localhost:3001`
2. Check REACT_APP_API_URL in frontend `.env`
3. Restart frontend: `npm start`

---

## Development Workflow

### Adding a New Contact
1. Click "Add New Contact"
2. Fill form with required/optional fields
3. Click "Save Contact"

### Searching Contacts
1. Select search type (All, Name, Email, Phone)
2. Type search term
3. Results appear automatically

### Editing Contacts
1. Click "Edit" on any contact
2. Modify fields
3. Click "Save Contact"

### Deleting Contacts
1. Click "Delete" on any contact
2. Confirm deletion

### Merging Contacts
1. Check boxes on 2 contacts
2. Click "Merge Selected"
3. Confirm merge (secondary contact will be deleted)

---

## API Testing

### Test Backend Health
```bash
curl http://localhost:3001/api/health
```

Expected response:
```json
{"status":"OK","timestamp":"2024-01-15T10:30:00.000Z"}
```

### Get All Contacts
```bash
curl http://localhost:3001/api/contacts
```

### Create a Contact
```bash
curl -X POST http://localhost:3001/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "1234567890"
  }'
```

### Search Contacts
```bash
curl "http://localhost:3001/api/contacts/search?query=John"
```

---

## Building for Production

### Frontend Build
```bash
cd frontend
npm run build
```

Creates optimized build in `frontend/build/` directory

### Backend for Production
```bash
cd backend
NODE_ENV=production npm start
```

---

## Project Structure Reference

```
Sushant Project/
├── backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── controllers/
│   │   ├── models/
│   │   └── routes/
│   ├── package.json
│   ├── .env.example
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── App.css
│   ├── public/
│   ├── package.json
│   └── .env.example
└── docs/
    ├── README.md
    ├── SETUP.md
    ├── API_DOCUMENTATION.md
    └── ARCHITECTURE.md
```

---

## Next Steps

1. ✅ Complete the setup
2. ✅ Add some test contacts
3. ✅ Try search and merge features
4. 📖 Read `API_DOCUMENTATION.md` for API details
5. 🏗️ Read `ARCHITECTURE.md` for web deployment info
6. 🚀 Consider enhancements from the roadmap

---

## Support

If you encounter issues:
1. Check the Troubleshooting section
2. Review logs in terminal
3. Ensure all prerequisites are installed
4. Try restarting both servers

---

**Happy Contact Managing!** 📇
