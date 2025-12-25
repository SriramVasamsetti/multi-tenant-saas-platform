const pool = require('../src/config/database');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('TRUNCATE tenants, users, projects, tasks CASCADE');
    
    // Super Admin - Generate new salt for each password
    const passAdmin = await bcrypt.hash('Admin@123', 10);
    await client.query('INSERT INTO users (email, password_hash, full_name, role, tenant_id) VALUES ($1, $2, $3, $4, $5)',
      ['superadmin@system.com', passAdmin, 'System Admin', 'super_admin', null]);

    // Demo Tenant
    const demoRes = await client.query('INSERT INTO tenants (name, subdomain, status, subscription_plan) VALUES ($1, $2, $3, $4) RETURNING id',
      ['Demo Company', 'demo', 'active', 'pro']);
    const demoId = demoRes.rows[0].id;
    
    const passDemo = await bcrypt.hash('Demo@123', 10);
    await client.query('INSERT INTO users (email, password_hash, full_name, role, tenant_id) VALUES ($1, $2, $3, $4, $5)',
      ['admin@demo.com', passDemo, 'Demo Admin', 'tenant_admin', demoId]);

    // Regular users for Demo tenant
    const passUser1 = await bcrypt.hash('User@123', 10);
    await client.query('INSERT INTO users (email, password_hash, full_name, role, tenant_id) VALUES ($1, $2, $3, $4, $5)',
      ['user1@demo.com', passUser1, 'User One', 'user', demoId]);

    const passUser2 = await bcrypt.hash('User@123', 10);
    await client.query('INSERT INTO users (email, password_hash, full_name, role, tenant_id) VALUES ($1, $2, $3, $4, $5)',
      ['user2@demo.com', passUser2, 'User Two', 'user', demoId]);

    // Tech Startup Tenant
    const techRes = await client.query('INSERT INTO tenants (name, subdomain, status, subscription_plan) VALUES ($1, $2, $3, $4) RETURNING id',
      ['Tech Startup', 'techstartup', 'active', 'free']);
    const techId = techRes.rows[0].id;
    
    const passTech = await bcrypt.hash('TechStart@123', 10);
    await client.query('INSERT INTO users (email, password_hash, full_name, role, tenant_id) VALUES ($1, $2, $3, $4, $5)',
      ['admin@techstartup.com', passTech, 'Tech Admin', 'tenant_admin', techId]);

    await client.query('COMMIT');
    console.log('✓ Database seeded successfully');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Error seeding database:', e);
  } finally {
    client.release();
    process.exit();
  }
};

seedData();
