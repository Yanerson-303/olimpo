/* ====== JAVASCRIPT PARA COMPONENTES ====== */
/* Versión: 2.0 - Componentes y utilidades del sistema */

/* ====== 🎪 ANIMACIONES Y EFECTOS ====== */
function crearParticulas(cantidad) {
  document.querySelectorAll('.particle').forEach(p => p.remove());

  for (let i = 0; i < cantidad; i++) {
    const particula = document.createElement('div');
    particula.classList.add('particle');

    const tamaño = Math.random() * 5 + 2;
    particula.style.width = `${tamaño}px`;
    particula.style.height = `${tamaño}px`;
    particula.style.left = `${Math.random() * 100}vw`;
    particula.style.top = `${Math.random() * 100}vh`;

    const duracion = Math.random() * 10 + 5;
    particula.style.animation = `float ${duracion}s infinite ease-in-out`;
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
  setInterval(verificarLogros, 30000);
  setInterval(actualizarEstadisticas, 10000);
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
document.addEventListener('DOMContentLoaded', function () {
  document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    mostrarMenuContextual(e);
  });

  iniciarTemporizadores();
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

  switch (opcion) {
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
// ====== SISTEMA DE COMPONENTES PARA LA TIENDA ======
const CatalogoTienda = {
  categorias: [
    {
      id: 'ropa',
      nombre: 'Ropa',
      items: [
        { id: 'camiseta', nombre: 'Camiseta Básica', precio: 20, icono: '👕', tipo: 'camiseta' },
        { id: 'pantalon', nombre: 'Pantalón Vaquero', precio: 40, icono: '👖', tipo: 'pantalon' },
        { id: 'zapatos', nombre: 'Zapatos Deportivos', precio: 30, icono: '👟', tipo: 'zapatos' },
        { id: 'mochila', nombre: 'Mochila', precio: 40, icono: '🎒', tipo: 'accesorio' }
      ]
    },
    {
      id: 'proximamente',
      nombre: '🟢 Próximamente',
      items: []
    }
  ]
};

// Sistema unificado para agregar items
const SistemaItems = {
  // Mapeo centralizado de todos los items disponibles
  items: {
    'camiseta': { nombre: "Camiseta Básica", tipo: "camiseta", icono: "👕", precio: 20 },
    'pantalon': { nombre: "Pantalón Vaquero", tipo: "pantalon", icono: "👖", precio: 40 },
    'zapatos': { nombre: "Zapatos Deportivos", tipo: "zapatos", icono: "👟", precio: 30 },
    'mochila': { nombre: "Mochila", tipo: "accesorio", icono: "🎒", precio: 40 },
  },

  // Función simplificada para agregar nuevos items
  agregarItem(id, nombre, tipo, icono, precio, categoria = 'ropa') {
    // Agregar al sistema central
    this.items[id] = { nombre, tipo, icono, precio };

    // Agregar a la categoría correspondiente en la tienda
    const cat = CatalogoTienda.categorias.find(c => c.id === categoria);
    if (cat) {
      // Evitar duplicados
      if (!cat.items.find(item => item.id === id)) {
        cat.items.push({ id, nombre, precio, icono, tipo });
      }
    }

    console.log(`✅ Item "${nombre}" agregado correctamente`);
    return this.items[id];
  },

  // Función para agregar múltiples items a la vez
  agregarItems(itemsArray) {
    itemsArray.forEach(item => {
      this.agregarItem(
        item.id,
        item.nombre,
        item.tipo,
        item.icono,
        item.precio,
        item.categoria
      );
    });
  }
};

// Funciones de categorías (mantenidas por compatibilidad)
function agregarCategoriaTienda(id, nombre, items = []) {
  // Evitar duplicados
  if (!CatalogoTienda.categorias.find(cat => cat.id === id)) {
    CatalogoTienda.categorias.push({ id, nombre, items });
  }
}

function agregarItemTienda(categoriaId, item) {
  const categoria = CatalogoTienda.categorias.find(cat => cat.id === categoriaId);
  if (categoria) {
    // Usar el sistema unificado para agregar
    SistemaItems.agregarItem(
      item.id,
      item.nombre,
      item.tipo,
      item.icono,
      item.precio,
      categoriaId
    );
  }
}

// ====== SISTEMA DEL INVENTARIO ======
let inventarioRopa = [];
let dragmas = 100;
let itemAVender = null;
let timersDesaparicion = {};

function inicializarInventario() {
  actualizarInventario();
  actualizarDragmas();
  renderizarTienda();

  // Ejemplos de cómo agregar nuevos items fácilmente:
  console.log("💡 Para agregar nuevos items, usa:");
  console.log("SistemaItems.agregarItem('nuevoId', 'Nombre', 'tipo', '🔮', precio)");
  console.log("O agrega múltiples:");
  console.log("SistemaItems.agregarItems([{id:'...', nombre:'...', tipo:'...', icono:'...', precio:...}])");
}

function renderizarTienda() {
  const contenedor = document.getElementById('tienda-contenido');
  if (!contenedor) return;

  contenedor.innerHTML = '';

  CatalogoTienda.categorias.forEach(categoria => {
    if (categoria.items.length === 0) return;

    const categoriaHTML = `
      <div class="categoria-tienda">
        <h6 class="categoria-titulo">${categoria.nombre}</h6>
        <div class="list-group">
          ${categoria.items.map(item => `
            <button class="list-group-item list-group-item-action bg-secondary text-light" 
                    onclick="comprarItem('${item.id}', ${item.precio})">
              ${item.icono} ${item.nombre} - ${item.precio} dragmas
            </button>
          `).join('')}
        </div>
      </div>
    `;
    contenedor.innerHTML += categoriaHTML;
  });
}

function actualizarInventario() {
  const contenedor = document.getElementById('inventario-ropa');
  if (!contenedor) return;

  contenedor.innerHTML = '';

  inventarioRopa.forEach(item => {
    const slot = document.createElement('div');
    slot.className = `col-md-2 col-sm-3 col-4 mb-2 item-ropa ${item.estado === 'roto' ? 'item-roto' : ''}`;

    let barraProgreso = '';
    if (item.estado === 'roto') {
      barraProgreso = `
        <div class="barra-deshacer">
          <div class="progreso-deshacer" id="barra-${item.id}"></div>
        </div>
      `;
    }

    slot.innerHTML = `
      <div class="p-2 text-center position-relative" style="font-size: 0.8rem;">
        ${barraProgreso}
        <div class="icono-ropa" style="font-size: 1.5rem;">${item.icono}</div>
        <h6 class="mb-1" style="font-size: 0.7rem;">${item.nombre}</h6>
        <small class="text-muted" style="font-size: 0.6rem;">${item.tipo}</small>
        <div class="mt-1 d-flex flex-wrap justify-content-center gap-1">
          <button class="btn btn-sm btn-danger btn-inventario" onclick="eliminarRopa(${item.id})" style="font-size: 0.6rem; padding: 0.1rem 0.3rem;">
            🗑️ Eliminar
          </button>
          <button class="btn btn-sm btn-warning btn-inventario" 
                  onclick="prepararVenta(${item.id})" 
                  ${item.estado === 'roto' ? 'disabled' : ''}
                  style="font-size: 0.3rem; padding: 0.5rem 0.6rem;">
            💰 Vender
          </button>
        </div>
      </div>
    `;

    contenedor.appendChild(slot);

    if (item.estado === 'roto' && !timersDesaparicion[item.id]) {
      iniciarDesaparicion(item.id);
    }
  });

  const slotsVacios = 9 - inventarioRopa.length;
  for (let i = 0; i < slotsVacios; i++) {
    const slotVacio = document.createElement('div');
    slotVacio.className = 'col-md-2 col-sm-3 col-4 mb-2 slot-vacio';
    slotVacio.innerHTML = '<div class="p-2 text-center" style="font-size: 0.8rem;"><span style="font-size: 0.7rem;">Vacío</span></div>';
    contenedor.appendChild(slotVacio);
  }
}

function comprarItem(itemId, precio) {
  if (dragmas >= precio) {
    const itemData = SistemaItems.items[itemId];

    if (itemData) {
      const nuevoItem = {
        id: Date.now() + Math.random(), // ID más único
        ...itemData,
        estado: "bueno"
      };

      inventarioRopa.push(nuevoItem);
      dragmas -= precio;

      actualizarInventario();
      actualizarDragmas();

      const modal = bootstrap.Modal.getInstance(document.getElementById('tiendaModal'));
      if (modal) modal.hide();

      mostrarMensaje(`¡Has comprado ${nuevoItem.nombre} por ${precio} dragmas!`, 'success');
    }
  } else {
    mostrarMensaje('No tienes suficientes dragmas para comprar este item', 'error');
  }
}

function iniciarDesaparicion(itemId) {
  timersDesaparicion[itemId] = setTimeout(() => {
    inventarioRopa = inventarioRopa.filter(item => item.id !== itemId);
    actualizarInventario();
    mostrarMensaje('Un objeto roto ha desaparecido del inventario', 'warning');
    delete timersDesaparicion[itemId];
  }, 10000);
}

function actualizarDragmas() {
  const elements = [
    document.getElementById('dragmas-count'),
    document.getElementById('dragmas-actuales'),
    document.getElementById('dragmas-tienda')
  ];

  elements.forEach(el => {
    if (el) el.textContent = dragmas;
  });
}

function eliminarRopa(id) {
  if (confirm("¿Estás seguro de que quieres marcar esta prenda como rota? Desaparecerá en 10 segundos.")) {
    const itemIndex = inventarioRopa.findIndex(item => item.id === id);
    if (itemIndex !== -1) {
      inventarioRopa[itemIndex].estado = 'roto';
      actualizarInventario();
      mostrarMensaje('La prenda ha sido marcada como ROTA y desaparecerá en 10 segundos', 'info');
    }
  }
}

function prepararVenta(id) {
  itemAVender = inventarioRopa.find(item => item.id === id);
  if (itemAVender) {
    const nombreElement = document.getElementById('nombre-prenda');
    const precioElement = document.getElementById('precio-prenda');

    if (nombreElement && precioElement) {
      nombreElement.textContent = itemAVender.nombre;
      precioElement.value = calcularPrecioBase(itemAVender);

      const modal = new bootstrap.Modal(document.getElementById('venderModal'));
      modal.show();
    }
  }
}

function calcularPrecioBase(item) {
  const preciosBase = {
    'camiseta': 5, 'pantalon': 10, 'chaqueta': 15, 'zapatos': 12,
    'accesorio': 8, 'vestido': 12, 'botas': 18, 'sandalias': 8,
    'especial': 25
  };
  return preciosBase[item.tipo] || 5;
}

// Configurar evento de venta
document.addEventListener('DOMContentLoaded', function () {
  const btnConfirmarVenta = document.getElementById('confirmar-venta');
  if (btnConfirmarVenta) {
    btnConfirmarVenta.addEventListener('click', function () {
      if (itemAVender) {
        const precioElement = document.getElementById('precio-prenda');
        if (precioElement) {
          const precio = parseInt(precioElement.value);
          if (precio > 0) {
            inventarioRopa = inventarioRopa.filter(item => item.id !== itemAVender.id);
            if (timersDesaparicion[itemAVender.id]) {
              clearTimeout(timersDesaparicion[itemAVender.id]);
              delete timersDesaparicion[itemAVender.id];
            }
            dragmas += precio;
            actualizarInventario();
            actualizarDragmas();

            const modal = bootstrap.Modal.getInstance(document.getElementById('venderModal'));
            if (modal) modal.hide();

            mostrarMensaje(`¡Has vendido ${itemAVender.nombre} por ${precio} dragmas!`, 'success');
            itemAVender = null;
          } else {
            alert('Por favor, introduce un precio válido');
          }
        }
      }
    });
  }
});

function mostrarMensaje(mensaje, tipo) {
  const alerta = document.createElement('div');
  const tipoClase = tipo === 'error' ? 'danger' : tipo;
  alerta.className = `alert alert-${tipoClase} alert-dismissible fade show position-fixed`;
  alerta.style.top = '20px';
  alerta.style.right = '20px';
  alerta.style.zIndex = '1050';
  alerta.style.minWidth = '300px';
  alerta.innerHTML = `${mensaje}<button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
  document.body.appendChild(alerta);
  setTimeout(() => {
    if (alerta.parentNode) alerta.parentNode.removeChild(alerta);
  }, 3000);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarInventario);

// ====== EJEMPLOS DE USO - CÓMO AGREGAR NUEVOS ITEMS ======

// Ejemplo 1: Agregar un solo item
// SistemaItems.agregarItem('collar', 'Collar de Perlas', 'accesorio', '📿', 22);

// Ejemplo 2: Agregar múltiples items a la vez
// SistemaItems.agregarItems([

// ]);

// Ejemplo 3: Agregar una categoría completa
// agregarCategoriaTienda('accesorios', '🎩 Accesorios', []);
// SistemaItems.agregarItem('cinturon', 'Cinturón de Cuero', 'accesorio', '⛓️', 18, 'accesorios');


// Referencias a elementos
const infoBtn = document.getElementById("info-btn");
const inventoryBtn = document.getElementById("inventory-btn");
const mapBtn = document.getElementById("map-btn");

const infoPanel = document.getElementById("info-panel");
const inventoryPanel = document.getElementById("inventory-panel");
const mapPanel = document.getElementById("map-panel");

// Función para ocultar todos los paneles
function hideAllPanels() {
  infoPanel.style.display = "none";
  inventoryPanel.style.display = "none";
  mapPanel.style.display = "none";
}

// Alternar visibilidad de paneles
infoBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (infoPanel.style.display === "block") {
    infoPanel.style.display = "none";
  } else {
    hideAllPanels();
    infoPanel.style.display = "block";
  }
});

inventoryBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (inventoryPanel.style.display === "block") {
    inventoryPanel.style.display = "none";
  } else {
    hideAllPanels();
    inventoryPanel.style.display = "block";
  }
});

mapBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  if (mapPanel.style.display === "block") {
    mapPanel.style.display = "none";
  } else {
    hideAllPanels();
    mapPanel.style.display = "block";
  }
});

// Cerrar paneles al hacer clic fuera
document.addEventListener("click", () => {
  hideAllPanels();
});

// Evitar que los paneles se cierren al hacer clic dentro de ellos
document.querySelectorAll(".menu-content").forEach(panel => {
  panel.addEventListener("click", (e) => {
    e.stopPropagation();
  });
});

document.addEventListener('DOMContentLoaded', function () {
  const image = document.getElementById('rightClickImage');
  let touchTimer;

  // Detectar toque largo para simular clic derecho
  image.addEventListener('touchstart', function (e) {
    e.preventDefault();
    touchTimer = setTimeout(() => {
      // Disparar evento de clic derecho
      const rightClickEvent = new MouseEvent('contextmenu', {
        bubbles: true,
        cancelable: true,
        view: window,
        button: 2, // Botón derecho
        buttons: 2
      });
      image.dispatchEvent(rightClickEvent);
    }, 80); // 500ms = toque largo
  });

  // Cancelar si el usuario levanta el dedo rápido
  image.addEventListener('touchend', function (e) {
    clearTimeout(touchTimer);
  });

  // Cancelar si el usuario mueve el dedo
  image.addEventListener('touchmove', function (e) {
    clearTimeout(touchTimer);
  });

  // Manejar el clic derecho (nativo del navegador)
  image.addEventListener('contextmenu', function (e) {
    e.preventDefault();
    // Aquí se abrirá el menú contextual nativo del navegador
    // o puedes mostrar tu propio menú personalizado
    console.log('Click derecho activado en la imagen');

    // Para forzar el menú nativo (depende del navegador)
    // Esto puede no funcionar en todos los navegadores móviles
    // debido a restricciones de seguridad
  });
});
const llama = document.getElementById('llamaOlimpica');
const progresoBarra = document.getElementById('progresoLlama');
const nivelTexto = document.getElementById('nivelLlama');
const diasRachaTexto = document.getElementById('diasRacha');
const proximoHitoTexto = document.getElementById('proximoHito');
const insignias = document.getElementById('insignias');
const mensajeMotivacional = document.getElementById('mensajeMotivacional');
const hitosRacha = [1, 2, 4, 8, 16, 30];

const mensajes = [
  "🔥 Cada chispa de esfuerzo alimenta tu llama.",
  "💪 Hoy es el día perfecto para mejorar.",
  "🌟 Tu fuego interior guía tu grandeza.",
  "🏛️ Persevera y la llama nunca se apagará.",
  "⚔️ La disciplina vence al caos."
];

function abrirModalLlamaOlimpica() {
  new bootstrap.Modal(document.getElementById('llamaOlimpicaModal')).show();
  mensajeMotivacional.textContent = mensajes[Math.floor(Math.random() * mensajes.length)];
}

function obtenerFechaActual() {
  const hoy = new Date();
  return hoy.toISOString().split('T')[0];
}

function cargarLlamaOlimpica() {
  const guardado = JSON.parse(localStorage.getItem('llamaOlimpica')) || {};
  const hoy = obtenerFechaActual();
  const rachaGuardada = JSON.parse(localStorage.getItem('rachaLlama')) || { diasConsecutivos: 0, ultimoDiaCompletado: null };

  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  const fechaAyer = ayer.toISOString().split('T')[0];

  if (rachaGuardada.ultimoDiaCompletado !== fechaAyer && rachaGuardada.ultimoDiaCompletado !== hoy) {
    rachaGuardada.diasConsecutivos = 0;
  }

  if (guardado.fecha === hoy) {
    document.getElementById('tareaEjercicio').checked = guardado.ejercicio || false;
    document.getElementById('tareaEstudio').checked = guardado.estudio || false;
    document.getElementById('tareaTrabajo').checked = guardado.trabajo || false;
    actualizarProgresoLlamaOlimpica();
  } else {
    localStorage.removeItem('llamaOlimpica');
    reiniciarLlamaOlimpica();
  }
  actualizarInformacionRacha(rachaGuardada.diasConsecutivos);
}

function actualizarProgresoLlamaOlimpica() {
  const ejercicio = document.getElementById('tareaEjercicio').checked;
  const estudio = document.getElementById('tareaEstudio').checked;
  const trabajo = document.getElementById('tareaTrabajo').checked;
  const completadas = [ejercicio, estudio, trabajo].filter(Boolean).length;
  const progreso = (completadas / 3) * 100;

  progresoBarra.style.width = progreso + '%';
  nivelTexto.textContent = completadas;

  if (completadas === 3) actualizarRacha();

  localStorage.setItem('llamaOlimpica', JSON.stringify({ fecha: obtenerFechaActual(), ejercicio, estudio, trabajo }));
}

function actualizarRacha() {
  const hoy = obtenerFechaActual();
  let racha = JSON.parse(localStorage.getItem('rachaLlama')) || { diasConsecutivos: 0, ultimoDiaCompletado: null };
  if (racha.ultimoDiaCompletado === hoy) return;

  const ayer = new Date();
  ayer.setDate(ayer.getDate() - 1);
  const fechaAyer = ayer.toISOString().split('T')[0];

  if (racha.ultimoDiaCompletado === fechaAyer || racha.diasConsecutivos === 0) racha.diasConsecutivos++;
  else racha.diasConsecutivos = 1;

  racha.ultimoDiaCompletado = hoy;
  localStorage.setItem('rachaLlama', JSON.stringify(racha));
  actualizarInformacionRacha(racha.diasConsecutivos);
}

function actualizarInformacionRacha(diasRacha) {
  diasRachaTexto.textContent = diasRacha;
  const proximoHito = hitosRacha.find(h => h > diasRacha) || hitosRacha[hitosRacha.length - 1];
  proximoHitoTexto.textContent = `Día ${proximoHito}`;
  actualizarLlamaPorRacha(diasRacha);
  actualizarInsignias(diasRacha);
}

function actualizarLlamaPorRacha(diasRacha) {
  llama.className = 'fire-effect';
  llama.style.opacity = '1';
  if (hitosRacha.includes(diasRacha)) {
    llama.classList.add(`fire-streak-${diasRacha}`);
  }
}

function actualizarInsignias(dias) {
  insignias.innerHTML = '';
  hitosRacha.forEach(h => {
    if (dias >= h) insignias.innerHTML += `<span class="badge-hito">🏅 Día ${h}</span>`;
  });
}

function reiniciarLlamaOlimpica() {
  document.getElementById('tareaEjercicio').checked = false;
  document.getElementById('tareaEstudio').checked = false;
  document.getElementById('tareaTrabajo').checked = false;
  progresoBarra.style.width = '0%';
  nivelTexto.textContent = '0';
}

window.addEventListener('load', cargarLlamaOlimpica);
