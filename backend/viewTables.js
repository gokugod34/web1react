const db = require('./db/database');

try {
  const rows = db.prepare("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name").all();
  if (!rows.length) {
    console.log('No se encontraron tablas.');
  } else {
    console.log('Tablas en la base:');
    rows.forEach(r => console.log('-', r.name));
  }
} catch (err) {
  console.error('Error consultando tablas:', err.message);
  process.exit(1);
}
