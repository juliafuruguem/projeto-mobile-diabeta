const Alimentos = require('../models/Alimentos'); 

const getAlimentos = async (req, res) => {
  try {
    const { nome } = req.query;
    let query = {};

    if (nome) {
      query.nome = { $regex: nome, $options: 'i' };
    }

    const alimentos = await Alimentos.find(query); 
    res.json(alimentos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro ao buscar alimentos' });
  }
};

module.exports = {
  getAlimentos,
};
