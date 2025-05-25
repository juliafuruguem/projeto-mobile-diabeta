const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  idade: { type: Number, required: true },
  sexo: { type: String, required: true },
  altura: { type: Number, required: true },
  peso: { type: Number, required: true },
  tipoDiabetes: {
    type: String,
    enum: ['Tipo 1', 'Tipo 2', 'Gestacional', 'Pré-diabetes', 'Outro'],
    required: true
  },
  metaGlicemia: { type: Number }
}, { collection: 'users' });

module.exports = mongoose.model('User', userSchema);
