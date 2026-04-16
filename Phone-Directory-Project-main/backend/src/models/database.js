const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.join(__dirname, '../../data/contacts.db');

class Database {
  constructor() {
    this.db = new sqlite3.Database(dbPath, (err) => {
      if (err) {
        console.error('Error opening database:', err);
      } else {
        console.log('Connected to SQLite database');
        this.initializeTables();
      }
    });
  }

  initializeTables() {
    this.db.serialize(() => {
      this.db.run(`
        CREATE TABLE IF NOT EXISTS contacts (
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
        )
      `, (err) => {
        if (err) console.error('Error creating contacts table:', err);
        else console.log('Contacts table initialized');
      });

      this.db.run(`
        CREATE TABLE IF NOT EXISTS contact_merges (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          primaryContactId INTEGER NOT NULL,
          mergedContactId INTEGER NOT NULL,
          mergedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY(primaryContactId) REFERENCES contacts(id),
          FOREIGN KEY(mergedContactId) REFERENCES contacts(id)
        )
      `, (err) => {
        if (err) console.error('Error creating merges table:', err);
        else console.log('Contact merges table initialized');
      });
    });
  }

  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  }

  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  close() {
    return new Promise((resolve, reject) => {
      this.db.close((err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

module.exports = new Database();
