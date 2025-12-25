const pool = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

/**
 * Register a new Tenant and its Admin user
 */
exports.registerTenant = async (req, res) => {
  const { tenantName, subdomain, adminEmail, adminPassword, adminFullName } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const tenantResult = await client.query(
      'INSERT INTO tenants (name, subdomain, subscription_plan, max_users, max_projects) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [tenantName, subdomain, 'free', 5, 3]
    );

    const tenantId = tenantResult.rows[0].id;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    const userResult = await client.query(
      'INSERT INTO users (tenant_id, email, password_hash, full_name, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, full_name, role',
      [tenantId, adminEmail.toLowerCase(), hashedPassword, adminFullName, 'tenant_admin']
    );

    await client.query('COMMIT');

    res.status(201).json({
      success: true,
      message: "Tenant registered successfully",
      data: { tenantId, subdomain, adminUser: userResult.rows[0] }
    });
  } catch (error) {
    await client.query('ROLLBACK');
    res.status(409).json({ success: false, message: error.message });
  } finally {
    client.release();
  }
};

/**
 * Authenticate User and generate JWT
 */
exports.login = async (req, res) => {
  const { email, password, subdomain, tenantSubdomain } = req.body;
  const activeSubdomain = subdomain || tenantSubdomain;

  try {
    const result = await pool.query(
      `SELECT u.*, t.status as tenant_status FROM users u 
       LEFT JOIN tenants t ON u.tenant_id = t.id 
       WHERE LOWER(u.email) = LOWER($1) AND (t.subdomain = $2 OR u.tenant_id IS NULL)`,
      [email, activeSubdomain]
    );

    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.tenant_id && user.tenant_status !== 'active') {
      return res.status(403).json({ success: false, message: 'Tenant account suspended' });
    }

    const token = jwt.sign(
      { userId: user.id, tenantId: user.tenant_id, role: user.role },
      process.env.JWT_SECRET || 'dev_secret_key_minimum_32_chars_12345',
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          fullName: user.full_name,
          role: user.role,
          tenantId: user.tenant_id
        },
        token,
        expiresIn: 86400
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
