// Base de datos de productos integrados
const baseDeDatosProductos = [
  { id: 1, nombre: "Chaleco Estampado", precio: 20999, imagen: "imagenes/vestido 1.png", categoria: "accesorios" },
  { id: 2, nombre: "Chaleco Rombos", precio: 19999, imagen: "imagenes/vestido 2.png", categoria: "accesorios" },
  { id: 3, nombre: "Chaleco Lanilla", precio: 16999, imagen: "imagenes/vestido 3.jpeg", categoria: "accesorios" },
  { id: 4, nombre: "Campera con Bolsillos", precio: 49999, imagen: "imagenes/vestido 4.png", categoria: "accesorios" },
  { id: 5, nombre: "Vestido Gala Luz", precio: 35000, imagen: "imagenes/vestido 5.png", categoria: "vestidos" },
  { id: 6, nombre: "Vestido Noche Casual", precio: 29999, imagen: "imagenes/vestido 6.png", categoria: "vestidos" }
];

let favoritos = JSON.parse(localStorage.getItem('favoritos_tienda')) || [];

const grillaProductos = document.getElementById('grilla-productos');
const favoritosContainer = document.getElementById('favoritos-container');
const favCountLabel = document.getElementById('fav-count');
const searchInput = document.getElementById('search-input');
const tituloCambiante = document.getElementById('titulo-cambiante');
const headerElement = document.getElementById("header");
const navMenu = document.getElementById('nav-menu');
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const menuCloseBtn = document.getElementById('mobile-menu-close');
const menuOverlay = document.getElementById('menu-overlay');

document.addEventListener("DOMContentLoaded", () => {
  renderizarProductos(baseDeDatosProductos);
  actualizarContadorFavoritosHeader();
});

