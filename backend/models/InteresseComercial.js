const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const InteresseComercial = sequelize.define("InteresseComercial", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome: { type: DataTypes.STRING, allowNull: false }
}, {
  tableName: "interesse_comercial",
  timestamps: false
});

module.exports = InteresseComercial;
