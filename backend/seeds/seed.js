const pool = require('../src/config/database');
const bcrypt = require('bcryptjs');

const seedData = async () => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Clear existing data to ensure a fresh start
    await client.query('TRUNCATE tenants, users, projects, tasks CASCADE');

    const salt = await bcrypt.genSalt(10);
    
    // --- 1. Create Super Admin ---
    const hashedSuperAdminPass = await bcrypt.hash('Admin@123', salt);
    await client.query(
      'INSERT INTO users (email, password_hash, full_name, role, tenant_id) VALUES ($1, $2, $3, $4, $5)',
      ['superadmin@system.com', hashedSuperAdminPass, 'System Admin', 'super_admin', null]
    );

    // --- 2. Create Demo Company Tenant (Pro Plan) ---
    const demoTenantRes = await client.query(
      'INSERT INTO tenants (name, subdomain, status, subscription_plan, max_projects) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      ['Demo Company', 'demo', 'active', 'pro', 100]
    );
    const demoId = demoTenantRes.rows[0].id;

    // Admin for Demo Company
    const hashedDemoAdminPass = await bcrypt.hash('Demo@123', salt);
    const demoAdminRes = await client.query(
      'INSERT INTO users (email, password_hash, full_name, role, tenant_id) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      ['admin@demo.com', hashedDemoAdminPass, 'Demo Admin', 'tenant_admin', demoId]
    );

    // Regular Users for Demo Company
    const hashedUserPass = await bcrypt.hash('User@123', salt);
    await client.query(
      'INSERT INTO users (email, password_hash, full_name, role, tenant_id) VALUES ($1, $2, $3, $4, $5), ($6, $7, $8, $9, $10)',
      ['user1@demo.com', hashedUserPass, 'User One', 'user', demoId, 'user2@demo.com', hashedUserPass, 'User Two', 'user', demoId]
    );

    // Projects for Demo Company
    await client.query(
      'INSERT INTO projects (tenant_id, name, description, created_by) VALUES ($1, $2, $3, $4), ($1, $5, $6, $4)',
      [demoId, 'Website Redesign', 'Complete redesign of company website', demoAdminRes.rows[0].id, 'Mobile App', 'Native mobile application development']
    );

    // --- 3. Create Tech Startup Tenant (Free Plan) ---
    const techTenantRes = await client.query(
      'INSERT INTO tenants (name, subdomain, status, subscription_plan, max_projects) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      ['Tech Startup', 'techstartup', 'active', 'free', 3]
    );
    const techId = techTenantRes.rows[0].id;

    // Admin for Tech Startup
    const hashedTechAdminPass = await bcrypt.hash('TechStart@123', salt);
    const techAdminRes = await client.query(
      'INSERT INTO users (email, password_hash, full_name, role, tenant_id) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      ['admin@techstartup.com', hashedTechAdminPass, 'Tech Startup Admin', 'tenant_admin', techId]
    );

    // User for Tech Startup
    const hashedDevPass = await bcrypt.hash('Dev@123', salt);
    await client.query(
      'INSERT INTO users (email, password_hash, full_name, role, tenant_id) VALUES ($1, $2, $3, $4, $5)',
      ['dev@techstartup.com', hashedDevPass, 'Lead Developer', 'user', techId]
    );

    // Project for Tech Startup
    await client.query(
      'INSERT INTO projects (tenant_id, name, description, created_by) VALUES ($1, $2, $3, $4)',
      [techId, 'MVP Launch', 'Minimum viable product for market launch', techAdminRes.rows[0].id]
    );

    await client.query('COMMIT');
    console.log('✓ Database seeded successfully to match submission.json');
  } catch (e) {
    await client.query('ROLLBACK');
    console.error('Seed error:', e);
  } finally {
    client.release();
    process.exit();
  }
};

seedData();