function renderizarProductos(productosAMostrar) {
  if(!grillaProductos) return;
  grillaProductos.innerHTML = "";

  if(productosAMostrar.length === 0) {
    grillaProductos.innerHTML = `<p style="padding: 20px; width: 100%;">No se encontraron productos.</p>`;
    return;
  }

  productosAMostrar.forEach(prod => {
    const esFav = favoritos.some(f => f.id === prod.id);
    const iconoCorazon = esFav ? 'fa-solid fa-heart' : 'fa-regular fa-heart';

    const tarjeta = document.createElement('div');
    tarjeta.classList.add('producto');
    tarjeta.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <div class="info-prod">
        <div>
          <p>${prod.nombre}</p>
          <span>$${prod.precio.toLocaleString('es-AR')}</span>
        </div>
        <button class="btn-fav" onclick="alternarFavorito(${prod.id})">
          <i class="${iconoCorazon}"></i>
        </button>
      </div>
    `;
    grillaProductos.appendChild(tarjeta);
  });
}

function alternarFavorito(id) {
  const itemEncontrado = baseDeDatosProductos.find(p => p.id === id);
  const indexEnFavs = favoritos.findIndex(f => f.id === id);

  if (indexEnFavs > -1) {
    favoritos.splice(indexEnFavs, 1);
  } else {
    favoritos.push(itemEncontrado);
  }

  localStorage.setItem('favoritos_tienda', JSON.stringify(favoritos));
  actualizarContadorFavoritosHeader();
  renderizarProductos(baseDeDatosProductos); 
  if(favoritosContainer) renderizarFavoritosSeccion(); 
}

function actualizarContadorFavoritosHeader() {
  if(favCountLabel) favCountLabel.innerText = favoritos.length;
  const iconHeader = document.getElementById('header-fav-icon');
  if(iconHeader) {
    if(favoritos.length > 0) {
      iconHeader.className = "fa-solid fa-heart";
      iconHeader.style.color = "#e74c3c";
    } else {
      iconHeader.className = "fa-regular fa-heart";
      iconHeader.style.color = "inherit";
    }
  }
}

function renderizarFavoritosSeccion() {
  if(!favoritosContainer) return;
  favoritosContainer.innerHTML = "";

  if(favoritos.length === 0) {
    favoritosContainer.innerHTML = `<p style="grid-column: 1/-1; text-align:center; padding: 40px 0;">Aún no has guardado ningún favorito.</p>`;
    return;
  }

  favoritos.forEach(prod => {
    const tarjeta = document.createElement('div');
    tarjeta.classList.add('producto');
    tarjeta.innerHTML = `
      <img src="${prod.imagen}" alt="${prod.nombre}">
      <div class="info-prod">
        <div>
          <p>${prod.nombre}</p>
          <span>$${prod.precio.toLocaleString('es-AR')}</span>
        </div>
        <button class="btn-fav" onclick="alternarFavorito(${prod.id})">
          <i class="fa-solid fa-heart"></i>
        </button>
      </div>
    `;
    favoritosContainer.appendChild(tarjeta);
  });
}

function alternarSeccionFavoritos() {
  const seccionFavs = document.getElementById('seccion-favoritos');
  const contenidoTienda = document.getElementById('contenido-tienda');
  if(seccionFavs.classList.contains('seccion-oculta')) {
    renderizarFavoritosSeccion();
    seccionFavs.classList.remove('seccion-oculta');
    contenidoTienda.classList.add('seccion-oculta');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    seccionFavs.classList.add('seccion-oculta');
    contenidoTienda.classList.remove('seccion-oculta');
  }
}

function mostrarInicio() {
  document.getElementById('seccion-favoritos').classList.add('seccion-oculta');
  document.getElementById('contenido-tienda').classList.remove('seccion-oculta');
  limpiarFiltros(null);
}

if(searchInput) {
  searchInput.addEventListener('input', (e) => {
    const terminoBusqueda = e.target.value.toLowerCase().trim();
    document.getElementById('seccion-favoritos').classList.add('seccion-oculta');
    document.getElementById('contenido-tienda').classList.remove('seccion-oculta');
    const productosFiltrados = baseDeDatosProductos.filter(prod => 
      prod.nombre.toLowerCase().includes(terminoBusqueda)
    );
    if(tituloCambiante) tituloCambiante.innerText = "Resultados de";
    renderizarProductos(productosFiltrados);
  });
}

function filtrarCategoria(cat) {
  const filtrados = baseDeDatosProductos.filter(p => p.categoria === cat);
  if(tituloCambiante) tituloCambiante.innerText = cat;
  renderizarProductos(filtrados);
  cerrarMenuMovil();
  const productosSeccion = document.getElementById('productos-seccion');
  if(productosSeccion) productosSeccion.scrollIntoView({ behavior: 'smooth' });
}

function limpiarFiltros(e) {
  if(e) e.preventDefault();
  if(searchInput) searchInput.value = "";
  if(tituloCambiante) tituloCambiante.innerText = "new";
  renderizarProductos(baseDeDatosProductos);
}

window.addEventListener("scroll", () => {
  if(window.scrollY > 50) headerElement.classList.add("scrolled");
  else headerElement.classList.remove("scrolled");
});

if(mobileMenuBtn) {
  mobileMenuBtn.addEventListener('click', () => {
    navMenu.classList.add('active');
    if(menuOverlay) menuOverlay.classList.add('active');
  });
}

function cerrarMenuMovil() {
  if(navMenu) navMenu.classList.remove('active');
  if(menuOverlay) menuOverlay.classList.remove('active');
}

if(menuCloseBtn) menuCloseBtn.addEventListener('click', cerrarMenuMovil);
if(menuOverlay) menuOverlay.addEventListener('click', cerrarMenuMovil);

const container = document.querySelector(".productos-container");
const next = document.querySelector(".next");
const prev = document.querySelector(".prev");

function getScrollAmount(){ return window.innerWidth < 768 ? 250 : 350; }
if(next && prev && container) {
  next.addEventListener("click", () => { container.scrollLeft += getScrollAmount(); });
  prev.addEventListener("click", () => { container.scrollLeft -= getScrollAmount(); });
}