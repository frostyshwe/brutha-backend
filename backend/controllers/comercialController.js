const Comercial = require('../models/Comercial');
const InteracoesComercial = require('../models/InteracaoComercial');

// Criar um novo lead comercial
const criarComercial = async (req, res) => {
  try {
    const novo = await Comercial.create(req.body);

    // Criação automática da interação
await InteracoesComercial.create({
  tipo_id: 19,
  data_interacao: novo.data_cadastro, // <- pega do comercial criado
  retorno: null,
  informacoes: "Interação criada automaticamente no cadastro.",
  comercial_id: novo.id
});

    res.status(201).json(novo);
  } catch (error) {
    console.error("❌ Erro ao criar lead comercial:", error);
    res.status(500).json({ error: 'Erro ao criar lead', detalhes: error.message });
  }
};

// Listar todos os leads comerciais
const listarComerciais = async (req, res) => {
    try {
        const comerciais = await Comercial.findAll();
        res.json(comerciais);
    } catch (error) {
        console.error("❌ Erro ao buscar leads comerciais:", error);
        res.status(500).json({ error: 'Erro ao buscar comerciais', detalhes: error.message });
    }
};

// Atualizar lead comercial
const atualizarComercial = async (req, res) => {
    try {
        const { id } = req.params;
        const comercial = await Comercial.findByPk(id);

        if (!comercial) {
            return res.status(404).json({ error: "Lead comercial não encontrado" });
        }

        await comercial.update(req.body);
        res.json({ message: "Lead comercial atualizado com sucesso!", comercial });
    } catch (error) {
        console.error("❌ Erro ao atualizar lead comercial:", error);
        res.status(500).json({ error: 'Erro ao atualizar lead comercial', detalhes: error.message });
    }
};

// Excluir lead comercial
const excluirComercial = async (req, res) => {
    try {
        const { id } = req.params;
        const comercial = await Comercial.findByPk(id);

        if (!comercial) {
            return res.status(404).json({ error: "Lead comercial não encontrado" });
        }

        await comercial.destroy();
        res.json({ message: "Lead comercial excluído com sucesso!" });
    } catch (error) {
        console.error("❌ Erro ao excluir lead comercial:", error);
        res.status(500).json({ error: 'Erro ao excluir lead comercial', detalhes: error.message });
    }
};

module.exports = {
    criarComercial,
    listarComerciais,
    atualizarComercial,
    excluirComercial
};
