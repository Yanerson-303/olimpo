/* ====== JAVASCRIPT GLOBAL - SISTEMA EXPANDIDO ====== */
/* Versión: 2.0 - Sistema completo con dragmas y gestión avanzada */
/* Cambio futuro: Implementar API REST y base de datos local */

/* ====== ⚙️ VARIABLES GLOBALES ====== */
let estado = {
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

const LIMITES = {
  AMIGOS: 50,
  INFLUENCIA: 1500,
  EJERCICIO_DIARIO: 4 // horas
};

const CONVERSION_DRAGMA = 1000; // 1 dragma = 1000 COP

/* ====== 🏪 SISTEMA DE TIENDA ====== */
function mostrarTienda() {
  actualizarDisplayDragmas();
  new bootstrap.Modal(document.getElementById('tiendaModal')).show();
}

function comprarItem(tipo, costo) {
  if (estado.dragmas >= costo) {
    estado.dragmas -= costo;
    switch(tipo) {
      case 'entrenamiento':
        estado.poder += 5;
        showToast("💪 +5 puntos de poder adquiridos!");
        break;
      case 'suplemento':
        estado.poder += 15;
        showToast("💊 +15 puntos de poder con suplementos!");
        break;
      case 'libro':
        estado.conocimiento += 8;
        showToast("📚 +8 puntos de conocimiento!");
        break;
      case 'curso':
        estado.conocimiento += 25;
        showToast("🎓 +25 puntos de conocimiento avanzado!");
        break;
    }
    actualizarEstadisticas();
    guardarEstado();
  } else {
    showToast("❌ Dragmas insuficientes");
  }
}

/* ====== 📜 SISTEMA DE MISIONES ====== */
function mostrarMisiones() {
  actualizarDisplayDragmas();
  new bootstrap.Modal(document.getElementById('misionesModal')).show();
}

function agregarDragmas() {
  const input = document.getElementById('dragmas-input');
  const cantidad = parseInt(input.value) || 0;
  if (cantidad > 0) {
    estado.dragmas += cantidad;
    actualizarEstadisticas();
    guardarEstado();
    showToast(`💰 +${cantidad} dragmas agregados`);
    input.value = '';
  }
}

function quitarDragmas() {
  const input = document.getElementById('dragmas-input');
  const cantidad = parseInt(input.value) || 0;
  if (cantidad > 0 && estado.dragmas >= cantidad) {
    estado.dragmas -= cantidad;
    actualizarEstadisticas();
    guardarEstado();
    showToast(`💰 -${cantidad} dragmas removidos`);
    input.value = '';
  } else {
    showToast("❌ Cantidad inválida o dragmas insuficientes");
  }
}

/* ====== 💪 SISTEMA DE EJERCICIO ====== */
function registrarEjercicio() {
  const tiempo = parseFloat(document.getElementById('ejercicio-tiempo').value) || 0;
  const unidad = document.getElementById('ejercicio-unidad').value;
  
  if (tiempo <= 0) {
    showToast("❌ Tiempo de ejercicio inválido");
    return;
  }

  let tiempoHoras = unidad === 'minutos' ? tiempo / 60 : tiempo;
  let dragmasGanados = 0;
  let desgasteExtra = 0;

  // Máximo 4 horas por día
  if (estado.ejercicioHoy + tiempoHoras > LIMITES.EJERCICIO_DIARIO) {
    const tiempoExtra = (estado.ejercicioHoy + tiempoHoras) - LIMITES.EJERCICIO_DIARIO;
    desgasteExtra = Math.ceil(tiempoExtra * 2); // -1 por cada 30 min extra
    showToast(`⚠️ Ejercicio excesivo: -${desgasteExtra} puntos de desgaste`);
  }

  // Calcular dragmas (máximo por 4 horas)
  const tiempoEfectivo = Math.min(tiempoHoras, LIMITES.EJERCICIO_DIARIO - estado.ejercicioHoy);
  dragmasGanados = Math.floor(tiempoEfectivo * 2); // 2 dragmas por hora

  estado.dragmas += dragmasGanados;
  estado.poder += Math.floor(tiempoEfectivo * 10);
  estado.desgasteFisico += desgasteExtra;
  estado.ejercicioHoy += tiempoHoras;

  actualizarEstadisticas();
  guardarEstado();
  
  if (dragmasGanados > 0) {
    showToast(`💪 +${dragmasGanados} dragmas por ejercicio`);
  }
}

/* ====== 📚 SISTEMA DE ESTUDIO ====== */
function convertirATiempoEstandar(cantidad, unidad) {
  const conversiones = {
    minutos: cantidad / 60,
    horas: cantidad,
    dias: cantidad * 24,
    semanas: cantidad * 168,
    años: cantidad * 8760
  };
  return conversiones[unidad] || 0;
}

function registrarEstudio() {
  const teoriaCantidad = parseFloat(document.getElementById('teoria-cantidad').value) || 0;
  const teoriaUnidad = document.getElementById('teoria-unidad').value;
  const practicaCantidad = parseFloat(document.getElementById('practica-cantidad').value) || 0;
  const practicaUnidad = document.getElementById('practica-unidad').value;

  if (teoriaCantidad <= 0 && practicaCantidad <= 0) {
    showToast("❌ Tiempo de estudio inválido");
    return;
  }

  const teoriaHoras = convertirATiempoEstandar(teoriaCantidad, teoriaUnidad);
  const practicaHoras = convertirATiempoEstandar(practicaCantidad, practicaUnidad);
  const totalHoras = teoriaHoras + practicaHoras;

  // Calcular puntos basados en equilibrio teoría/práctica
  let equilibrio = 0;
  if (totalHoras > 0) {
    const ratioTeoria = teoriaHoras / totalHoras;
    const ratioPractica = practicaHoras / totalHoras;
    equilibrio = 1 - Math.abs(ratioTeoria - ratioPractica); // 1 = perfecto equilibrio
  }

  const puntosBase = Math.floor(totalHoras * 0.5); // 0.5 puntos por hora
  const puntosEquilibrio = Math.floor(puntosBase * equilibrio);
  const dragmasGanados = Math.floor(puntosEquilibrio * 0.8);

  estado.conocimiento += puntosEquilibrio;
  estado.dragmas += dragmasGanados;

  actualizarEstadisticas();
  guardarEstado();
  
  showToast(`📚 +${puntosEquilibrio} conocimiento, +${dragmasGanados} dragmas`);
  
  // Limpiar formulario
  document.getElementById('teoria-cantidad').value = '';
  document.getElementById('practica-cantidad').value = '';
}

/* ====== 🗣️ SISTEMA DE INFLUENCIA ====== */
function registrarInteracciones() {
  const personas = parseInt(document.getElementById('personas-hoy').value) || 0;
  
  if (personas < 0 || personas > LIMITES.INFLUENCIA) {
    showToast("❌ Número de personas inválido");
    return;
  }

  estado.interaccionesHoy = personas;
  
  if (personas > 0) {
    estado.diasSinInteraccion = 0;
    estado.sangradoInfluencia = 0;
    const influenciaGanada = Math.min(personas * 2, 20); // Máximo 20 por día
    estado.influencia += influenciaGanada;
    estado.dragmas += Math.floor(personas * 0.1);
    
    showToast(`🗣️ +${influenciaGanada} influencia por interactuar con ${personas} personas`);
  } else {
    estado.diasSinInteraccion++;
    aplicarSangradoInfluencia();
  }

  // Verificar si alcanzó el máximo
  if (estado.influencia >= LIMITES.INFLUENCIA) {
    estado.influencia = LIMITES.INFLUENCIA;
    document.getElementById('influencia-count').classList.add('max-level');
    showToast("🎉 ¡Máxima influencia alcanzada! Efecto dorado activado");
  }

  actualizarEstadisticas();
  guardarEstado();
  document.getElementById('personas-hoy').value = '';
}

function aplicarSangradoInfluencia() {
  if (estado.diasSinInteraccion > 0) {
    estado.sangradoInfluencia = Math.pow(2, estado.diasSinInteraccion - 1);
    estado.influencia = Math.max(0, estado.influencia - estado.sangradoInfluencia);
    
    const alerta = document.getElementById('influencia-alerta');
    alerta.innerHTML = `
      <div class="alert alert-danger">
        ⚠️ Sangrado por aislamiento: -${estado.sangradoInfluencia} influencia
        <br><small>Día ${estado.diasSinInteraccion} sin interacciones</small>
      </div>
    `;
    
    if (estado.diasSinInteraccion >= 3) {
      showToast(`💀 Sangrado social: -${estado.sangradoInfluencia} influencia`);
    }
    
    if (estado.influencia <= 0 && estado.diasSinInteraccion > 6) {
      showToast("🌑 Efecto de locura penumbra: Aislamiento social extremo");
    }
  }
}

/* ====== 👥 SISTEMA DE AMIGOS ====== */
function mostrarAmigos() {
  actualizarListaAmigos();
  new bootstrap.Modal(document.getElementById('amigosModal')).show();
}

function mostrarAgregarAmigo() {
  new bootstrap.Modal(document.getElementById('agregarAmigoModal')).show();
}

function agregarAmigo() {
  const nombre = document.getElementById('amigo-nombre').value.trim();
  const circulo = document.getElementById('amigo-circulo').value;

  if (!nombre) {
    showToast("❌ Nombre del amigo requerido");
    return;
  }

  if (estado.amigos.length >= LIMITES.AMIGOS) {
    showToast("❌ Límite de amigos alcanzado (50)");
    return;
  }

  const amigo = {
    id: Date.now(),
    nombre: nombre,
    circulo: parseInt(circulo),
    fechaAgregado: new Date().toISOString()
  };

  estado.amigos.push(amigo);
  actualizarEstadisticas();
  guardarEstado();
  
  showToast(`👥 ${nombre} agregado al círculo ${circulo}`);
  document.getElementById('amigo-nombre').value = '';
  
  // Cerrar modal
  bootstrap.Modal.getInstance(document.getElementById('agregarAmigoModal')).hide();
}

function mostrarEliminarAmigo() {
  if (estado.amigos.length === 0) {
    showToast("❌ No hay amigos para eliminar");
    return;
  }

  const circulo = prompt("¿De qué círculo quieres eliminar amigos? (1-5):");
  if (!circulo || circulo < 1 || circulo > 5) {
    showToast("❌ Círculo inválido");
    return;
  }

  const amigosCirculo = estado.amigos.filter(a => a.circulo == circulo);
  if (amigosCirculo.length === 0) {
    showToast(`❌ No hay amigos en el círculo ${circulo}`);
    return;
  }

  const nombres = amigosCirculo.map(a => a.nombre).join(', ');
  if (confirm(`¿Eliminar estos amigos del círculo ${circulo}?\n${nomes}\n\nEsta persona ha transcendido en tu vida.`)) {
    estado.amigos = estado.amigos.filter(a => a.circulo != circulo);
    actualizarEstadisticas();
    guardarEstado();
    showToast(`👥 Amigos del círculo ${circulo} eliminados`);
  }
}

function mostrarEstadisticasAmigos() {
  const estadisticas = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0};
  estado.amigos.forEach(amigo => {
    estadisticas[amigo.circulo]++;
  });

  let mensaje = "📊 Estadísticas de Amigos:\n\n";
  mensaje += `1° Círculo (Familia): ${estadisticas[1]}\n`;
  mensaje += `2° Círculo (Familia Lejana): ${estadisticas[2]}\n`;
  mensaje += `3° Círculo (Amigo Leal): ${estadisticas[3]}\n`;
  mensaje += `4° Círculo (Conocido): ${estadisticas[4]}\n`;
  mensaje += `5° Círculo (Herrante): ${estadisticas[5]}\n\n`;
  mensaje += `Total: ${estado.amigos.length}/50`;

  alert(mensaje);
}

