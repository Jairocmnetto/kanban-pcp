const mysql = require('mysql2/promise');

// Log para verificar se as variáveis estão sendo lidas
console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD);
console.log("DB_NAME:", process.env.DB_NAME);

const pool = mysql.createPool({
  host: process.env.DB_HOST,       // Essas variáveis devem ser configuradas no painel do Netlify
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

exports.handler = async (event, context) => {
  try {
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
    console.error("Erro na função atividades:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro interno no servidor" }),
    };
  }
};
