// 1. Traemos la librería Express que acabamos de instalar
const express = require('express');

// 2. Inicializamos nuestra aplicación Express
const app = express();

// 3. Definimos el puerto (la "puerta" de tu computadora por donde escuchará la app)
const PORT = 3000;

// 🔴 NUEVO: Esto le permite a Express entender el formato JSON que le envíe el frontend
app.use(express.json());

// 4. Simulamos nuestra base de datos con el catálogo de estilistas que diseñamos
const estilistas = [
  { id: "est_01", nombre: "Jenny", especialidad: "Color y Cortes de dama" },
  { id: "est_02", nombre: "Marcela", especialidad: "Manicure y Peinados" }
];

// 🔴 NUEVO: Aquí guardaremos las citas temporalmente en la memoria de la computadora
const citas = [];

// 5. Creamos nuestra primera "Ruta" (Endpoint). 
// Cuando el frontend pida entrar a la raíz '/', el backend responderá un saludo.
app.get('/', (req, res) => {
  res.send('¡Bienvenido al servidor del Salón de Belleza!');
});

// 6. Creamos la ruta para ver a las estilistas
// Cuando el frontend consulte '/estilistas', le enviaremos la lista en formato JSON.
app.get('/estilistas', (req, res) => {
  res.json(estilistas);
});

// 🔴 NUEVO: Ruta para VER las citas guardadas (Método GET)
app.get('/citas', (req, res) => {
  res.json(citas);
});

// 🔴 NUEVO: Ruta para CREAR una nueva cita (Método POST)
app.post('/citas', (req, res) => {
  const nuevaCita = req.body; // Aquí llega la información que el usuario escribe
  
  // Por ahora, una lógica ultra básica: le asignamos un ID aleatorio y la guardamos
  nuevaCita.id = `cita_${Math.floor(Math.random() * 1000)}`;
  nuevaCita.estado = "confirmada";

  citas.push(nuevaCita); // La metemos a la lista

  // Respondemos que todo salió bien y devolvemos la cita creada
  res.status(201).json({
    mensaje: "¡Cita agendada con éxito!",
    cita: nuevaCita
  });
});

// 7. Le decimos al servidor que empiece a escuchar las peticiones
app.listen(PORT, () => {
  console.log(`Servidor corriendo con éxito en http://localhost:${PORT}`);
});

