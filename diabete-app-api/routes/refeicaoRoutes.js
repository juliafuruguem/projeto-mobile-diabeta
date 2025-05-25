const express = require('express');
const router = express.Router();
const Refeicao = require('../models/Refeicao');

router.post('/', async (req, res) => {
  try {
    const refeicao = new Refeicao(req.body);
    await refeicao.save();
    res.status(201).json(refeicao);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const dados = await Refeicao.find({ userId: req.params.userId }).sort({ dataHora: -1 });
    res.json(dados);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;