const mongoose = require('mongoose');

const previsaoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  mensagem: { type: String, required: true }, 
  dataHoraGerada: { type: Date, required: true }
}, { collection: 'previsoes' });

module.exports = mongoose.model('Previsao', previsaoSchema);