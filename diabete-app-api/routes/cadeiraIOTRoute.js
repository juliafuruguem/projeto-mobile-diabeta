const express = require('express');
const router = express.Router();
const CadeiraIOT = require('../models/cadeiraIOT');

router.post('/', async (req, res) => {
  try {
console.log("chegou request")

    const {
        usuario,
        sentou
    } = req.body;

    const dataAtualNode = await new Date();

    const formatterParts = await new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Sao_Paulo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // Garante formato 24h para as horas
    });

    const parts = await formatterParts.formatToParts(dataAtualNode);

    const dataRegistro = await {
        dia: parts.find(p => p.type === 'day').value,
        mes: parts.find(p => p.type === 'month').value,
        ano: parts.find(p => p.type === 'year').value,
        horas: parts.find(p => p.type === 'hour').value,
        minutos: parts.find(p => p.type === 'minute').value
    };

    const cadeiraIOT = new CadeiraIOT({
      usuario,
      sentou,
      dataRegistro
    });

    await cadeiraIOT.save();

    res.status(201).json({
      message: 'Evento cadastrado com sucesso'
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const usuario = req.query.usuario;

    if (!usuario) {
      return res.status(400).json({ message: 'Nome do usuário não fornecido' });
    }

    const evento = await CadeiraIOT.findOne({ usuario: usuario }).sort({ createdAt: -1 });

    if (!evento) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json(evento);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar usuário', error: err.message });
  }
});

module.exports = router;
