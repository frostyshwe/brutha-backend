const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Reembolso = sequelize.define('Reembolso', {
  item: DataTypes.STRING,
  grupo_item: DataTypes.STRING,
  local_compra: DataTypes.STRING,
  responsavel_compra: DataTypes.STRING,
  valor: DataTypes.DECIMAL(10, 2),
  dt_compra: DataTypes.DATEONLY,
  responsavel_reembolso: DataTypes.STRING,
  dt_reembolso: DataTypes.DATEONLY,
  status_reembolso: DataTypes.STRING,
  cliente_id: DataTypes.INTEGER
}, {
  tableName: 'reembolsos',
  timestamps: false
});

module.exports = Reembolso;
