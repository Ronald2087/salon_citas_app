const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// 🔐 TUS CREDENCIALES (Mantén las tuyas aquí)
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY; 

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// 🛑 LÍNEA TEMPORAL DE PRUEBA:
console.log("¿URL de Supabase cargada?:", !!SUPABASE_URL);

// 📌 El catálogo de estilistas se queda igual por ahora
const estilistas = [
  { id: "est_01", nombre: "Jenny", especialidad: "Color y Cortes de dama" },
  { id: "est_02", nombre: "Marcela", especialidad: "Manicure y Peinados" }
];

// 🧮 Función auxiliar: Convierte "HH:MM" a minutos totales del día
function horaAMinutos(horaTexto) {
  // Split divide el texto donde encuentre los dos puntos. Ej: "14:15" -> ["14", "15"]
  const [horas, minutos] = horaTexto.split(':').map(Number);
  return (horas * 60) + minutos;
}

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

// ➕ Ruta para CREAR una nueva cita con Lógica de Rangos (Método POST)
app.post('/citas', async (req, res) => {
  const { cliente_nombre, servicio, estilista_id, fecha, hora_inicio } = req.body;

  // 1. Convertir la hora de la nueva cita que se intenta agendar
  const nuevaCitaInicio = horaAMinutos(hora_inicio);
  const DURACION_SERVICIO = 60; // Definimos que cada servicio dura 60 minutos
  const nuevaCitaFin = nuevaCitaInicio + DURACION_SERVICIO;

  // 🔍 Traer TODAS las citas de esa estilista en ese día
  const { data: citasDelDia, error: errorBusqueda } = await supabase
    .from('citas')
    .select('*')
    .eq('estilista_id', estilista_id)
    .eq('fecha', fecha);

  if (errorBusqueda) {
    return res.status(500).json({ error: "Error al consultar agenda", detalles: errorBusqueda.message });
  }

  // 🔍 EL DETECTIVE MATEMÁTICO: Evaluamos si hay cruce con alguna cita existente
  const hayCruce = citasDelDia.find(citaExistente => {
    const existenteInicio = horaAMinutos(citaExistente.hora_inicio);
    const existenteFin = existenteInicio + DURACION_SERVICIO;

    // Fórmula lógica de colisión de rangos:
    // Hay cruce si el inicio de la nueva cita es antes del fin de la existente
    // Y el fin de la nueva cita es después del inicio de la existente.
    return (nuevaCitaInicio < existenteFin && nuevaCitaFin > existenteInicio);
  });

  // 🚦 Si encontramos un cruce, frenamos la operación
  if (hayCruce) {
    return res.status(400).json({
      error: "Horario ocupado por rango",
      mensaje: `No se puede agendar a las ${hora_inicio}. Choca con una cita existente programada a las ${hayCruce.hora_inicio}.`
    });
  }

  // 📝 SI EL HORARIO ESTÁ DISPONIBLE: Se guarda en Supabase
  const { data: nuevaCita, error: errorInsercion } = await supabase
    .from('citas')
    .insert([{ cliente_nombre, servicio, estilista_id, fecha, hora_inicio }])
    .select(); 

  if (errorInsercion) {
    return res.status(500).json({ error: "No se pudo agendar", detalles: errorInsercion.message });
  }

  res.status(201).json({
    mensaje: "¡Cita agendada (Validación de rangos aprobada)!",
    cita: nuevaCita[0]
  });
});

// 🚀 Encendido del servidor
app.listen(PORT, () => {
  console.log(`Servidor corriendo con éxito en http://localhost:${PORT}`);
});