const fs = require('fs');
const path = require('path');
const db = require('./db/database');

const sqlPath = path.join(__dirname, 'db', 'schema.sql');
const sql = fs.readFileSync(sqlPath, 'utf8');

try {
  db.exec(sql);
  console.log('Schema aplicado en db/database.sqlite');
} catch (err) {
  console.error('Error aplicando schema:', err.message);
  process.exit(1);
}
