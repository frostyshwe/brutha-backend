const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Entrada = sequelize.define('Entrada', {
  item: DataTypes.STRING,
  grupo_item: DataTypes.STRING,
  valor: DataTypes.DECIMAL(10, 2),
  origem_recebimento: DataTypes.STRING,
  dt_entrada: DataTypes.DATEONLY,
  obs: DataTypes.TEXT,
  cliente_id: DataTypes.INTEGER
}, {
  tableName: 'entradas',
  timestamps: false
});

module.exports = Entrada;
