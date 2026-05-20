const pool = require('../models/db');

const getProjects = async (req, res) => {
  const result = await pool.query(
    `SELECT p.* FROM projects p
     LEFT JOIN project_members pm ON p.id = pm.project_id
     WHERE p.owner_id = $1 OR pm.user_id = $1`,
    [req.user.id]
  );
  res.json(result.rows);
};

const createProject = async (req, res) => {
  const { name, description } = req.body;
  const result = await pool.query(
    'INSERT INTO projects (name, description, owner_id) VALUES ($1,$2,$3) RETURNING *',
    [name, description, req.user.id]
  );
  res.status(201).json(result.rows[0]);
};

const addMember = async (req, res) => {
  const { userId } = req.body;
  const { id } = req.params;
  await pool.query(
    'INSERT INTO project_members (project_id, user_id) VALUES ($1,$2) ON CONFLICT DO NOTHING',
    [id, userId]
  );
  res.json({ message: 'Member added' });
};

const deleteProject = async (req, res) => {
  await pool.query('DELETE FROM projects WHERE id=$1 AND owner_id=$2', [req.params.id, req.user.id]);
  res.json({ message: 'Deleted' });
};

module.exports = { getProjects, createProject, addMember, deleteProject };