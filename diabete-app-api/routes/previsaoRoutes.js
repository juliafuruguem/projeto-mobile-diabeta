const express = require('express');
const router = express.Router();
const Previsao = require('../models/Previsao');

router.post('/', async (req, res) => {
  const { userId, historico } = req.body;

  const previsoes = gerarPrevisaoComIA(historico);

  await Previsao.insertMany(
    previsoes.map(p => ({ userId, ...p }))
  );

  res.status(201).json(previsoes);
});

router.get('/:userId', async (req, res) => {
  try {
    const dados = await Previsao.find({ userId: req.params.userId }).sort({ dataHoraGerada: -1 });
    res.json(dados);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;