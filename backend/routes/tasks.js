const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth');
const { getTasks, createTask, updateTask, deleteTask } = require('../controllers/taskController');

router.get('/projects/:projectId/tasks', authenticate, getTasks);
router.post('/projects/:projectId/tasks', authenticate, createTask);
router.put('/tasks/:id', authenticate, updateTask);
router.delete('/tasks/:id', authenticate, deleteTask);

module.exports = router;