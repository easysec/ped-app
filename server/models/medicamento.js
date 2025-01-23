const mongoose = require('mongoose');

const medicamentoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  dosis: { type: String, required: true },
  interacciones: { type: [String], default: [] }, // Lista de medicamentos con los que interactúa
  indicaciones: { type: String, default: '' }, // Campo nuevo
});

module.exports = mongoose.model('Medicamento', medicamentoSchema);
