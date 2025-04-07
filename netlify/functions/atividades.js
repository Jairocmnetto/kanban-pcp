exports.handler = async (event, context) => {
  const mysql = require('mysql2/promise');

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });

    await connection.query("SELECT 1"); // teste simples
    await connection.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Conexão bem-sucedida!" }),
    };
  } catch (error) {
    console.error("Erro de conexão:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Falha na conexão", detalhes: error.message }),
    };
  }
};
