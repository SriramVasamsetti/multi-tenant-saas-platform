const fs = require('fs');
const path = require('path');
const pool = require('../src/config/database');
require('dotenv').config();

const runMigrations = async () => {
  const client = await pool.connect();
  try {
    const migrationPath = path.join(__dirname, '../migrations');
    const files = fs.readdirSync(migrationPath).sort();

    for (const file of files) {
      if (file.endsWith('.sql')) {
        const sql = fs.readFileSync(path.join(migrationPath, file), 'utf8');
        console.log(`Running migration: ${file}`);
        await client.query(sql);
        console.log(`✓ Completed: ${file}`);
      }
    }

    console.log('\n✓ All migrations completed!');
    process.exit(0);
  } catch (error) {
    console.error('Migration error:', error);
    process.exit(1);
  } finally {
    client.release();
  }
};

runMigrations();
