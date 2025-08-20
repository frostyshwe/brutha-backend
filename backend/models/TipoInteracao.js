const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const TipoInteracao = sequelize.define("TipoInteracao", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: "tipo_interacao",
  timestamps: false
});

module.exports = TipoInteracao;
