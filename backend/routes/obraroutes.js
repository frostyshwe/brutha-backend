const express = require('express');
const Obra = require('../models/obra');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const obras = await Obra.findAll();
        res.json(obras);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar obras' });
    }
});

router.post('/', async (req, res) => {
    try {
        const novaObra = await Obra.create(req.body);
        res.status(201).json(novaObra);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar obra' });
    }
});

module.exports = router;
