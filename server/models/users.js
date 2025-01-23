const mongoose = require('mongoose');

// Definir el esquema de recordatorios
const reminderSchema = new mongoose.Schema({
  medication: { type: String, required: true },
  dosage: { type: String, required: true },
  frequency: { type: String, required: true },
  startDate: { type: Date, required: true },
  startTime: { type: String, required: true },
});

// Definir el esquema de bebés
const babySchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: { type: Number, required: true },
  weight: { type: Number, required: true },
  height: { type: Number, required: true },
  allergies: { type: [String], default: [] }, // Alergias como un array de strings
  reminders: { type: [reminderSchema], default: [] }, // Incluir los recordatorios
});

// Definir el esquema de usuarios
const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' }, // El campo de rol, por defecto es 'user'
  babies: { type: [babySchema], default: [] }, // Iniciamos el array de bebés como vacío por defecto
});

module.exports = mongoose.model('User', userSchema);
