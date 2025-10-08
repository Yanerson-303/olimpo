/* ====== JAVASCRIPT PARA COMPONENTES ====== */
/* Versión: 2.0 - Componentes y utilidades del sistema */
/* Cambio futuro: Sistema de plugins para componentes */

/* ====== 🎪 ANIMACIONES Y EFECTOS ====== */
function crearParticulas(cantidad) {
  // Limpiar partículas existentes
  document.querySelectorAll('.particle').forEach(p => p.remove());

  for (let i = 0; i < cantidad; i++) {
    const particula = document.createElement('div');
    particula.classList.add('particle');

    // Tamaño aleatorio
    const tamaño = Math.random() * 5 + 2;
    particula.style.width = `${tamaño}px`;
    particula.style.height = `${tamaño}px`;

    // Posición aleatoria
    particula.style.left = `${Math.random() * 100}vw`;
    particula.style.top = `${Math.random() * 100}vh`;

    // Animación
    const duracion = Math.random() * 10 + 5;
    particula.style.animation = `float ${duracion}s infinite ease-in-out`;

    // Opacidad aleatoria
    particula.style.opacity = Math.random() * 0.7 + 0.3;

    document.body.appendChild(particula);
  }
}

/* ====== 📊 ESTADÍSTICAS AVANZADAS ====== */
function mostrarEstadisticasDetalladas() {
  const stats = `
💰 Dragmas: ${estado.dragmas} (${estado.dragmas * CONVERSION_DRAGMA} COP)
💪 Poder: ${estado.poder}
📚 Conocimiento: ${estado.conocimiento}
🗣️ Influencia: ${estado.influencia}/${LIMITES.INFLUENCIA}
👥 Amigos: ${estado.amigos.length}/${LIMITES.AMIGOS}
💀 Desgaste Físico: ${estado.desgasteFisico}
⚡ Ejercicio Hoy: ${estado.ejercicioHoy.toFixed(1)}h/${LIMITES.EJERCICIO_DIARIO}h
🗣️ Interacciones Hoy: ${estado.interaccionesHoy}
📅 Días Sin Interacción: ${estado.diasSinInteraccion}
💔 Sangrado Activo: ${estado.sangradoInfluencia}
  `.trim();

  alert(stats);
}

/* ====== 🎮 CONTROLES RÁPIDOS ====== */
function agregarDragmasRapido(cantidad) {
  estado.dragmas += cantidad;
  actualizarEstadisticas();
  guardarEstado();
  showToast(`💰 +${cantidad} dragmas agregados`);
  crearParticulas(20);
}

function resetearSistema() {
  if (confirm('¿Estás seguro de que quieres reiniciar todo el sistema? Se perderán todos los datos.')) {
    estado = {
      dragmas: 0,
      poder: 0,
      conocimiento: 0,
      influencia: 0,
      amigos: [],
      desgasteFisico: 0,
      ejercicioHoy: 0,
      interaccionesHoy: 0,
      ultimaFecha: null,
      sangradoInfluencia: 0,
      diasSinInteraccion: 0
    };
    localStorage.removeItem('sistemaVirtud');
    actualizarEstadisticas();
    showToast('🔄 Sistema reiniciado completamente');
  }
}

/* ====== 📈 SISTEMA DE LOGROS ====== */
const logros = {
  primerAmigo: { obtenido: false, nombre: "Primer Paso", desc: "Agrega tu primer amigo" },
  maxAmigos: { obtenido: false, nombre: "Vida Sana", desc: "Alcanza el máximo de amigos" },
  maxInfluencia: { obtenido: false, nombre: "Influencer", desc: "Alcanza la máxima influencia" },
  enigma: { obtenido: false, nombre: "Sabio", desc: "Alcanza el rango ENIGMA" }
};

function verificarLogros() {
  if (estado.amigos.length >= 1 && !logros.primerAmigo.obtenido) {
    logros.primerAmigo.obtenido = true;
    showToast(`🎉 Logro desbloqueado: ${logros.primerAmigo.nombre}`);
  }

  if (estado.amigos.length >= LIMITES.AMIGOS && !logros.maxAmigos.obtenido) {
    logros.maxAmigos.obtenido = true;
    showToast(`🎉 Logro desbloqueado: ${logros.maxAmigos.nombre}`);
  }

  if (estado.influencia >= LIMITES.INFLUENCIA && !logros.maxInfluencia.obtenido) {
    logros.maxInfluencia.obtenido = true;
    showToast(`🎉 Logro desbloqueado: ${logros.maxInfluencia.nombre}`);
  }

  const rango = calcularRango();
  if (rango.nivel === 5 && !logros.enigma.obtenido) {
    logros.enigma.obtenido = true;
    showToast(`🎉 Logro desbloqueado: ${logros.enigma.nombre}`);
  }
}

/* ====== 🕒 TEMPORIZADORES ====== */
function iniciarTemporizadores() {
  // Verificar logros cada 30 segundos
  setInterval(verificarLogros, 30000);

  // Actualizar interfaz cada 10 segundos
  setInterval(actualizarEstadisticas, 10000);

  // Verificar sangrado cada minuto
  setInterval(() => {
    if (estado.diasSinInteraccion > 0) {
      aplicarSangradoInfluencia();
      actualizarEstadisticas();
    }
  }, 60000);
}

/* ====== 🎨 EFECTOS VISUALES ====== */
function aplicarEfectoMaximo(elemento) {
  elemento.classList.add('max-level');
  crearParticulas(50);
  
  // Efecto de sonido (simulado)
  if (typeof Audio !== 'undefined') {
    const audio = new Audio('data:audio/wav;base64,UklGRigAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQQ');
    audio.play().catch(() => {}); // Ignorar errores de autoplay
  }
}

/* ====== 📋 UTILIDADES ====== */
function formatearNumero(numero) {
  return new Intl.NumberFormat('es-CO').format(numero);
}

function obtenerFechaActual() {
  return new Date().toLocaleDateString('es-CO', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/* ====== 🎯 INICIALIZACIÓN DE COMPONENTES ====== */
document.addEventListener('DOMContentLoaded', function() {
  // Agregar evento de clic derecho para controles rápidos
  document.addEventListener('contextmenu', function(e) {
    e.preventDefault();
    mostrarMenuContextual(e);
  });

  // Iniciar temporizadores
  iniciarTemporizadores();

  // Crear partículas iniciales
  crearParticulas(30);
});

function mostrarMenuContextual(evento) {
  const menu = `
💰 Agregar 10 Dragmas
🔄 Reiniciar Sistema
📊 Estadísticas Detalladas
🎯 Ver Logros
  `.trim();

  const opcion = prompt("Controles Rápidos:\n\n" + menu + "\n\nIngresa el número de opción (1-4):");
  
  switch(opcion) {
    case '1':
      agregarDragmasRapido(10);
      break;
    case '2':
      resetearSistema();
      break;
    case '3':
      mostrarEstadisticasDetalladas();
      break;
    case '4':
      mostrarLogros();
      break;
  }
}

function mostrarLogros() {
  let mensaje = "🎯 Logros Obtenidos:\n\n";
  for (const [key, logro] of Object.entries(logros)) {
    const estado = logro.obtenido ? "✅" : "❌";
    mensaje += `${estado} ${logro.nombre}: ${logro.desc}\n`;
  }
  alert(mensaje);
}