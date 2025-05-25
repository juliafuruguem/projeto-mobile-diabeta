const mongoose = require('mongoose');


const historicoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  tipo: {
    type: String,
    required: true,
    enum: ['glicemia', 'refeicao'], 
  },
  descricao: { type: String, required: false }, 
  valor: { type: Number, required: false }, 
  periodo: { type: String, required: false }, 
  alimentos: { type: [String], required: false }, 
  totalCalorias: { type: Number, required: false }, 
  totalCarboidratos: { type: Number, required: false }, 
  totalProteinas: { type: Number, required: false }, 
  totalGorduras: { type: Number, required: false }, 
  dataHora: { type: Date, default: Date.now, required: true }
}, { collection: 'historicos' });

module.exports = mongoose.model('Historico', historicoSchema);
