const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // ajusta se seu arquivo de conexão estiver em outro lugar

const Comercial = sequelize.define('Comercial', {
  contato: {
    type: DataTypes.STRING,
    allowNull: false
  },
  empresa: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cargo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  data_cadastro: {
    type: DataTypes.DATEONLY,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  telefone_comercial: {
    type: DataTypes.STRING,
    allowNull: true
  },
  telefone_whatsapp: {
    type: DataTypes.STRING,
    allowNull: true
  },
  origem_lead: {
    type: DataTypes.STRING,
    allowNull: true
  },
  indicado_por: {
    type: DataTypes.STRING,
    allowNull: true
  },
  interesse: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: true
  },
  anexos: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  criado_em: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'comercial',
  timestamps: false // já tem o campo criado_em manual
});

module.exports = Comercial;
