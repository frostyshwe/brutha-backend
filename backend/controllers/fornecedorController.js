const Fornecedor = require('../models/Fornecedor');

// Listar todos
const listarFornecedores = async (req, res) => {
  try {
    const fornecedores = await Fornecedor.findAll({ order: [['id', 'DESC']] });
    res.json(fornecedores);
  } catch (error) {
    console.error("❌ Erro ao listar fornecedores:", error);
    res.status(500).json({ error: 'Erro ao listar fornecedores', detalhes: error.message });
  }
};

// Criar
const criarFornecedor = async (req, res) => {
  try {
    const novo = await Fornecedor.create(req.body);
    res.status(201).json(novo);
  } catch (error) {
    console.error("❌ Erro ao criar fornecedor:", error);
    res.status(500).json({ error: 'Erro ao criar fornecedor', detalhes: error.message });
  }
};

// Atualizar
const atualizarFornecedor = async (req, res) => {
  try {
    const { id } = req.params;
    const fornecedor = await Fornecedor.findByPk(id);

    if (!fornecedor) {
      return res.status(404).json({ error: "Fornecedor não encontrado" });
    }

    await fornecedor.update(req.body);
    res.json({ message: "Fornecedor atualizado com sucesso!", fornecedor });
  } catch (error) {
    console.error("❌ Erro ao atualizar fornecedor:", error);
    res.status(500).json({ error: 'Erro ao atualizar fornecedor', detalhes: error.message });
  }
};

// Excluir
const excluirFornecedor = async (req, res) => {
  try {
    const { id } = req.params;
    const fornecedor = await Fornecedor.findByPk(id);

    if (!fornecedor) {
      return res.status(404).json({ error: "Fornecedor não encontrado" });
    }

    await fornecedor.destroy();
    res.json({ message: "Fornecedor excluído com sucesso!" });
  } catch (error) {
    console.error("❌ Erro ao excluir fornecedor:", error);
    res.status(500).json({ error: 'Erro ao excluir fornecedor', detalhes: error.message });
  }
};

module.exports = {
  listarFornecedores,
  criarFornecedor,
  atualizarFornecedor,
  excluirFornecedor
};
