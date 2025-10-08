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
document.addEventListener('DOMContentLoaded', function() {
  document.addEventListener('contextmenu', function(e) {
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

// ====== SISTEMA DE COMPONENTES PARA LA TIENDA ======
const CatalogoTienda = {
  categorias: [
    {
      id: 'ropa',
      nombre: '👕 Ropa Nueva',
      items: [
        { id: 'camiseta', nombre: 'Camiseta Básica', precio: 15, icono: '👕', tipo: 'camiseta' },
        { id: 'pantalon', nombre: 'Pantalón Vaquero', precio: 25, icono: '👖', tipo: 'pantalon' },
        { id: 'chaqueta', nombre: 'Chaqueta de Cuero', precio: 40, icono: '🧥', tipo: 'chaqueta' },
        { id: 'vestido', nombre: 'Vestido Elegante', precio: 35, icono: '👗', tipo: 'vestido' }
      ]
    },
    {
      id: 'calzado',
      nombre: '👟 Calzado',
      items: [
        { id: 'zapatos', nombre: 'Zapatos Deportivos', precio: 30, icono: '👟', tipo: 'zapatos' },
        { id: 'botas', nombre: 'Botas de Cuero', precio: 45, icono: '👢', tipo: 'botas' },
        { id: 'sandalias', nombre: 'Sandalias', precio: 20, icono: '👡', tipo: 'sandalias' }
      ]
    },
    {
      id: 'accesorios',
      nombre: '🧢 Accesorios',
      items: [
        { id: 'gorra', nombre: 'Gorra', precio: 12, icono: '🧢', tipo: 'accesorio' },
        { id: 'bufanda', nombre: 'Bufanda', precio: 18, icono: '🧣', tipo: 'accesorio' },
        { id: 'gafas', nombre: 'Gafas de Sol', precio: 22, icono: '🕶️', tipo: 'accesorio' },
        { id: 'mochila', nombre: 'Mochila', precio: 28, icono: '🎒', tipo: 'accesorio' }
      ]
    },
    {
      id: 'especiales',
      nombre: '⭐ Items Especiales',
      items: [
        { id: 'armadura', nombre: 'Armadura Legendaria', precio: 100, icono: '🛡️', tipo: 'especial' },
        { id: 'corona', nombre: 'Corona Real', precio: 80, icono: '👑', tipo: 'especial' },
        { id: 'varita', nombre: 'Varita Mágica', precio: 60, icono: '⚡', tipo: 'especial' }
      ]
    }
  ]
};

function agregarCategoriaTienda(id, nombre, items = []) {
  CatalogoTienda.categorias.push({
    id: id,
    nombre: nombre,
    items: items
  });
}

function agregarItemTienda(categoriaId, item) {
  const categoria = CatalogoTienda.categorias.find(cat => cat.id === categoriaId);
  if (categoria) {
    categoria.items.push(item);
  }
}

function renderizarTienda() {
  const contenedor = document.getElementById('tienda-contenido');
  contenedor.innerHTML = '';

  CatalogoTienda.categorias.forEach(categoria => {
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

// ====== SISTEMA DEL INVENTARIO ======
let inventarioRopa = [

];

let dragmas = 100;
let itemAVender = null;
let timersDesaparicion = {};

const mapeoItemsTienda = {
  'camiseta': { nombre: "Camiseta Básica", tipo: "camiseta", icono: "👕" },
  'pantalon': { nombre: "Pantalón Vaquero", tipo: "pantalon", icono: "👖" },
  'chaqueta': { nombre: "Chaqueta de Cuero", tipo: "chaqueta", icono: "🧥" },
  'vestido': { nombre: "Vestido Elegante", tipo: "vestido", icono: "👗" },
  'zapatos': { nombre: "Zapatos Deportivos", tipo: "zapatos", icono: "👟" },
  'botas': { nombre: "Botas de Cuero", tipo: "botas", icono: "👢" },
  'sandalias': { nombre: "Sandalias", tipo: "sandalias", icono: "👡" },
  'gorra': { nombre: "Gorra", tipo: "accesorio", icono: "🧢" },
  'bufanda': { nombre: "Bufanda", tipo: "accesorio", icono: "🧣" },
  'gafas': { nombre: "Gafas de Sol", tipo: "accesorio", icono: "🕶️" },
  'mochila': { nombre: "Mochila", tipo: "accesorio", icono: "🎒" },
  'armadura': { nombre: "Armadura Legendaria", tipo: "especial", icono: "🛡️" },
  'corona': { nombre: "Corona Real", tipo: "especial", icono: "👑" },
  'varita': { nombre: "Varita Mágica", tipo: "especial", icono: "⚡" }
};

function inicializarInventario() {
  actualizarInventario();
  actualizarDragmas();
  renderizarTienda();
}

function actualizarInventario() {
  const contenedor = document.getElementById('inventario-ropa');
  contenedor.innerHTML = '';
  
  inventarioRopa.forEach(item => {
    const slot = document.createElement('div');
    slot.className = `col-md-4 col-sm-6 mb-3 item-ropa ${item.estado === 'roto' ? 'item-roto' : ''}`;
    
    let barraProgreso = '';
    if (item.estado === 'roto') {
      barraProgreso = `
        <div class="barra-deshacer">
          <div class="progreso-deshacer" id="barra-${item.id}"></div>
        </div>
      `;
    }
    
    slot.innerHTML = `
      <div class="p-3 text-center position-relative">
        ${barraProgreso}
        <div class="icono-ropa">${item.icono}</div>
        <h6 class="mb-1">${item.nombre}</h6>
        <small class="text-muted">${item.tipo}</small>
        <div class="mt-2 d-flex justify-content-center gap-1">
          <button class="btn btn-sm btn-danger btn-inventario" onclick="eliminarRopa(${item.id})">
            🗑️ Eliminar
          </button>
          <button class="btn btn-sm btn-warning btn-inventario" 
                  onclick="prepararVenta(${item.id})" 
                  ${item.estado === 'roto' ? 'disabled' : ''}>
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
    slotVacio.className = 'col-md-4 col-sm-6 mb-3 slot-vacio';
    slotVacio.innerHTML = '<span>Vacío</span>';
    contenedor.appendChild(slotVacio);
  }
}

function comprarItem(itemId, precio) {
  if (dragmas >= precio) {
    const itemData = mapeoItemsTienda[itemId];
    
    if (itemData) {
      const nuevoItem = {
        id: Date.now(),
        ...itemData,
        estado: "bueno"
      };
      
      inventarioRopa.push(nuevoItem);
      dragmas -= precio;
      
      actualizarInventario();
      actualizarDragmas();
      
      const modal = bootstrap.Modal.getInstance(document.getElementById('tiendaModal'));
      modal.hide();
      
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
  document.getElementById('dragmas-count').textContent = dragmas;
  document.getElementById('dragmas-actuales').textContent = dragmas;
  document.getElementById('dragmas-tienda').textContent = dragmas;
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
    document.getElementById('nombre-prenda').textContent = itemAVender.nombre;
    document.getElementById('precio-prenda').value = calcularPrecioBase(itemAVender);
    const modal = new bootstrap.Modal(document.getElementById('venderModal'));
    modal.show();
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

document.getElementById('confirmar-venta').addEventListener('click', function() {
  if (itemAVender) {
    const precio = parseInt(document.getElementById('precio-prenda').value);
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
      modal.hide();
      mostrarMensaje(`¡Has vendido ${itemAVender.nombre} por ${precio} dragmas!`, 'success');
      itemAVender = null;
    } else {
      alert('Por favor, introduce un precio válido');
    }
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
  setTimeout(() => { if (alerta.parentNode) alerta.parentNode.removeChild(alerta); }, 3000);
}

document.addEventListener('DOMContentLoaded', inicializarInventario);