const Reembolso = require('../models/Reembolso');

// Adicionar novo reembolso
exports.addReembolso = async (req, res) => {
  try {
    const novo = await Reembolso.create(req.body);
    res.json({ message: 'Reembolso salvo com sucesso', id: novo.id });
  } catch (err) {
    console.error('Erro ao salvar reembolso:', err);
    res.status(500).json({ error: err.message });
  }
};

// Buscar reembolsos por cliente
exports.getReembolsosPorCliente = async (req, res) => {
  try {
    const clienteId = req.params.clienteId;
    const reembolsos = await Reembolso.findAll({ where: { cliente_id: clienteId } });
    res.json(reembolsos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
