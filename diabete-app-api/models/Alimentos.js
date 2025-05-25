const mongoose = require('mongoose');

const AlimentosSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  proteina1g: { type: Number, required: true },
  carboidrato1g: { type: Number, required: true },
  gordura1g: { type: Number, required: true },
  caloria1g: { type: Number, required: true },
}, { collection: 'alimentos' });

module.exports = mongoose.model('Alimentos', AlimentosSchema);
