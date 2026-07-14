import React, { useState } from 'react';

function App() {
  // 📝 Variables de estado para controlar los campos del formulario
  const [clienteNombre, setClienteNombre] = useState('');
  const [servicio, setServicio] = useState('Corte de Cabello');
  const [estilistaId, setEstilistaId] = useState('est_01');
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');

  // 🚦 Estados para controlar los mensajes del sistema
  const [mensaje, setMensaje] = useState(null);
  const [error, setError] = useState(null);

  // 🚀 Función para enviar los datos al Backend cuando el usuario hace clic en "Agendar Cita"
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);
    setError(null);

    const nuevaCita = {
      cliente_nombre: clienteNombre,
      servicio: servicio,
      estilista_id: estilistaId,
      fecha: fecha,
      hora_inicio: horaInicio
    };

    try {
      // 🔗 Conectamos con tu servidor de Express local (Puerto 3000)
      const response = await fetch('http://localhost:3000/citas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevaCita),
      });

      const datos = await response.json();

      if (!response.ok) {
        // Si el backend rechazó la cita (por ejemplo, choque de rango)
        throw new Error(datos.mensaje || datos.error || 'Ocurrió un error al agendar');
      }

      // Si todo salió perfecto
      setMensaje(`¡Éxito! ${datos.mensaje || 'Cita agendada correctamente.'}`);
      // Limpiamos los campos del formulario
      setClienteNombre('');
      setFecha('');
      setHoraInicio('');

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.titulo}>✨ Salón de Belleza Esplendor ✨</h1>
        <p style={styles.subtitulo}>Reserva tu turno en tiempo real con confirmación inteligente</p>
      </header>

      <main style={styles.main}>
        <div style={styles.card}>
          <h2 style={styles.cardTitulo}>Agendar Nueva Cita</h2>
          
          <form onSubmit={handleSubmit} style={styles.form}>
            {/* Campo: Nombre del Cliente */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nombre Completo:</label>
              <input 
                type="text" 
                required
                value={clienteNombre} 
                onChange={(e) => setClienteNombre(e.target.value)} 
                placeholder="Ej. Carlos Pérez"
                style={styles.input}
              />
            </div>

            {/* Campo: Selección de Servicio */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Selecciona el Servicio:</label>
              <select 
                value={servicio} 
                onChange={(e) => setServicio(e.target.value)}
                style={styles.select}
              >
                <option value="Corte de Cabello">💇‍♂️ Corte de Cabello</option>
                <option value="Color y Tintura">🎨 Color y Tintura</option>
                <option value="Manicure">💅 Manicure</option>
                <option value="Peinado Especial">✨ Peinado Especial</option>
              </select>
            </div>

            {/* Campo: Selección de Estilista */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Selecciona tu Estilista Favorita:</label>
              <select 
                value={estilistaId} 
                onChange={(e) => setEstilistaId(e.target.value)}
                style={styles.select}
              >
                <option value="est_01">Jenny (Color y Cortes de dama)</option>
                <option value="est_02">Marcela (Manicure y Peinados)</option>
              </select>
            </div>

            {/* Campo: Fecha */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Fecha:</label>
              <input 
                type="date" 
                required
                value={fecha} 
                onChange={(e) => setFecha(e.target.value)}
                style={styles.input}
              />
            </div>

            {/* Campo: Hora de Inicio */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Hora (Formato de 24 hrs):</label>
              <input 
                type="time" 
                required
                value={horaInicio} 
                onChange={(e) => setHoraInicio(e.target.value)}
                style={styles.input}
              />
            </div>

            {/* Botón de Enviar */}
            <button type="submit" style={styles.button}>
              Reservar Turno
            </button>
          </form>

          {/* 🚦 Mensajes de Alerta visuales */}
          {mensaje && (
            <div style={styles.exitoAlerta}>
              {mensaje}
            </div>
          )}

          {error && (
            <div style={styles.errorAlerta}>
              🛑 {error}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// 🎨 Estilos rápidos integrados en JavaScript (In-line CSS) para que se vea espectacular de inmediato
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f5f7fa',
    fontFamily: '"Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    color: '#333',
    padding: '20px'
  },
  header: {
    textAlign: 'center',
    margin: '40px 0'
  },
  titulo: {
    fontSize: '2.5rem',
    color: '#2c3e50',
    marginBottom: '10px'
  },
  subtitulo: {
    color: '#7f8c8d',
    fontSize: '1.1rem'
  },
  main: {
    display: 'flex',
    justifyContent: 'center'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
    width: '100%',
    maxWidth: '500px',
    padding: '30px',
    boxSizing: 'border-box'
  },
  cardTitulo: {
    fontSize: '1.6rem',
    color: '#2c3e50',
    marginBottom: '20px',
    textAlign: 'center',
    borderBottom: '2px solid #ecf0f1',
    paddingBottom: '10px'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px'
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px'
  },
  label: {
    fontWeight: '6px',
    color: '#34495e',
    fontSize: '0.95rem'
  },
  input: {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  select: {
    padding: '12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '1rem',
    backgroundColor: '#fff',
    cursor: 'pointer'
  },
  button: {
    backgroundColor: '#9b59b6',
    color: '#fff',
    border: 'none',
    padding: '14px',
    borderRadius: '6px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.2s',
  },
  exitoAlerta: {
    marginTop: '20px',
    backgroundColor: '#d4edda',
    color: '#155724',
    padding: '12px',
    borderRadius: '6px',
    textAlign: 'center',
    border: '1px solid #c3e6cb',
    fontWeight: 'bold'
  },
  errorAlerta: {
    marginTop: '20px',
    backgroundColor: '#f8d7da',
    color: '#721c24',
    padding: '12px',
    borderRadius: '6px',
    textAlign: 'center',
    border: '1px solid #f5c6cb',
    fontWeight: 'bold'
  }
};

export default App;