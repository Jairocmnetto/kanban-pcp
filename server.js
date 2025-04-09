require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 3000;

// **ALTERAÇÃO**: use a string de conexão que você encontrou
const connectionString =
  process.env.DATABASE_URL ||
  'postgres://postgres:IzePzCJWaMAZIAZEaBpZVJAxiXFtNbSR@mainline.proxy.rlwy.net:14502/railway';

const pool = new Pool({
  connectionString,
  ssl: { rejectUnauthorized: false }
});

app.use(cors());
app.use(express.json());

// GET /api/atividades
app.get('/api/atividades', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM atividades ORDER BY prioridade');
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar atividades' });
  }
});

// PUT /api/atividades/:id/status
app.put('/api/atividades/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    await pool.query('UPDATE atividades SET status = $1 WHERE id = $2', [status, id]);
    res.sendStatus(204);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar status' });
  }
});

// POST /api/atividades
app.post('/api/atividades', async (req, res) => {
  const { cargo, nome, titulo, descricao, prioridade, status } = req.body;
  try {
    const query = `
      INSERT INTO atividades(cargo, nome, titulo, descricao, prioridade, status)
      VALUES($1, $2, $3, $4, $5, $6) RETURNING *`;
    const values = [cargo, nome, titulo, descricao, prioridade, status];
    const { rows } = await pool.query(query, values);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar atividade' });
  }
});

app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`);
});
