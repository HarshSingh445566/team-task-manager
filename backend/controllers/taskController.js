const pool = require('../models/db');

const getTasks = async (req, res) => {
  const result = await pool.query(
    'SELECT * FROM tasks WHERE project_id=$1',
    [req.params.projectId]
  );
  res.json(result.rows);
};

const createTask = async (req, res) => {
  const { title, description, due_date, assigned_to } = req.body;
  const result = await pool.query(
    'INSERT INTO tasks (title, description, due_date, assigned_to, project_id, created_by) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [title, description, due_date, assigned_to, req.params.projectId, req.user.id]
  );
  res.status(201).json(result.rows[0]);
};

const updateTask = async (req, res) => {
  const { title, status, assigned_to, due_date } = req.body;
  const result = await pool.query(
    'UPDATE tasks SET title=COALESCE($1,title), status=COALESCE($2,status), assigned_to=COALESCE($3,assigned_to), due_date=COALESCE($4,due_date) WHERE id=$5 RETURNING *',
    [title, status, assigned_to, due_date, req.params.id]
  );
  res.json(result.rows[0]);
};

const deleteTask = async (req, res) => {
  await pool.query('DELETE FROM tasks WHERE id=$1', [req.params.id]);
  res.json({ message: 'Deleted' });
};

module.exports = { getTasks, createTask, updateTask, deleteTask };