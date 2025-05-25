const Glicemia = require('../models/Glicemia');

const Glicemia = require('../models/Glicemia');

exports.createGlicemia = async (req, res) => {
  try {
    const { userId, valor, periodo } = req.body;

    if (!userId || !valor) {
      return res.status(400).json({ message: 'userId e valor são obrigatórios' });
    }

    const glicemia = new Glicemia({ userId, valor, periodo });
    await glicemia.save();

    res.status(201).json({ message: 'Registro de glicemia salvo com sucesso', glicemia });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao salvar registro de glicemia', error: error.message });
  }
};

exports.getGlicemiasByUserId = async (req, res) => {
  try {
    const glicemias = await Glicemia.find({ userId: req.params.userId }).sort({ dataHora: -1 });

    if (!glicemias || glicemias.length === 0) {
      return res.status(404).json({ message: 'Nenhum registro de glicemia encontrado para este usuário' });
    }

    res.status(200).json(glicemias);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar registros de glicemia', error: error.message });
  }
};

exports.updateGlicemia = async (req, res) => {
  try {
    const glicemia = await Glicemia.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!glicemia) {
      return res.status(404).json({ message: 'Registro de glicemia não encontrado' });
    }

    res.status(200).json({ message: 'Registro de glicemia atualizado com sucesso', glicemia });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar registro de glicemia', error: error.message });
  }
};
