const express = require("express");
const router = express.Router();
const OrigemCliente = require("../models/origemCliente");

router.get("/", async (req, res) => {
  try {
    const origens = await OrigemCliente.findAll();
    res.json(origens);
  } catch (err) {
    console.error("Erro ao buscar origens:", err);
    res.status(500).json({ error: "Erro ao buscar origens" });
  }
});

module.exports = router;
