const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Obra = sequelize.define('Obra', {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nome: { type: DataTypes.STRING, allowNull: false },
    descricao: { type: DataTypes.TEXT },
    cliente_id: { type: DataTypes.INTEGER, references: { model: 'clientes', key: 'id' }, allowNull: false },
    status: { type: DataTypes.ENUM('Planejamento', 'Em andamento', 'Paralisada', 'Concluída', 'Cancelada'), defaultValue: 'Planejamento' },
    data_inicio: { type: DataTypes.DATE },
    data_prevista_conclusao: { type: DataTypes.DATE },
    data_real_conclusao: { type: DataTypes.DATE },
    endereco: { type: DataTypes.TEXT },
    cidade: { type: DataTypes.STRING },
    estado: { type: DataTypes.STRING },
    cep: { type: DataTypes.STRING },
    responsavel_obra: { type: DataTypes.STRING },
}, {
    tableName: 'obras',
    timestamps: true
});

module.exports = Obra;
