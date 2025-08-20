const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const ServicoObra = sequelize.define("ServicoObra", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  servico: { type: DataTypes.STRING, allowNull: false },
  categoria_servico: { type: DataTypes.STRING, allowNull: false },
  descricao: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName: "servicos_obra",
  timestamps: false
});

module.exports = ServicoObra;
