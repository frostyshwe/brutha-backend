const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const ServicoObra = require("./ServicoObra");
const StatusObra = require("./StatusObra");

const Cliente = sequelize.define("Cliente", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  documento: { type: DataTypes.STRING, allowNull: false },
  responsavel: { type: DataTypes.STRING, allowNull: false },
  contato: { type: DataTypes.STRING, allowNull: false },
  prazo: { type: DataTypes.INTEGER, allowNull: true },
  data_inicio: { type: DataTypes.DATE, allowNull: true },
  data_fim: { type: DataTypes.DATE, allowNull: true },
  servico_id: { type: DataTypes.INTEGER, references: { model: 'servicos_obra', key: 'id' }},
  status_id: { type: DataTypes.INTEGER, references: { model: 'status_obra', key: 'id' }},
}, {
  tableName: "clientes",
  timestamps: false
});

Cliente.belongsTo(ServicoObra, { foreignKey: "servico_id", as: "ServicoObra" });
Cliente.belongsTo(StatusObra, { foreignKey: "status_id", as: "StatusObra" });

module.exports = Cliente;