function actualizarListaAmigos() {
  const container = document.getElementById('lista-amigos');
  const progress = document.getElementById('amigos-progress');
  const total = document.getElementById('amigos-total');

  total.textContent = estado.amigos.length;
  progress.style.width = `${(estado.amigos.length / LIMITES.AMIGOS) * 100}%`;

  if (estado.amigos.length === 0) {
    container.innerHTML = '<p class="text-muted">No hay amigos agregados</p>';
    return;
  }

  container.innerHTML = estado.amigos.map(amigo => `
    <div class="amigo-item circulo-${amigo.circulo}">
      <div>
        <strong>${amigo.nombre}</strong>
        <br>
        <small class="text-muted">Círculo ${amigo.circulo}</small>
      </div>
    </div>
  `).join('');

  // Verificar si alcanzó el máximo
  if (estado.amigos.length >= LIMITES.AMIGOS) {
    document.getElementById('amigos-count').classList.add('max-level');
    showToast("🎉 ¡Límite de amigos alcanzado! Honor 'Vida Sana' obtenido");
  }
}

/* ====== 🏛️ SISTEMA DE JERARQUÍA ====== */
function mostrarPiramide() {
  actualizarPiramide();
  new bootstrap.Modal(document.getElementById('piramideModal')).show();
}

