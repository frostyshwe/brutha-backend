const Orcamento = require('../models/Orcamento');

// Adicionar orçamento (usando Sequelize corretamente)
exports.addOrcamento = async (req, res) => {
  try {
    const novo = await Orcamento.create({
      item: req.body.item,
      grupo_item: req.body.grupo_item,
      descricao_item: req.body.descricao_item,
      detalhamento_item: req.body.detalhamento_item,
      fornecedor: req.body.fornecedor,
      unidade_medida: req.body.unidade_medida,
      quantidade: req.body.quantidade,
      valor_maodeobra: req.body.valor_maodeobra,
      dt_orcamento: req.body.dt_orcamento, // CORRETO AQUI
      orcamento_vencedor: req.body.orcamento_vencedor,
      vencimento: req.body.vencimento,
      obs: req.body.obs,
      cliente_id: req.body.cliente_id
    });

    res.json({ message: 'Orçamento salvo com sucesso', id: novo.id });
  } catch (err) {
    console.error('Erro ao salvar orçamento:', err);
    res.status(500).json({ error: err.message });
  }
};

// Buscar orçamentos por cliente
exports.getOrcamentosPorCliente = async (req, res) => {
  try {
    const clienteId = req.params.clienteId;
    const orcamentos = await Orcamento.findAll({ where: { cliente_id: clienteId } });
    res.json(orcamentos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Editar orçamento
exports.updateOrcamento = async (req, res) => {
  try {
    const id = req.params.id;
    const [updated] = await Orcamento.update(req.body, { where: { id } });
    if (updated) {
      res.json({ message: 'Orçamento atualizado com sucesso' });
    } else {
      res.status(404).json({ error: 'Orçamento não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Deletar orçamento
exports.deleteOrcamento = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await Orcamento.destroy({ where: { id } });
    if (deleted) {
      res.json({ message: 'Orçamento deletado com sucesso' });
    } else {
      res.status(404).json({ error: 'Orçamento não encontrado' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
