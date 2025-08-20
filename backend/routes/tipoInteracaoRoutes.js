const express = require("express");
const router = express.Router();
const TipoInteracao = require("../models/TipoInteracao");

// Rota para listar todos os tipos de interação
router.get("/", async (req, res) => {
  try {
    const tipos = await TipoInteracao.findAll();
    res.json(tipos);
  } catch (error) {
    console.error("❌ Erro ao buscar tipos de interação:", error);
    res.status(500).json({ error: "Erro ao buscar tipos", detalhes: error.message });
  }
});

module.exports = router;
