const Saida = require('../models/Saida');

// Adicionar nova saída
exports.addSaida = async (req, res) => {
  try {
    const nova = await Saida.create(req.body);
    res.json({ message: 'Saída salva com sucesso', id: nova.id });
  } catch (err) {
    console.error('Erro ao salvar saída:', err);
    res.status(500).json({ error: err.message });
  }
};

// Buscar saídas por cliente
exports.getSaidasPorCliente = async (req, res) => {
  try {
    const clienteId = req.params.clienteId;
    const saidas = await Saida.findAll({ where: { cliente_id: clienteId } });
    res.json(saidas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
