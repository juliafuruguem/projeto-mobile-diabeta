const Glicemia = require('../models/Glicemia');
const Refeicao = require('../models/Refeicao');

const gerarRelatorio = async (req, res) => {
  try {
    const { inicio, fim, usuarioId } = req.query;

    if (!inicio || !fim || !usuarioId) {
      return res.status(400).json({ message: "Parâmetros 'inicio', 'fim' e 'usuarioId' são obrigatórios." });
    }

    const dataInicio = new Date(inicio);
    const dataFim = new Date(fim);

    const glicemias = await Glicemia.find({
      usuario: usuarioId,
      data: { $gte: dataInicio, $lte: dataFim },
    });

    const mediaGlicemia = glicemias.length
      ? glicemias.reduce((acc, item) => acc + item.valor, 0) / glicemias.length
      : 0;

    const refeicoes = await Refeicao.find({
      usuario: usuarioId,
      data: { $gte: dataInicio, $lte: dataFim },
    });

    const mediaCarboidratos = refeicoes.length
      ? refeicoes.reduce((acc, item) => acc + item.carboidratos, 0) / refeicoes.length
      : 0;

    const registrosAltos = glicemias.filter(item => item.valor > 180).length;
    const registrosBaixos = glicemias.filter(item => item.valor < 70).length;

    res.json({
      mediaGlicemia,
      mediaCarboidratos,
      registrosAltos,
      registrosBaixos,
    });
  } catch (error) {
    res.status(500).json({ message: "Erro ao gerar relatório", error: error.message });
  }
};

module.exports = {
  gerarRelatorio,
};
