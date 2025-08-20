// backend/config/database.js
require('dotenv').config();
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 3306),
    dialect: 'mysql',
    logging: false,
    timezone: process.env.DB_TZ || '-03:00', // fuso BR
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,  // ms para conseguir conexão
      idle: 10000      // ms para soltar conexão ociosa
    },
    dialectOptions: {
      charset: 'utf8mb4',
      dateStrings: true,
      // useUTC: false, // descomente se preferir
    },
    define: {
      freezeTableName: false,
      underscored: false
    }
  }
);

// Teste de conexão no boot (útil em deploy)
(async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Conexão com o banco estabelecida!');
  } catch (err) {
    console.error('❌ Erro ao conectar no banco:', err?.message || err);
  }
})();

module.exports = sequelize;
