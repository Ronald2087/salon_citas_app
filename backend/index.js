const express = require('express');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(express.json());

// 🔐 TUS CREDENCIALES (Mantén las tuyas aquí)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY; 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 📌 El catálogo de estilistas se queda igual por ahora
const estilistas = [
  { id: "est_01", nombre: "Jenny", especialidad: "Color y Cortes de dama" },
  { id: "est_02", nombre: "Marcela", especialidad: "Manicure y Peinados" }
];

app.get('/', (req, res) => {
  res.send('¡Bienvenido al servidor del Salón de Belleza!');
});

app.get('/estilistas', (req, res) => {
  res.json(estilistas);
});


// ============================================================
// 🔄 REMPLAZA DESDE AQUÍ HACIA ABAJO (Rutas conectadas a Supabase)
// ============================================================

// 📋 Ruta para VER las citas desde Supabase (Método GET)
app.get('/citas', async (req, res) => {
  const { data, error } = await supabase
    .from('citas')
    .select('*');

  if (error) {
    return res.status(500).json({ error: "No se pudieron obtener las citas", detalles: error.message });
  }

  res.json(data);
});

// ➕ Ruta para CREAR una nueva cita en Supabase (Método POST)
app.post('/citas', async (req, res) => {
  const { cliente_nombre, servicio, estilista_id, fecha, hora_inicio } = req.body;

  // 🔍 Detective en la nube
  const { data: citasExistentes, error: errorBusqueda } = await supabase
    .from('citas')
    .select('*')
    .eq('estilista_id', estilista_id)
    .eq('fecha', fecha)
    .eq('hora_inicio', hora_inicio);

  if (errorBusqueda) {
    return res.status(500).json({ error: "Error al validar la disponibilidad", detalles: errorBusqueda.message });
  }

  if (citasExistentes && citasExistentes.length > 0) {
    return res.status(400).json({
      error: "Horario no disponible",
      mensaje: "La estilista elegida ya tiene una cita asignada para esa fecha y hora."
    });
  }

  // 📝 Guardar en la base de datos real
  const { data: nuevaCita, error: errorInsercion } = await supabase
    .from('citas')
    .insert([
      { cliente_nombre, servicio, estilista_id, fecha, hora_inicio }
    ])
    .select(); 

  if (errorInsercion) {
    return res.status(500).json({ error: "No se pudo agendar la cita", detalles: errorInsercion.message });
  }

  res.status(201).json({
    mensaje: "¡Cita agendada con éxito en la nube!",
    cita: nuevaCita[0]
  });
});

// 🚀 Encendido del servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo con éxito en http://localhost:${PORT}`);
});