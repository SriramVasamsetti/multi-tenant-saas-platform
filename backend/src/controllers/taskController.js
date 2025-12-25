const pool = require('../config/database');

exports.createTask = async (req, res) => {
  const { projectId } = req.params;
  const { title, description, priority, assignedTo, dueDate } = req.body;
  const { tenantId } = req.user;

  try {
    // 1. Verify project belongs to tenant
    const project = await pool.query(
      'SELECT id FROM projects WHERE id = $1 AND tenant_id = $2',
      [projectId, tenantId]
    );

    if (project.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    // 2. Insert Task
    const result = await pool.query(
      'INSERT INTO tasks (project_id, tenant_id, title, description, priority, assigned_to, due_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [projectId, tenantId, title, description, priority || 'medium', assignedTo, dueDate]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getProjectTasks = async (req, res) => {
  const { projectId } = req.params;
  const { tenantId } = req.user;

  try {
    const result = await pool.query(
      'SELECT t.*, u.full_name as assigned_user_name FROM tasks t LEFT JOIN users u ON t.assigned_to = u.id WHERE t.project_id = $1 AND t.tenant_id = $2',
      [projectId, tenantId]
    );
    res.json({ success: true, data: result.rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;
  const { tenantId } = req.user;

  try {
    const result = await pool.query(
      'UPDATE tasks SET status = $1, updated_at = NOW() WHERE id = $2 AND tenant_id = $3 RETURNING *',
      [status, taskId, tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.json({ success: true, data: result.rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};