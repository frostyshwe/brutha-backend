const Cliente = require('../models/cliente');
const ServicoObra = require('../models/ServicoObra');
const StatusObra = require('../models/StatusObra');

// Criar um novo cliente
const criarCliente = async (req, res) => {
    try {
        console.log("📩 Dados recebidos no backend:", req.body);
        const novoCliente = await Cliente.create(req.body);
        res.status(201).json(novoCliente);
    } catch (error) {
        console.error("❌ Erro ao criar cliente:", error);
        res.status(500).json({ error: 'Erro ao criar cliente', detalhes: error.message });
    }
};

// Listar todos os clientes com os relacionamentos
const listarClientes = async (req, res) => {
    try {
        const clientes = await Cliente.findAll({
            include: [
                {
                    model: ServicoObra,
                    as: 'ServicoObra',
                    attributes: ['categoria_servico', 'servico']
                },
                {
                    model: StatusObra,
                    as: 'StatusObra',
                    attributes: ['categoria_status', 'status']
                }
            ]
        })
        res.json(clientes);
    } catch (error) {
        console.error("❌ ERRO DETALHADO AO BUSCAR CLIENTES:", error);
        res.status(500).json({ error: 'Erro ao buscar clientes', detalhes: error.message });
    }
};

// Atualizar um cliente
const atualizarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`✏️ Atualizando cliente ID: ${id}`);
        
        const cliente = await Cliente.findByPk(id);
        if (!cliente) {
            return res.status(404).json({ error: "Cliente não encontrado" });
        }

        await cliente.update(req.body);
        res.json({ message: "Cliente atualizado com sucesso!", cliente });
    } catch (error) {
        console.error("❌ Erro ao atualizar cliente:", error);
        res.status(500).json({ error: 'Erro ao atualizar cliente', detalhes: error.message });
    }
};

// Excluir um cliente
const excluirCliente = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🗑️ Excluindo cliente ID: ${id}`);
        
        const cliente = await Cliente.findByPk(id);
        if (!cliente) {
            return res.status(404).json({ error: "Cliente não encontrado" });
        }

        await cliente.destroy();
        res.json({ message: "Cliente excluído com sucesso!" });
    } catch (error) {
        console.error("❌ Erro ao excluir cliente:", error);
        res.status(500).json({ error: 'Erro ao excluir cliente', detalhes: error.message });
    }
};

module.exports = {
    criarCliente,
    listarClientes,
    atualizarCliente,
    excluirCliente
};
