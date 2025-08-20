const express = require('express');
const { criarCliente, listarClientes, atualizarCliente, excluirCliente } = require('../controllers/clienteController');

const router = express.Router();

// Rota para listar todos os clientes
router.get('/', listarClientes);

// Rota para criar um novo cliente
router.post('/', criarCliente);

// Rota para atualizar um cliente
router.put('/:id', atualizarCliente);

// Rota para excluir um cliente
router.delete('/:id', excluirCliente);

  

module.exports = router;
