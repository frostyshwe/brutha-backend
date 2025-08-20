const express = require('express');
const router = express.Router();
const controller = require('../controllers/reembolsoController');

router.post('/', controller.addReembolso);
router.get('/:clienteId', controller.getReembolsosPorCliente);

module.exports = router;
