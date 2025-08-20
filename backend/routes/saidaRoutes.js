const express = require('express');
const router = express.Router();
const controller = require('../controllers/saidaController');

router.post('/', controller.addSaida);
router.get('/:clienteId', controller.getSaidasPorCliente);

module.exports = router;
