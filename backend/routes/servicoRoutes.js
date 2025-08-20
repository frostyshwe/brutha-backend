const express = require('express');
const router = express.Router();
const ServicoObra = require('../models/ServicoObra');

// GET /servicos_obra - lista todos os serviços com categoria
router.get('/', async (req, res) => {
  try {
    const servicos = await ServicoObra.findAll({
      attributes: ['id', 'categoria_servico', 'servico']
    });
    res.json(servicos);
  } catch (error) {
    console.error("Erro ao buscar serviços:", error);
    res.status(500).json({ error: 'Erro ao buscar serviços' });
  }
});

module.exports = router;
