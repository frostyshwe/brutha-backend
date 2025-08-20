const Entrada = require('../models/Entrada');

// Adicionar nova entrada
exports.addEntrada = async (req, res) => {
  try {
    const novaEntrada = await Entrada.create(req.body);
    res.json({ message: 'Entrada salva com sucesso', id: novaEntrada.id });
  } catch (err) {
    console.error('Erro ao salvar entrada:', err);
    res.status(500).json({ error: err.message });
  }
};

// Buscar entradas por cliente
exports.getEntradasPorCliente = async (req, res) => {
  try {
    const clienteId = req.params.clienteId;
    const entradas = await Entrada.findAll({ where: { cliente_id: clienteId } });
    res.json(entradas);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
