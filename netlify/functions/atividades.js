const mysql = require('mysql2/promise');

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
    const [rows] = await pool.query(`
      SELECT * FROM atividades
      ORDER BY FIELD(prioridade, 'Critico', 'Urgente', 'Regular', 'Normal')
    `);

    return {
      statusCode: 200,
      body: JSON.stringify(rows),
    };
  } catch (error) {
    console.error("Erro ao processar a requisição:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao processar a requisição", detalhes: error.message }),
    };
  }
};
