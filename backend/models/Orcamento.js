const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // ou '../db' dependendo do nome do seu arquivo

const Orcamento = sequelize.define('Orcamento', {
  item: DataTypes.STRING,
  grupo_item: DataTypes.STRING,
  descricao_item: DataTypes.TEXT,
  detalhamento_item: DataTypes.TEXT,
  fornecedor: DataTypes.STRING,
  unidade_medida: DataTypes.STRING,
  quantidade: DataTypes.DECIMAL(10, 2),
  valor_maodeobra: DataTypes.DECIMAL(10, 2),
  dt_orcamento: DataTypes.DATEONLY, // CORRETO AQUI
  orcamento_vencedor: DataTypes.BOOLEAN,
  vencimento: DataTypes.DATEONLY,
  obs: DataTypes.TEXT,
  cliente_id: DataTypes.INTEGER
}, {
  tableName: 'Orcamento',
  timestamps: false
});

module.exports = Orcamento;
