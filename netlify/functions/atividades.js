

















const mysql = require('mysql2/promise');

console.log("DB_HOST:", process.DB_HOST);
console.log("DB_USER:", process.DB_USER);
console.log("DB_PASSWORD:", process.DB_PASSWORD);
console.log("DB_NAME:", process.DB_NAME);


const pool = mysql.createPool({
  host: process.DB_HOST,       // Essas variáveis serão definidas no painel do Netlify
  user: process.DB_USER,
  password: process.DB_PASSWORD,
  database: process.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
});

exports.handler = async (event, context) => {
  try {
    const method = event.httpMethod;
    // Para identificar qual rota usar, você pode olhar o path (simplificado)
    if (method === "GET") {
      const [rows] = await pool.query(`
        SELECT * FROM atividades
        ORDER BY FIELD(prioridade, 'Critico', 'Urgente', 'Regular', 'Normal')
      `);
      return {
        statusCode: 200,
        body: JSON.stringify(rows),
      };
    }

    if (method === "POST") {
      const data = JSON.parse(event.body);
      const [result] = await pool.query("INSERT INTO atividades SET ?", data);
      return {
        statusCode: 201,
        body: JSON.stringify({ id: result.insertId, ...data }),
      };
    }

    if (method === "PUT" && event.path.endsWith("/status")) {
      const segments = event.path.split("/");
      const atividadeId = segments[segments.length - 2];
      const data = JSON.parse(event.body);
      await pool.query("UPDATE atividades SET status = ? WHERE id = ?", [data.status, atividadeId]);
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true }),
      };
    }

    return {
      statusCode: 405,
      body: "Método não permitido",
    };
  } catch (err) {
    console.error("Erro na função:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Erro ao processar a requisição" }),
    };
  }
};
