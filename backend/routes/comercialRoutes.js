const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { criarComercial, listarComerciais, atualizarComercial, excluirComercial } = require('../controllers/comercialController');

const router = express.Router();

// Configuração do multer (destino dinâmico)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, '..', 'uploads', 'comercial', req.params.id);
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // pode customizar se quiser timestamp etc
  }
});

const upload = multer({ storage });

// Upload de arquivos
router.post('/:id/anexos', upload.array('anexos'), (req, res) => {
  try {
    const arquivos = req.files.map(file => file.originalname);
    res.status(200).json({ message: 'Upload concluído!', arquivos });
  } catch (err) {
    console.error('Erro ao fazer upload:', err);
    res.status(500).json({ error: 'Erro no upload' });
  }
});

router.get('/:id/anexos', (req, res) => {
    const pasta = path.join(__dirname, '..', 'uploads', 'comercial', req.params.id);
    try {
      const arquivos = fs.existsSync(pasta) ? fs.readdirSync(pasta) : [];
      res.json(arquivos);
    } catch (error) {
      console.error("Erro ao listar anexos:", error);
      res.status(500).json({ error: 'Erro ao listar arquivos' });
    }
  });
  

// Outras rotas
router.get('/', listarComerciais);
router.post('/', criarComercial);
router.put('/:id', atualizarComercial);
router.delete('/:id', excluirComercial);

module.exports = router;
