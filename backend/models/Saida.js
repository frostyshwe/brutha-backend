const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Saida = sequelize.define('Saida', {
  item: DataTypes.STRING,
  grupo_item: DataTypes.STRING,
  valor_negociado: DataTypes.DECIMAL(10, 2),
  valor_pago: DataTypes.DECIMAL(10, 2),
  previsto: DataTypes.BOOLEAN,
  origem_pagamento: DataTypes.STRING,
  dt_saida: DataTypes.DATEONLY,
  obs: DataTypes.TEXT,
  cliente_id: DataTypes.INTEGER
}, {
  tableName: 'saidas',
  timestamps: false
});

module.exports = Saida;
