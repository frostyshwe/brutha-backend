const express = require('express');
const router = express.Router();
const controller = require('../controllers/entradaController');

router.post('/', controller.addEntrada);
router.get('/:clienteId', controller.getEntradasPorCliente);

module.exports = router;
