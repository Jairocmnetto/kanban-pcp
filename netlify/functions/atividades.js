const mysql = require('mysql2/promise');

// Configure a conexão com o banco usando variáveis de ambiente configuradas no Netlify
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

exports.handler = async (event, context) => {
  try {
    // Verifica o método HTTP
    if (event.httpMethod !== "GET") {
      return { statusCode: 405, body: "Método não permitido" };
    }
    const [rows] = await pool.query(`
      SELECT * FROM atividades
      ORDER BY FIELD(prioridade, 'Critico', 'Urgente', 'Regular', 'Normal')
    `);
    return {
      statusCode: 200,
      body: JSON.stringify(rows),
    };
  } catch (err) {
    console.error("Erro na função:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao processar a requisição" }),
    };
  }
};
