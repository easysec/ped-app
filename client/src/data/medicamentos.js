// src/data/medicamentos.js

const medicamentos = [
    {
      id: 1,
      nombre: 'Paracetamol',
      dosis: '15 mg/kg cada 6 horas',
      interacciones: ['Ibuprofeno'],
    },
    {
      id: 2,
      nombre: 'Ibuprofeno',
      dosis: '10 mg/kg cada 8 horas',
      interacciones: ['Paracetamol'],
    },
    {
      id: 3,
      nombre: 'Amoxicilina',
      dosis: '25 mg/kg cada 12 horas',
      interacciones: [],
    },
    // Agrega más medicamentos según sea necesario
  ];
  
  export default medicamentos;
  