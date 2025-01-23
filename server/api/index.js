const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Medicamento = require('../models/medicamento');
const cors = require('cors');
const auth = require('../auth');  // Importar el middleware de autenticación
require('dotenv').config();  // Cargar las variables de entorno desde el archivo .env

const app = express();

app.use(express.json());
const allowedOrigins = [
  'https://ped-app-rab1-a0oe2ve3o-jeffrey-cedenos-projects.vercel.app',
  'https://ped-app-rab1.vercel.app',
  'http://localhost:3000', // Para desarrollo local
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (allowedOrigins.includes(origin) || !origin) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
  })
);
// Conectar a MongoDB
mongoose.connect('mongodb+srv://jeffreycedeno:XWBHXxxZZoPp4LUf@pediatricapp.v7iwh.mongodb.net/?retryWrites=true&w=majority&appName=pediatricApp', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Ruta para agregar un perfil de infante
app.post('/add-infant', auth, async (req, res) => {
  const { name, age, weight, height, allergies, reminders } = req.body;

  try {
    // Encontrar al usuario autenticado
    const user = await User.findById(req.user.userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Crear un nuevo perfil de infante con recordatorios
    const newInfant = {
      name,
      age,
      weight,
      height,
      allergies: allergies || [],
      reminders: reminders || [], // Asegúrate de que sea un array
    };

    // Agregar el infante al array de bebés del usuario
    user.babies.push(newInfant);
    await user.save();

    res.status(201).json({ message: 'Perfil del infante creado con éxito', infant: newInfant });
  } catch (error) {
    console.error('Error al crear el perfil del infante:', error);
    res.status(500).json({ message: 'Error al crear el perfil del infante' });
  }
});



// Ruta de registro de usuario
app.post('/register', async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;
  
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'El nombre de usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      babies: []  // Inicializar el array babies como vacío
    });

    await user.save();
    res.status(201).json({ message: 'Usuario registrado con éxito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
});


// Ruta de login (generar el token)
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('Usuario no encontrado');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Contraseña incorrecta');
    }

    // Crear un token JWT con los datos del usuario
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ token, role: user.role });  // Enviar el rol junto con el token
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
});

// Ruta protegida del perfil de usuario
app.get('/profile', auth, async (req, res) => {
  try {
    // Encuentra al usuario por su ID almacenado en el token
    const user = await User.findById(req.user.userId).select('-password');  // Excluir la contraseña de la respuesta
    if (!user) {
      return res.status(404).send('Usuario no encontrado');
    }
    res.json(user);  // Devolver los datos del usuario
  } catch (error) {
    res.status(500).send('Error al obtener el perfil');
  }
});

app.delete('/delete-reminder/:babyId/:reminderIndex', auth, async (req, res) => {
  const { babyId, reminderIndex } = req.params;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Encuentra al infante
    const baby = user.babies.id(babyId);
    if (!baby) return res.status(404).json({ message: 'Infante no encontrado' });

    // Eliminar el recordatorio
    if (baby.reminders && baby.reminders.length > reminderIndex) {
      baby.reminders.splice(reminderIndex, 1);
      await user.save();
      return res.status(200).json({ message: 'Recordatorio eliminado correctamente' });
    } else {
      return res.status(400).json({ message: 'Recordatorio no válido' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el recordatorio' });
  }
});

app.delete('/delete-baby/:babyId', auth, async (req, res) => {
  const { babyId } = req.params;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Filtrar para eliminar el infante por su ID
    user.babies = user.babies.filter((baby) => baby._id.toString() !== babyId);
    await user.save();

    res.status(200).json({ message: 'Infante eliminado correctamente' });
  } catch (error) {
    console.error("Error al eliminar el infante:", error);
    res.status(500).json({ message: 'Error al eliminar el infante' });
  }
});

app.post('/add-reminder/:babyId', auth, async (req, res) => {
  const { babyId } = req.params;
  const { medication, dosage, frequency, startDate, startTime } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Encuentra al infante por su ID
    const baby = user.babies.id(babyId);
    if (!baby) return res.status(404).json({ message: 'Infante no encontrado' });

    // Agregar el nuevo recordatorio
    const newReminder = { medication, dosage, frequency, startDate, startTime };
    baby.reminders.push(newReminder);
    await user.save();

    res.status(201).json({ message: 'Recordatorio agregado correctamente', reminder: newReminder });
  } catch (error) {
    console.error('Error al agregar el recordatorio:', error);
    res.status(500).json({ message: 'Error al agregar el recordatorio' });
  }
});

