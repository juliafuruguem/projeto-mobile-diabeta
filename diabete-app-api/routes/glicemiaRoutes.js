const express = require('express');
const router = express.Router();
const Glicemia = require('../models/Glicemia');

router.post('/', async (req, res) => {
  try {
    const { userId, valor, periodo } = req.body;

    if (!userId || !valor) {
      return res.status(400).json({ message: 'userId e valor são obrigatórios' });
    }

    const glicemia = new Glicemia({
      userId,
      valor,
      periodo
    });

    await glicemia.save();
    
    res.status(201).json({
      message: 'Registro de glicemia salvo com sucesso',
      glicemia: {
        userId: glicemia.userId,
        valor: glicemia.valor,
        periodo: glicemia.periodo,
        dataHora: glicemia.dataHora
      }
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/:userId', async (req, res) => {
  try {
    const dados = await Glicemia.find({ userId: req.params.userId })
      .sort({ dataHora: -1 });

    if (!dados || dados.length === 0) {
      return res.status(404).json({ message: 'Nenhum registro de glicemia encontrado para este usuário' });
    }

    res.json(dados);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;