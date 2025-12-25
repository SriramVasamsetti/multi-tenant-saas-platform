const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticate } = require('../middleware/auth');

router.post('/', authenticate, projectController.createProject);
router.get('/', authenticate, projectController.listProjects);

module.exports = router;
