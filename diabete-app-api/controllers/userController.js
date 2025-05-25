const User = require('../models/User');

exports.createUser = async (req, res) => {
  try {
    const { nome, sexo, idade, altura, peso, tipoDiabetes, metaGlicemia } = req.body;

    const user = new User({
      nome,
      sexo,
      idade,
      altura,
      peso,
      tipoDiabetes,
      metaGlicemia,
    });

    await user.save();

    res.status(201).json({ 
      message: 'Usuário cadastrado com sucesso', 
      userId: user._id, 
      user 
    });
  } catch (error) {
    console.log(error);
    res.status(400).json({ message: 'Erro ao cadastrar usuário', error: error.message });
  }
};
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuário', error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;

    const user = await User.findByIdAndUpdate(userId, updates, { new: true });

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.status(200).json({ message: 'Usuário atualizado com sucesso', user });
  } catch (error) {
    res.status(400).json({ message: 'Erro ao atualizar usuário', error: error.message });
  }
};