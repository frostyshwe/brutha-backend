const express = require("express");
const router = express.Router();
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const Orcamento = require("../models/Orcamento");
const Cliente = require("../models/cliente"); // se ainda não tiver importado

// Finalizar orçamento e gerar PDF
router.get("/finalizar/:clienteId", async (req, res) => {
  try {
    const { clienteId } = req.params;

    // Buscar cliente para usar no nome do arquivo
    const cliente = await Cliente.findByPk(clienteId);
    if (!cliente) return res.status(404).json({ error: "Cliente não encontrado" });

    const nomeArquivo = `Cliente_${cliente.nome.replace(/\s+/g, "_")}_orcamento.pdf`;

    const doc = new PDFDocument({
      size: "A4",
      layout: "portrait",
      margin: 0,
    });

    const outputPath = path.join(__dirname, "..", "temp", nomeArquivo);
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    const imagePaths = [
      "1.png", "2.png", "3.png", "4.png",
      "5.png", "6.png", "7.png", "8.png",
    ].map(name => path.join(__dirname, "..", "assets", "proposta", name));

    imagePaths.forEach((imgPath, index) => {
      if (index > 0) doc.addPage();
      doc.image(imgPath, 0, 0, { width: 595.28, height: 841.89 });
    });

    doc.end();

    stream.on("finish", () => {
      res.download(outputPath, nomeArquivo, (err) => {
        if (err) console.error("Erro no download:", err);
        fs.unlink(outputPath, () => {}); // Apaga depois de baixar
      });
    });
  } catch (err) {
    console.error("Erro ao finalizar orçamento:", err);
    res.status(500).json({ error: "Erro ao finalizar orçamento" });
  }
});

router.post("/selecionados", async (req, res) => {
  try {
    const { clienteId, orcamentoIds } = req.body;

    const cliente = await Cliente.findByPk(clienteId);
    if (!cliente) return res.status(404).json({ error: "Cliente não encontrado" });

    const orcamentos = await Orcamento.findAll({
      where: {
        id: orcamentoIds,
        cliente_id: clienteId
      }
    });

    if (!orcamentos.length) {
      return res.status(400).json({ error: "Nenhum orçamento encontrado para os IDs fornecidos" });
    }

    const nomeArquivo = `Cliente_${cliente.nome.replace(/\s+/g, "_")}_orcamento_selecionado.pdf`;
    const outputPath = path.join(__dirname, "..", "temp", nomeArquivo);

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const stream = fs.createWriteStream(outputPath);
    doc.pipe(stream);

    doc.fontSize(18).text(`Proposta de Orçamento`, { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Cliente: ${cliente.nome}`);
    doc.moveDown();

    orcamentos.forEach((o, i) => {
      doc.fontSize(12).text(`Item ${i + 1}`);
      doc.text(`Item: ${o.item}`);
      doc.text(`Grupo: ${o.grupo_item}`);
      doc.text(`Descrição: ${o.descricao_item}`);
      doc.text(`Unidade: ${o.unidade_medida}`);
      doc.text(`Quantidade: ${o.quantidade}`);
      doc.text(`Valor Mão de Obra: ${o.valor_maodeobra}`);
      doc.moveDown();
    });

    doc.end();

    stream.on("finish", () => {
      res.download(outputPath, nomeArquivo, (err) => {
        if (err) console.error("Erro no download:", err);
        fs.unlink(outputPath, () => {});
      });
    });

  } catch (err) {
    console.error("Erro ao gerar PDF selecionado:", err);
    res.status(500).json({ error: "Erro ao gerar PDF dos orçamentos selecionados" });
  }
});



module.exports = router;