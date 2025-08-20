const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const {
  criarFornecedor,
  listarFornecedores,
  atualizarFornecedor,
  excluirFornecedor
} = require('../controllers/fornecedorController');

const router = express.Router();

// Configuração do multer (salva em /uploads/fornecedores/:id)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads', 'fornecedores', req.params.id);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage });

/**
 * ROTAS DE ANEXOS
 */

// Upload de anexos
router.post('/:id/anexos', upload.array('anexos'), (req, res) => {
  try {
    const arquivos = req.files.map(file => file.originalname);
    res.status(200).json({ message: 'Upload concluído!', arquivos });
  } catch (err) {
    console.error('Erro no upload:', err);
    res.status(500).json({ error: 'Erro ao fazer upload de anexos' });
  }
});

// Listar anexos
router.get('/:id/anexos', (req, res) => {
  const pasta = path.join(__dirname, '..', 'uploads', 'fornecedores', req.params.id);
  try {
    const arquivos = fs.existsSync(pasta) ? fs.readdirSync(pasta) : [];
    res.json(arquivos);
  } catch (error) {
    console.error("Erro ao listar anexos:", error);
    res.status(500).json({ error: 'Erro ao listar arquivos' });
  }
});

/**
 * ROTAS CRUD
 */
router.get('/', listarFornecedores);
router.post('/', criarFornecedor);
router.put('/:id', atualizarFornecedor);
router.delete('/:id', excluirFornecedor);

module.exports = router;
