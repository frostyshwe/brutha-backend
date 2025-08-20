const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Comercial = require('./Comercial');

const InteracaoComercial = sequelize.define('InteracaoComercial', {
  tipo_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  data_interacao: {
    type: DataTypes.DATE,
    allowNull: false
  },
  data_retorno: {
    type: DataTypes.DATE,
    allowNull: true
  },
  informacoes: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  comercial_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Comercial,
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'interacoes_comercial',
  timestamps: false
});

Comercial.hasMany(InteracaoComercial, { foreignKey: 'comercial_id' });
InteracaoComercial.belongsTo(Comercial, { foreignKey: 'comercial_id' });

module.exports = InteracaoComercial;
