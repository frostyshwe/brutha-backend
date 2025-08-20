const InteracaoComercial = require('../models/InteracaoComercial');
const TipoInteracao = require('../models/TipoInteracao');

// Relacionamento aqui (onde ambos os models já estão carregados)
InteracaoComercial.belongsTo(TipoInteracao, {
  foreignKey: 'tipo_id',
  as: 'tipo'
});

const buscarInteracoesPorComercialId = async (req, res) => {
  try {
    const { id } = req.params;
    const interacoes = await InteracaoComercial.findAll({
      where: { comercial_id: id },
      include: [{ model: TipoInteracao, as: 'tipo' }],
      order: [['data_interacao', 'DESC']]
    });

    res.json(interacoes);
  } catch (error) {
    console.error("❌ Erro ao buscar interações:", error);
    res.status(500).json({ error: "Erro ao buscar interações", detalhes: error.message });
  }
};

const criarInteracao = async (req, res) => {
  try {
    const nova = await InteracaoComercial.create(req.body);

    const novaComTipo = await InteracaoComercial.findOne({
      where: { id: nova.id },
      include: [{ model: TipoInteracao, as: 'tipo' }]
    });

    res.json(novaComTipo);
  } catch (error) {
    console.error("❌ Erro ao criar interação:", error);
    res.status(500).json({ error: "Erro ao criar interação", detalhes: error.message });
  }
};

const excluirInteracao = async (req, res) => {
  try {
    const { id } = req.params;
    const interacao = await InteracaoComercial.findByPk(id);

    if (!interacao) {
      return res.status(404).json({ error: "Interação não encontrada" });
    }

    await interacao.destroy();
    res.status(200).json({ message: "Interação excluída com sucesso!" });
  } catch (error) {
    console.error("❌ Erro ao excluir interação:", error);
    res.status(500).json({ error: "Erro ao excluir interação", detalhes: error.message });
  }
};

module.exports = {
  buscarInteracoesPorComercialId,
  criarInteracao,
  excluirInteracao
};
