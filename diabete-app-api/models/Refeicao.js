const mongoose = require('mongoose');

const alimentosSchema = new mongoose.Schema({
  id: { type: String, required: true },
  nome: { type: String, required: true },
  carboidratos: { type: Number, required: true },
  proteinas: { type: Number, required: true },
  gorduras: { type: Number, required: true },
  calorias: { type: Number, required: true }
});

const RefeicaoSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  tipoRefeicao: { type: String, required: true },
  alimentos: [{ type: alimentosSchema, required: true }],
  totalCalorias: Number,
  totalCarboidratos: Number,
  totalProteinas: Number,
  totalGorduras: Number,
  dataHora: { type: Date, default: Date.now }
}, { collection: 'refeicoes' });

module.exports = mongoose.model('Refeicao', RefeicaoSchema);