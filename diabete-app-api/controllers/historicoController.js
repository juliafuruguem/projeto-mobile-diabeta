const Glicemia = require('../models/Glicemia');
const Refeicao = require('../models/Refeicao');

const criarHistorico = async (req, res) => {
  try {
    const {
      userId,
      tipo,
      valor,
      periodo,
      alimentos,
      tipoRefeicao,
      totalCalorias,
      totalCarboidratos,
      totalProteinas,
      totalGorduras,
      dataHora
    } = req.body;

    if (!userId || !tipo) {
      return res.status(400).json({ message: 'userId e tipo são obrigatórios' });
    }

    if (tipo === 'glicemia') {
      if (!valor) {
        return res.status(400).json({ message: 'Valor é obrigatório para glicemia' });
      }

      const descricao = `${valor} mg/dL - ${periodo}`;

      const glicemia = new Glicemia({
        userId,
        tipo: 'glicemia',
        descricao,
        valor,
        periodo,
        dataHora: dataHora || new Date()
      });

      await glicemia.save();
      return res.status(201).json({
        message: 'Registro de glicemia salvo com sucesso',
        glicemia
      });

    } else if (tipo === 'refeicao') {
      if (!alimentos || alimentos.length === 0 || !tipoRefeicao) {
        return res.status(400).json({ message: 'Alimentos e tipoRefeicao são obrigatórios para refeição' });
      }

      const refeicao = new Refeicao({
        userId,
        tipoRefeicao,
        alimentos,
        totalCalorias,
        totalCarboidratos,
        totalProteinas,
        totalGorduras,
        dataHora: dataHora || new Date()
      });

      await refeicao.save();
      return res.status(201).json({
        message: 'Registro de refeição salvo com sucesso',
        refeicao
      });

    } else {
      return res.status(400).json({ message: 'Tipo inválido, use "glicemia" ou "refeicao"' });
    }

  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const listarHistorico = async (req, res) => {
  try {
    const { tipo } = req.query;
    const userId = req.params.userId;

    if (!tipo || (tipo !== 'glicemia' && tipo !== 'refeicao' && tipo !== 'todos')) {
      return res.status(400).json({ message: 'Tipo inválido, use "glicemia", "refeicao" ou "todos"' });
    }

    let dados;

    if (tipo === 'todos') {
      const glicemias = await Glicemia.find({ userId }).sort({ dataHora: -1 });
      const refeicoes = await Refeicao.find({ userId }).sort({ dataHora: -1 });
      dados = [...glicemias, ...refeicoes];
    } else if (tipo === 'glicemia') {
      dados = await Glicemia.find({ userId }).sort({ dataHora: -1 });
    } else if (tipo === 'refeicao') {
      dados = await Refeicao.find({ userId }).sort({ dataHora: -1 });
    }

    if (!dados || dados.length === 0) {
      return res.status(404).json({ message: `Nenhum registro de ${tipo} encontrado para este usuário` });
    }

    res.json(dados);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  criarHistorico,
  listarHistorico
};
