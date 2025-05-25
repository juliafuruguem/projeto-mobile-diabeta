const Refeicao = require('../models/Refeicao');

exports.createRefeicao = async (req, res) => {
  try {
    const {
      tipoRefeicao, alimentos, totalCarboidratos,
      totalProteinas, totalGorduras, totalCalorias,
      dataHora, userId
    } = req.body;

    const refeicao = new Refeicao({
      tipoRefeicao, alimentos, totalCarboidratos,
      totalProteinas, totalGorduras, totalCalorias,
      dataHora, userId
    });

    await refeicao.save();
    res.status(201).json({ message: 'Refeição registrada com sucesso', refeicao });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao registrar refeição', error: error.message });
  }
};

exports.getRefeicoesByUser = async (req, res) => {
  try {
    const refeicoes = await Refeicao.find({ userId: req.params.userId });
    res.status(200).json(refeicoes);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar refeições', error: error.message });
  }
};