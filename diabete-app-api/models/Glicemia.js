const mongoose = require('mongoose');

const glicemiaSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  valor: { type: Number, required: true },
  dataHora: { type: Date, default: Date.now },
  periodo: {
    type: String,
    enum: ['Jejum', 'Antes do café', 'Antes das refeições', 'Depois das refeições', 'Dormir', 'Outro'],
    default: 'Outro'
  }
}, { collection: 'glicemias' });

module.exports = mongoose.model('Glicemia', glicemiaSchema);