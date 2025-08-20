const express = require("express");
const router = express.Router();
const InteresseComercial = require("../models/InteresseComercial");

router.get("/", async (req, res) => {
  try {
    const interesses = await InteresseComercial.findAll();
    res.json(interesses);
  } catch (err) {
    console.error("Erro ao buscar interesses:", err);
    res.status(500).json({ error: "Erro ao buscar interesses" });
  }
});

module.exports = router;
