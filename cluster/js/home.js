/* ====== JAVASCRIPT PARA COMPONENTES ESPECÍFICOS ====== */
/* Versión: 2.0 - Componentes y utilidades específicas de la página */

// ====== SISTEMA DE COMPONENTES PARA LA TIENDA ======
const CatalogoTienda = {
  categorias: [
    {
      id: 'ropa',
      nombre: '👕 Ropa Nueva',
      items: [
        { id: 'camiseta', nombre: 'Camiseta ', precio: 30, icono: '👕', tipo: 'camiseta' },
        { id: 'pantalon', nombre: 'Pantalón ', precio: 80, icono: '👖', tipo: 'pantalon' },
        { id: 'zapatos', nombre: 'Zapatos ', precio: 30, icono: '👟', tipo: 'zapatos' },

      ]
    },

    /* agregar categoria colocar una , en el anterior      */
    {
      id: 'ropa',
      nombre: 'Proximamente',
      items: [

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
let inventarioRopa = [];
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

document.getElementById('confirmar-venta').addEventListener('click', function () {
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

// ====== SISTEMA DE MENÚS DESPLEGABLES ======
document.addEventListener("DOMContentLoaded", () => {
  const audio = document.getElementById("bg-music");

  // Esperar la primera interacción del usuario
  document.body.addEventListener("click", () => {
    audio.play().catch(err => console.log("El navegador bloqueó la reproducción automática:", err));
  }, { once: true });
});

// Referencias a elementos del menú
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

// ====== SISTEMA DE CLIC DERECHO EN IMAGEN ======
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