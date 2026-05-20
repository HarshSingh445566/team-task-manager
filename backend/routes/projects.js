const express = require('express');
const router = express.Router();
const { authenticate, requireAdmin } = require('../middleware/auth');
const { getProjects, createProject, addMember, deleteProject } = require('../controllers/projectController');

router.get('/', authenticate, getProjects);
router.post('/', authenticate, requireAdmin, createProject);
router.post('/:id/members', authenticate, requireAdmin, addMember);
router.delete('/:id', authenticate, requireAdmin, deleteProject);

module.exports = router;