function calcularRango() {
  const { poder, conocimiento, influencia, amigos } = estado;
  const totalAmigos = amigos.length;

  // Sistema de puntuación basado en múltiples factores
  const puntuacion = (poder * 0.3) + (conocimiento * 0.3) + (influencia * 0.2) + (totalAmigos * 2);

  if (puntuacion >= 1000) return { nombre: "ENIGMA ★", nivel: 5, desc: "Creador de realidades" };
  if (puntuacion >= 500) return { nombre: "ALFA ♛", nivel: 4, desc: "Líder nato, carisma y control" };
  if (puntuacion >= 250) return { nombre: "DELTA ▼", nivel: 3, desc: "Alfa caído, resiliencia y experiencia" };
  if (puntuacion >= 100) return { nombre: "BETA ▬", nivel: 2, desc: "Conformista, líder en casa" };
  if (puntuacion >= 50) return { nombre: "OMEGA ▽", nivel: 1, desc: "Invisible, base de la pirámide" };
  
  return { nombre: "SIN VIRTUD", nivel: 0, desc: "Comienza tu camino hacia la excelencia" };
}

function actualizarPiramide() {
  const rango = calcularRango();
  document.getElementById('posicion-actual').textContent = rango.nombre;

  // Resetear todos los niveles
  for (let i = 0; i <= 5; i++) {
    const elemento = document.getElementById(`nivel-${['sin-virtud', 'omega', 'beta', 'delta', 'alfa', 'enigma'][i]}`);
    elemento.style.opacity = i === rango.nivel ? '1' : '0.5';
  }
}

