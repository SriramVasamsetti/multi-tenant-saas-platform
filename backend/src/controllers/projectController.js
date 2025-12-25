const pool = require('../config/database');

exports.createProject = async (req, res) => {
  const { name, description } = req.body;
  const { tenantId, userId } = req.user;
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
  const { tenantId } = req.user;
  try {
    const result = await pool.query(
      'SELECT p.*, u.full_name as creator_name FROM projects p LEFT JOIN users u ON p.created_by = u.id WHERE p.tenant_id = $1 ORDER BY p.created_at DESC',
      [tenantId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
