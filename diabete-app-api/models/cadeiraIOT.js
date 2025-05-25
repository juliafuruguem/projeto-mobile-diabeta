const mongoose = require('mongoose');

const CadeiraIOTSchema = new mongoose.Schema({
    usuario: { type: String, required: true },
    sentou: { type: String, require: true },
    dataRegistro: {
        dia: { type: String, required: true },
        mes: { type: String, required: true },
        ano: { type: String, required: true },
        horas: { type: String, required: true },
        minutos: { type: String, required: true }
    }
}, { collection: 'cadeiraIOT', timestamps: true});

module.exports = mongoose.model('cadeiraIOT', CadeiraIOTSchema);