/* ====== 🎨 ACTUALIZACIONES DE UI ====== */
function actualizarEstadisticas() {
  document.getElementById('dragmas-count').textContent = estado.dragmas;
  document.getElementById('poder-count').textContent = estado.poder;
  document.getElementById('conocimiento-count').textContent = estado.conocimiento;
  document.getElementById('influencia-count').textContent = estado.influencia;
  document.getElementById('amigos-count').textContent = estado.amigos.length;

  // Actualizar rangos
  const rango = calcularRango();
  document.getElementById('rango').textContent = rango.nombre;
  document.getElementById('descripcion').textContent = rango.desc;

  // Efectos visuales para valores críticos
  const influenciaElem = document.getElementById('influencia-count');
  if (estado.diasSinInteraccion > 0) {
    influenciaElem.classList.add('warning-effect');
  } else {
    influenciaElem.classList.remove('warning-effect');
  }
}

function actualizarDisplayDragmas() {
  document.getElementById('dragmas-tienda').textContent = estado.dragmas;
  document.getElementById('dragmas-misiones').textContent = estado.dragmas;
}

/* ====== 💾 SISTEMA DE PERSISTENCIA ====== */
function guardarEstado() {
  estado.ultimaFecha = new Date().toISOString().split('T')[0];
  localStorage.setItem('sistemaVirtud', JSON.stringify(estado));
}

function cargarEstado() {
  const guardado = localStorage.getItem('sistemaVirtud');
  if (guardado) {
    const datos = JSON.parse(guardado);
    
    // Verificar si es un nuevo día
    const hoy = new Date().toISOString().split('T')[0];
    if (datos.ultimaFecha !== hoy) {
      // Resetear contadores diarios
      datos.ejercicioHoy = 0;
      datos.interaccionesHoy = 0;
      
      // Aplicar sangrado si no hubo interacciones el día anterior
      if (datos.interaccionesHoy === 0) {
        datos.diasSinInteraccion++;
        aplicarSangradoInfluencia();
      }
    }
    
    estado = { ...estado, ...datos };
  }
}

/* ====== 🔔 SISTEMA DE NOTIFICACIONES ====== */
function showToast(mensaje) {
  document.getElementById('toast-body').textContent = mensaje;
  const toast = new bootstrap.Toast(document.getElementById('toast'));
  toast.show();
}

/* ====== 🎯 INICIALIZACIÓN ====== */
document.addEventListener('DOMContentLoaded', function() {
  cargarEstado();
  actualizarEstadisticas();
  verificarRecompensasDiarias();
});

function verificarRecompensasDiarias() {
  const hoy = new Date().toISOString().split('T')[0];
  if (estado.ultimaFecha !== hoy) {
    // Recompensa diaria por login
    estado.dragmas += 1;
    showToast("🎁 Recompensa diaria: +1 dragma");
    guardarEstado();
  }
}