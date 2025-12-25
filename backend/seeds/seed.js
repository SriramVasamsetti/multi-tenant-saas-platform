const pool = require('../src/config/database');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('TRUNCATE tenants, users, projects, tasks CASCADE');
    const salt = await bcrypt.genSalt(10);
    
    // Super Admin
    const passAdmin = await bcrypt.hash('Admin@123', salt);
    await client.query('INSERT INTO users (email, password_hash, full_name, role, tenant_id) VALUES ($1, $2, $3, $4, $5)',
      ['superadmin@system.com', passAdmin, 'System Admin', 'super_admin', null]);

    // Demo Tenant
    const demoRes = await client.query('INSERT INTO tenants (name, subdomain, status, subscription_plan) VALUES ($1, $2, $3, $4) RETURNING id',
      ['Demo Company', 'demo', 'active', 'pro']);
    const demoId = demoRes.rows[0].id;
    const passDemo = await bcrypt.hash('Demo@123', salt);
    await client.query('INSERT INTO users (email, password_hash, full_name, role, tenant_id) VALUES ($1, $2, $3, $4, $5)',
      ['admin@demo.com', passDemo, 'Demo Admin', 'tenant_admin', demoId]);

    // Tech Startup Tenant
    const techRes = await client.query('INSERT INTO tenants (name, subdomain, status, subscription_plan) VALUES ($1, $2, $3, $4) RETURNING id',
      ['Tech Startup', 'techstartup', 'active', 'free']);
    const techId = techRes.rows[0].id;
    const passTech = await bcrypt.hash('TechStart@123', salt);
    await client.query('INSERT INTO users (email, password_hash, full_name, role, tenant_id) VALUES ($1, $2, $3, $4, $5)',
      ['admin@techstartup.com', passTech, 'Tech Admin', 'tenant_admin', techId]);

    await client.query('COMMIT');
    console.log('✓ Database seeded successfully');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error(e);
  } finally {
    client.release();
    process.exit();
  }
};
seedData();