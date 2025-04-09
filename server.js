const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Rotas da API
app.get('/api/atividades', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM atividades');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/atividades', async (req, res) => {
  const { cargo, nome, titulo, descricao, prioridade, status } = req.body;
  try {
    await pool.query(
      'INSERT INTO atividades (cargo, nome, titulo, descricao, prioridade, status) VALUES ($1, $2, $3, $4, $5, $6)',
      [cargo, nome, titulo, descricao, prioridade, status]
    );
    res.status(201).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/atividades/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query('UPDATE atividades SET status = $1 WHERE id = $2', [status, id]);
    res.status(200).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
