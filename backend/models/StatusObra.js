const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const StatusObra = sequelize.define("StatusObra", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  status: { type: DataTypes.STRING, allowNull: false },
  categoria_status: { type: DataTypes.STRING, allowNull: false },
  descricao: { type: DataTypes.TEXT, allowNull: true }
}, {
  tableName: "status_obra",
  timestamps: false
});

module.exports = StatusObra;
