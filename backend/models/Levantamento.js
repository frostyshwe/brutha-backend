const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Levantamento = sequelize.define('Levantamento', {
  item: DataTypes.STRING,
  grupo_item: DataTypes.STRING,
  descricao_item: DataTypes.STRING,
  fornecedor: DataTypes.STRING,
  unidade_medida: DataTypes.STRING,
  quantidade: DataTypes.STRING,
  dt_levantamento: DataTypes.DATEONLY,
  orcamento_vencedor: DataTypes.STRING,
  vencimento: DataTypes.STRING,
  obs: DataTypes.STRING,
  cliente_id: DataTypes.INTEGER
}, {
  tableName: 'levantamentos',
  timestamps: false
});

module.exports = Levantamento;
  