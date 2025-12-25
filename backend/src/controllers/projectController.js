const pool = require('../config/database');

exports.createProject = async (req, res) => {
  const { name, description } = req.body;
  const { tenantId, userId, role } = req.user; // Added role

  // Super Admins typically don't belong to a tenant and shouldn't create projects directly
  if (role === 'super_admin' && !tenantId) {
    return res.status(403).json({ success: false, message: 'Super Admins must be within a tenant context to create projects' });
  }

  try {
    const tenantCheck = await pool.query('SELECT max_projects FROM tenants WHERE id = $1', [tenantId]);
    const projectCount = await pool.query('SELECT count(*) FROM projects WHERE tenant_id = $1', [tenantId]);
    
    if (parseInt(projectCount.rows[0].count) >= tenantCheck.rows[0].max_projects) {
      return res.status(403).json({ success: false, message: 'Project limit reached' });
    }
    
    const result = await pool.query(
      'INSERT INTO projects (tenant_id, name, description, created_by) VALUES ($1, $2, $3, $4) RETURNING *',
      [tenantId, name, description, userId]
    );
    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.listProjects = async (req, res) => {
  const { tenantId, role } = req.user; // Added role
  
  try {
    let result;
    
    // Check if user is Super Admin to provide global view
    if (role === 'super_admin') {
      result = await pool.query(
        'SELECT p.*, u.full_name as creator_name, t.name as tenant_name FROM projects p LEFT JOIN users u ON p.created_by = u.id LEFT JOIN tenants t ON p.tenant_id = t.id ORDER BY p.created_at DESC'
      );
    } else {
      // Regular Tenant Admins and Users only see their own tenant data
      result = await pool.query(
        'SELECT p.*, u.full_name as creator_name FROM projects p LEFT JOIN users u ON p.created_by = u.id WHERE p.tenant_id = $1 ORDER BY p.created_at DESC',
        [tenantId]
      );
    }
    
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};