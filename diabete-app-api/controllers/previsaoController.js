const Previsao = require('../models/Previsao');

exports.createPrevisao = async (req, res) => {
  try {
    const { mensagem, dataHoraGerada, userId } = req.body;
    const previsao = new Previsao({ mensagem, dataHoraGerada, userId });
    await previsao.save();
    res.status(201).json({ message: 'Previsão criada com sucesso', previsao });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao criar previsão', error: error.message });
  }
};

exports.getPrevisoesByUser = async (req, res) => {
  try {
    const previsoes = await Previsao.find({ userId: req.params.userId });
    res.status(200).json(previsoes);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar previsões', error: error.message });
  }
};