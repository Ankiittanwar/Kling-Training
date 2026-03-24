const { DatabaseSync } = require('node:sqlite');
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, 'bagsy_training.db');
const SCHEMA_PATH = path.join(__dirname, 'schema.sql');

let db;

function getDb() {
  if (!db) {
    db = new DatabaseSync(DB_PATH);
    db.exec('PRAGMA journal_mode = WAL');
    db.exec('PRAGMA foreign_keys = ON');
  }
  return db;
}

function initDb() {
  const database = getDb();
  const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
  database.exec(schema);

  // Seed only if users table is empty
  const count = database.prepare('SELECT COUNT(*) as c FROM users').get();
  if (count.c === 0) {
    const { seedDb } = require('./seed');
    seedDb(database);
  }
}

module.exports = { getDb, initDb };
