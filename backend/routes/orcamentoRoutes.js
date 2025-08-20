const express = require('express');
const router = express.Router();
const controller = require('../controllers/orcamentoController');
const Orcamento = require('../models/Orcamento');


router.post('/', controller.addOrcamento);
router.get('/:clienteId', controller.getOrcamentosPorCliente);

// ATUALIZAR VALOR MAO DE OBRA
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { valor_maodeobra } = req.body;
  
    try {
      const orcamento = await Orcamento.findByPk(id);
      if (!orcamento) {
        return res.status(404).json({ error: 'Orçamento não encontrado' });
      }
  
      orcamento.valor_maodeobra = valor_maodeobra;
      await orcamento.save();
  
      res.json(orcamento);
    } catch (error) {
      console.error("Erro ao atualizar orçamento:", error);
      res.status(500).json({ error: 'Erro ao atualizar orçamento' });
    }
  });
  

module.exports = router;
