const express = require('express');
const {
  criarInteracao,
  buscarInteracoesPorComercialId,
  excluirInteracao
} = require('../controllers/InteracaoComercialController');

const router = express.Router();

router.get('/:id', buscarInteracoesPorComercialId); // OK
router.post('/', criarInteracao);
router.delete('/:id', excluirInteracao); // OK

module.exports = router;
