const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const OrigemCliente = sequelize.define("OrigemCliente", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: "origem_cliente",
  timestamps: false
});

module.exports = OrigemCliente;
