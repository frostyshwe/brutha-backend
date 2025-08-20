const { DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // ajuste se o caminho da conexão for outro

const Fornecedor = sequelize.define('Fornecedor', {
  empresa: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cnpj: {
    type: DataTypes.STRING,
    allowNull: true
  },
  atividade: {
    type: DataTypes.STRING,
    allowNull: false
  },
  nome_contato: {
    type: DataTypes.STRING,
    allowNull: false
  },
  telefone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  telefone_whatsapp: {
    type: DataTypes.STRING,
    allowNull: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true
  },
  cidade_estado: {
    type: DataTypes.STRING,
    allowNull: true
  },
  site_redes: {
    type: DataTypes.STRING,
    allowNull: true
  },
  anotacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.STRING,
    allowNull: false
  },
  data_cadastro: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  avaliacao: {
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
  tableName: 'fornecedores',
  timestamps: false
});

module.exports = Fornecedor;
