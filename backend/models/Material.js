const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // ✅ Caminho corrigido

const Material = sequelize.define('Material', {
  nome: {
    type: DataTypes.STRING,
    allowNull: false
  },
  grupo: {
    type: DataTypes.STRING,
    allowNull: false
  },
  unidade_medida: {
    type: DataTypes.STRING,
    allowNull: false
  },
  descricao: {
    type: DataTypes.TEXT
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2)
  },
  quantidade: {
    type: DataTypes.INTEGER
  },
  observacao: {
    type: DataTypes.TEXT
  }
}, {
  tableName: 'materiais',
  timestamps: false
});

module.exports = Material;
