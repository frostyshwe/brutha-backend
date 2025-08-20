const express = require("express");
const router = express.Router();
const Levantamento = require("../models/Levantamento");
const Orcamento = require("../models/Orcamento");

// Buscar todos os levantamentos por cliente
router.get("/:clienteId", async (req, res) => {
  try {
    const levantamentos = await Levantamento.findAll({
      where: { cliente_id: req.params.clienteId }
    });
    res.json(levantamentos);
  } catch (error) {
    console.error("Erro ao buscar levantamentos:", error);
    res.status(500).json({ error: "Erro ao buscar levantamentos" });
  }
});

// Criar novo levantamento
router.post("/", async (req, res) => {
  try {
    const novo = await Levantamento.create(req.body);
    res.status(201).json(novo);
  } catch (error) {
    console.error("Erro ao criar levantamento:", error);
    res.status(500).json({ error: "Erro ao criar levantamento" });
  }
});

// Finalizar levantamentos -> envia para a tabela de orçamentos
router.post("/finalizar/:clienteId", async (req, res) => {
  try {
    const clienteId = req.params.clienteId;

    // 1. Buscar levantamentos do cliente
    const levantamentos = await Levantamento.findAll({ where: { cliente_id: clienteId } });

    // 2. Buscar orçamentos existentes
    const orcamentosExistentes = await Orcamento.findAll({ where: { cliente_id: clienteId } });

    // 3. Verificar combinações existentes
    const combinacoesExistentes = new Set(
      orcamentosExistentes.map(o => `${o.item}-${o.grupo_item}`)
    );

    // 4. Filtrar e remover ID
    const dadosFiltrados = levantamentos
      .filter(l => !combinacoesExistentes.has(`${l.item}-${l.grupo_item}`))
      .map(l => {
        const { id, ...resto } = l.get({ plain: true });
        return {
          ...resto,
          valor_maodeobra: "",
          cliente_id: clienteId
        };
      });

    if (dadosFiltrados.length === 0) {
      return res.status(200).json({ message: "Nenhum novo levantamento para importar." });
    }

    // 5. Inserir no banco
    await Orcamento.bulkCreate(dadosFiltrados);
    res.json({ message: "Levantamentos finalizados com sucesso!" });

  } catch (error) {
    console.error("Erro ao finalizar levantamentos:", error);
    res.status(500).json({ error: "Erro ao finalizar levantamentos" });
  }
});

module.exports = router;
