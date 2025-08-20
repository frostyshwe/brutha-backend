const express = require('express');
const router = express.Router();
const Material = require('../models/Material');

// GET todos
router.get('/', async (req, res) => {
  try {
    const materiais = await Material.findAll();
    res.json(materiais);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar materiais' });
  }
});

// POST novo
router.post('/', async (req, res) => {
  try {
    const novo = await Material.create(req.body);
    res.json(novo);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao adicionar material' });
  }
});

// PUT atualizar
router.put('/:id', async (req, res) => {
  try {
    await Material.update(req.body, { where: { id: req.params.id } });
    const atualizado = await Material.findByPk(req.params.id);
    res.json(atualizado);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao atualizar material' });
  }
});

// DELETE
router.delete('/:id', async (req, res) => {
  try {
    await Material.destroy({ where: { id: req.params.id } });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao excluir material' });
  }
});

module.exports = router;
