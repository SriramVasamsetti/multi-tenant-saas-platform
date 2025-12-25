const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticate } = require('../middleware/auth');

// Create a task for a specific project
router.post('/:projectId/tasks', authenticate, taskController.createTask);

// Get all tasks for a specific project
router.get('/:projectId/tasks', authenticate, taskController.getProjectTasks);

// Update status of a specific task
router.patch('/tasks/:taskId/status', authenticate, taskController.updateTaskStatus);

module.exports = router;