const express = require("express");
const { PDFDocument, rgb } = require("pdf-lib");
const fs = require("fs");
const path = require("path");
const fontkit = require("@pdf-lib/fontkit");
const router = express.Router();

// MODELOS
const Cliente = require("../models/cliente");
const ServicoObra = require("../models/ServicoObra");

// ROTA PARA GERAR PROPOSTA
router.post("/gerar-proposta", async (req, res) => {
  try {
    const { clienteId } = req.body;

    // Busca o cliente com o serviço relacionado
    const cliente = await Cliente.findByPk(clienteId, {
      include: [{ model: ServicoObra, as: "ServicoObra" }]
    });

    if (!cliente) {
      return res.status(404).send("Cliente não encontrado");
    }

    const nome = cliente.nome;
    const servico = cliente.ServicoObra?.servico || "Serviço não especificado";

    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    const page = pdfDoc.addPage([595, 842]);

    // Imagem de fundo
    const imagePath = path.join(__dirname, "../assets/proposta/Pag1_Proposta.png");
    const imageBytes = fs.readFileSync(imagePath);
    const image = await pdfDoc.embedPng(imageBytes);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width: page.getWidth(),
      height: page.getHeight(),
    });

    // Fonte personalizada
    const fontPath = path.join(__dirname, "../assets/fonts/Montserrat-Regular.ttf");
    const fontBytes = fs.readFileSync(fontPath);
    const font = await pdfDoc.embedFont(fontBytes);

    // Textos dinâmicos
    page.drawText(`${nome}`, {
      x: 283,
      y: 169,
      size: 15,
      font,
      color: rgb(1, 1, 1),
    });

    page.drawText(`${servico}`, {
      x: 287,
      y: 146,
      size: 15,
      font,
      color: rgb(1, 1, 1),
    });

    const pdfBytes = await pdfDoc.save();

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=proposta_${nome.replace(/\s+/g, "_")}.pdf`);
    res.end(Buffer.from(pdfBytes)); // ✅ resolve erro de PDF corrompido
  } catch (err) {
    console.error("Erro ao gerar PDF:", err);
    res.status(500).send("Erro ao gerar proposta.");
  }
});

module.exports = router;