app.put('/edit-reminder/:babyId/:reminderId', auth, async (req, res) => {
  const { babyId, reminderId } = req.params;
  const { medication, dosage, frequency, startDate, startTime } = req.body;

  try {
    const user = await User.findById(req.user.userId);
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado' });

    // Encuentra al infante por su ID
    const baby = user.babies.id(babyId);
    if (!baby) return res.status(404).json({ message: 'Infante no encontrado' });

    // Encuentra el recordatorio por su ID
    const reminder = baby.reminders.id(reminderId);
    if (!reminder) return res.status(404).json({ message: 'Recordatorio no encontrado' });

    // Actualizar los campos del recordatorio
    reminder.medication = medication;
    reminder.dosage = dosage;
    reminder.frequency = frequency;
    reminder.startDate = startDate;
    reminder.startTime = startTime;

    await user.save();

    res.status(200).json({ message: 'Recordatorio actualizado correctamente', reminder });
  } catch (error) {
    console.error('Error al actualizar el recordatorio:', error);
    res.status(500).json({ message: 'Error al actualizar el recordatorio' });
  }
});

// Ruta para obtener todos los medicamentos
app.get('/medicamentos', async (req, res) => {
  try {
    const medicamentos = await Medicamento.find();
    console.log('Medicamentos obtenidos:', medicamentos); // Log de depuración
    res.json(medicamentos);
  } catch (error) {
    console.error('Error al obtener medicamentos:', error);
    res.status(500).json({ message: 'Error al obtener medicamentos' });
  }
});

// Ruta para agregar un nuevo medicamento
app.post('/medicamentos', async (req, res) => {
  const { nombre, dosis, interacciones, indicaciones = '' } = req.body; // Incluye indicaciones con un valor predeterminado
  try {
    const nuevoMedicamento = new Medicamento({ nombre, dosis, interacciones, indicaciones });
    await nuevoMedicamento.save();
    res.status(201).json(nuevoMedicamento);
  } catch (error) {
    console.error('Error al agregar medicamento:', error);
    res.status(500).json({ message: 'Error al agregar medicamento' });
  }
});


// Ruta para eliminar un medicamento
app.delete('/medicamentos/:id', async (req, res) => {
  try {
    await Medicamento.findByIdAndDelete(req.params.id);
    res.json({ message: 'Medicamento eliminado correctamente' });
  } catch (error) {
    console.error('Error al eliminar medicamento:', error);
    res.status(500).json({ message: 'Error al eliminar medicamento' });
  }
});

// Actualizar un medicamento
app.put('/medicamentos/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, dosis, interacciones, indicaciones } = req.body;

  try {
    const updatedDrug = await Medicamento.findByIdAndUpdate(
      id,
      { nombre, dosis, interacciones, indicaciones },
      { new: true }
    );

    if (!updatedDrug) {
      return res.status(404).json({ message: 'Medicamento no encontrado' });
    }

    res.status(200).json(updatedDrug);
  } catch (error) {
    console.error('Error al actualizar el medicamento:', error);
    res.status(500).json({ message: 'Error al actualizar el medicamento' });
  }
});


// Escuchar el puerto 5000
app.listen(5000, () => {
  console.log('Servidor corriendo en el puerto 5000');
});
