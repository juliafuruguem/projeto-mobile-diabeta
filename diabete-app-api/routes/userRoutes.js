const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/', async (req, res) => {
  try {
    const {
      nome,
      sexo,
      idade,
      altura,
      peso,
      tipoDiabetes,
      metaGlicemia
    } = req.body;

    const user = new User({
      nome,
      sexo,
      idade,
      altura,
      peso,
      tipoDiabetes,
      metaGlicemia
    });

    await user.save();

    res.status(201).json({
      message: 'Usuário cadastrado com sucesso',
      userId: user._id,
      user
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const nome = req.query.nome;

    if (!nome) {
      return res.status(400).json({ message: 'Nome não fornecido' });
    }

    const user = await User.findOne({ nome: nome });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar usuário', error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar usuário', error: err.message });
  }
});


router.put('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json({ message: 'Usuário atualizado com sucesso', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
