const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { authenticate } = require('./middleware/auth');
const pool = require('./models/db');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => res.send('API running'));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api', require('./routes/tasks'));

// Dashboard
app.get('/api/dashboard', authenticate, async (req, res) => {
  const total = await pool.query('SELECT COUNT(*) FROM tasks WHERE assigned_to=$1', [req.user.id]);
  const overdue = await pool.query(
    "SELECT COUNT(*) FROM tasks WHERE assigned_to=$1 AND due_date < NOW() AND status != 'done'",
    [req.user.id]
  );
  const byStatus = await pool.query(
    'SELECT status, COUNT(*) FROM tasks WHERE assigned_to=$1 GROUP BY status',
    [req.user.id]
  );
  res.json({
    total: total.rows[0].count,
    overdue: overdue.rows[0].count,
    byStatus: byStatus.rows
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));