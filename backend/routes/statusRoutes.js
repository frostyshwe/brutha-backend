const express = require("express");
const router = express.Router();
const StatusObra = require("../models/StatusObra");

// Rota para listar todos os status da obra
router.get("/", async (req, res) => {
  try {
    const statusList = await StatusObra.findAll();
    res.json(statusList);
  } catch (error) {
    console.error("❌ Erro ao buscar status da obra:", error);
    res.status(500).json({ error: "Erro ao buscar status da obra", detalhes: error.message });
  }
});

module.exports = router;
