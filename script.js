const baseDeDatosProductos = [
  {id:1,nombre:"Chaleco Estampado",precio:20999,imagen:"imagenes/vestido 1.png",categoria:"abrigos"},
  {id:2,nombre:"Chaleco Rombos",precio:19999,imagen:"imagenes/vestido 2.png",categoria:"abrigos"},
  {id:3,nombre:"Chaleco Lanilla",precio:16999,imagen:"imagenes/vestido 3.jpeg",categoria:"abrigos"},
  {id:4,nombre:"Campera con Bolsillos",precio:49999,imagen:"imagenes/vestido 4.png",categoria:"abrigos"},
  {id:5,nombre:"Vestido Gala Luz",precio:35000,imagen:"imagenes/vestido 5.png",categoria:"vestidos"},
  {id:6,nombre:"Vestido Noche Casual",precio:29999,imagen:"imagenes/vestido 6.png",categoria:"vestidos"},
  {id:7,nombre:"Vestido Primera Luz",precio:38999,imagen:"imagenes/vestido 7.png",categoria:"vestidos"},
  {id:8,nombre:"Vestido Aurora",precio:42999,imagen:"imagenes/vestido 8.png",categoria:"vestidos"},
  {id:9,nombre:"Vestido Esencia",precio:45999,imagen:"imagenes/vestido 9.png",categoria:"vestidos"},
  {id:10,nombre:"Collar Aurora",precio:15999,imagen:"imagenes/vestido 2.png",categoria:"collares"},
  {id:11,nombre:"Collar Nacar",precio:18999,imagen:"imagenes/vestido 5.png",categoria:"collares"},
  {id:12,nombre:"Collar Luz",precio:12999,imagen:"imagenes/vestido 8.png",categoria:"collares"},
  {id:13,nombre:"Aros Destello",precio:10999,imagen:"imagenes/vestido 1.png",categoria:"aros"},
  {id:14,nombre:"Aros Gala",precio:13999,imagen:"imagenes/vestido 6.png",categoria:"aros"},
  {id:15,nombre:"Aros Brillo",precio:8999,imagen:"imagenes/vestido 9.png",categoria:"aros"},
  {id:16,nombre:"Tacones Lumiere",precio:55999,imagen:"imagenes/vestido 4.png",categoria:"tacones"},
  {id:17,nombre:"Tacones Gala",precio:62999,imagen:"imagenes/vestido 7.png",categoria:"tacones"},
  {id:18,nombre:"Tacones Perla",precio:58999,imagen:"imagenes/vestido 3.jpeg",categoria:"tacones"},
  {id:19,nombre:"Tiara Aurora",precio:24999,imagen:"imagenes/vestido 5.png",categoria:"tiaras"},
  {id:20,nombre:"Tiara Nacar",precio:28999,imagen:"imagenes/vestido 8.png",categoria:"tiaras"},
  {id:21,nombre:"Tiara Luz",precio:21999,imagen:"imagenes/vestido 2.png",categoria:"tiaras"}
];

let favoritos = JSON.parse(localStorage.getItem('favoritos_tienda') || '[]');
let carrito = JSON.parse(localStorage.getItem('carrito_tienda') || '[]');

const $ = id => document.getElementById(id);
const pagina = document.body?.dataset?.pagina || 'inicio';
const formatoPrecio = n => '$' + Number(n).toLocaleString('es-AR');

function rutaPagina(nombre){ return nombre === 'inicio' ? 'index.html' : nombre + '.html'; }
function irA(nombre){ window.location.href = rutaPagina(nombre); }

function actualizarHeader(){
  const count = $('fav-count'); if(count) count.textContent = favoritos.length;
  const cart = $('cart-count'); if(cart) cart.textContent = carrito.reduce((a,p)=>a+p.cantidad,0);
  const heart = $('header-fav-icon');
  if(heart){ heart.className = favoritos.length ? 'fa-solid fa-heart' : 'fa-regular fa-heart'; }
}

function tarjetaProducto(prod){
  const fav = favoritos.some(p=>p.id===prod.id);
  const itemCarrito = carrito.find(p=>p.id===prod.id);
  return `<article class="producto" data-id="${prod.id}">
    <div class="producto-img-wrap">
      <img src="${prod.imagen}" alt="${prod.nombre}" loading="lazy">
      <button class="btn-fav ${fav?'activo':''}" onclick="alternarFavorito(${prod.id})" aria-label="${fav?'Quitar de favoritos':'Agregar a favoritos'}"><i class="${fav?'fa-solid':'fa-regular'} fa-heart"></i></button>
      <button class="btn-vista" onclick="abrirVistaRapida(${prod.id})">Vista rápida</button>
    </div>
    <div class="info-prod">
      <div><p>${prod.nombre}</p><span>${formatoPrecio(prod.precio)}</span></div>
      <button class="btn-carrito-mini" onclick="agregarAlCarrito(${prod.id})" aria-label="Agregar al carrito"><i class="fa-solid fa-bag-shopping"></i></button>
    </div>
    ${itemCarrito?`<small class="en-carrito">${itemCarrito.cantidad} en carrito</small>`:''}
  </article>`;
}

function obtenerProductosPagina(){
  if(pagina==='inicio') return baseDeDatosProductos;
  return baseDeDatosProductos.filter(p=>p.categoria===pagina);
}

function renderizarProductos(lista=obtenerProductosPagina()){
  const grid=$('grilla-productos'); if(!grid) return;
  grid.innerHTML=lista.length ? lista.map(tarjetaProducto).join('') : '<div class="sin-resultados"><i class="fa-regular fa-face-frown"></i><p>No encontramos productos con esa búsqueda.</p></div>';
  actualizarHeader();
}

function alternarFavorito(id){
  const prod=baseDeDatosProductos.find(p=>p.id===id); if(!prod)return;
  const i=favoritos.findIndex(p=>p.id===id);
  if(i>=0) favoritos.splice(i,1); else favoritos.push(prod);
  localStorage.setItem('favoritos_tienda',JSON.stringify(favoritos));
  renderizarProductos(); renderizarFavoritos(); actualizarHeader();
}

function renderizarFavoritos(){
  const grid=$('favoritos-container'); if(!grid)return;
  grid.innerHTML=favoritos.length?favoritos.map(tarjetaProducto).join(''):'<div class="sin-resultados"><i class="fa-regular fa-heart"></i><p>Aún no tenés productos favoritos.</p></div>';
}

function alternarSeccionFavoritos(){
  const sec=$('seccion-favoritos'), tienda=$('contenido-tienda');
  if(!sec || !tienda){ window.location.href='index.html#favoritos'; return; }
  const oculto=sec.classList.contains('seccion-oculta');
  sec.classList.toggle('seccion-oculta',!oculto); tienda.classList.toggle('seccion-oculta',oculto);
  if(oculto) renderizarFavoritos();
  window.scrollTo({top:0,behavior:'smooth'});
}

function mostrarInicio(){ window.location.href='index.html'; }
function cerrarMenuMovil(){ $('nav-menu')?.classList.remove('active'); $('menu-overlay')?.classList.remove('active'); }

function configurarBusqueda(){
  const input=$('search-input'); if(!input)return;
  input.addEventListener('input',e=>{
    const q=e.target.value.toLowerCase().trim();
    const lista=obtenerProductosPagina().filter(p=>(p.nombre+' '+p.categoria).toLowerCase().includes(q));
    renderizarProductos(lista);
    const titulo=$('titulo-categoria'); if(titulo) titulo.textContent=q?'Resultados de búsqueda':(pagina==='inicio'?'NEW ARRIVALS':pagina.toUpperCase());
  });
  $('search-icon')?.addEventListener('click',()=>input.focus());
}

function abrirVistaRapida(id){
  const p=baseDeDatosProductos.find(x=>x.id===id); if(!p)return;
  const modal=$('quick-view-modal'); if(!modal)return;
  $('quick-view-content').innerHTML=`<button class="modal-close" onclick="cerrarVistaRapida()"><i class="fa-solid fa-xmark"></i></button><div class="quick-img"><img src="${p.imagen}" alt="${p.nombre}"></div><div class="quick-info"><small>${p.categoria}</small><h2>${p.nombre}</h2><strong>${formatoPrecio(p.precio)}</strong><p>Una pieza seleccionada de Primera Luz. Consultá disponibilidad y detalles antes de tu compra.</p><button class="btn-principal" onclick="agregarAlCarrito(${p.id});cerrarVistaRapida()">Agregar al carrito</button></div>`;
  modal.classList.add('active'); document.body.classList.add('modal-open');
}
function cerrarVistaRapida(){ $('quick-view-modal')?.classList.remove('active'); document.body.classList.remove('modal-open'); }

function agregarAlCarrito(id){
  const p=baseDeDatosProductos.find(x=>x.id===id); if(!p)return;
  const item=carrito.find(x=>x.id===id);
  if(item)item.cantidad++; else carrito.push({...p,cantidad:1});
  guardarCarrito(); renderizarProductos(); renderizarCarrito();
  mostrarToast('Producto agregado al carrito');
}
function cambiarCantidad(id,delta){
  const item=carrito.find(x=>x.id===id); if(!item)return;
  item.cantidad+=delta; if(item.cantidad<=0) carrito=carrito.filter(x=>x.id!==id);
  guardarCarrito(); renderizarCarrito(); renderizarProductos(); actualizarHeader();
}
function guardarCarrito(){localStorage.setItem('carrito_tienda',JSON.stringify(carrito)); actualizarHeader();}
function renderizarCarrito(){
  const box=$('carrito-items'), total=$('carrito-total'); if(!box)return;
  if(!carrito.length){box.innerHTML='<div class="carrito-vacio"><i class="fa-solid fa-bag-shopping"></i><p>Tu carrito está vacío.</p></div>'; if(total)total.textContent='$0'; return;}
  box.innerHTML=carrito.map(p=>`<div class="carrito-item"><img src="${p.imagen}" alt="${p.nombre}"><div><strong>${p.nombre}</strong><span>${formatoPrecio(p.precio)}</span><div class="cantidad"><button onclick="cambiarCantidad(${p.id},-1)">−</button><b>${p.cantidad}</b><button onclick="cambiarCantidad(${p.id},1)">+</button></div></div></div>`).join('');
  const suma=carrito.reduce((a,p)=>a+p.precio*p.cantidad,0); if(total)total.textContent=formatoPrecio(suma);
}
function alternarCarrito(){ const c=$('carrito-panel'); if(!c)return; c.classList.toggle('active'); renderizarCarrito(); }
function mostrarToast(msg){ const t=$('toast'); if(!t)return; t.textContent=msg; t.classList.add('active'); clearTimeout(window.__toast); window.__toast=setTimeout(()=>t.classList.remove('active'),2200); }

function configurarNavegacion(){
  $('mobile-menu-btn')?.addEventListener('click',()=>{$('nav-menu')?.classList.add('active');$('menu-overlay')?.classList.add('active');});
  $('mobile-menu-close')?.addEventListener('click',cerrarMenuMovil); $('menu-overlay')?.addEventListener('click',cerrarMenuMovil);
  document.querySelectorAll('.nav-menu a').forEach(a=>a.addEventListener('click',cerrarMenuMovil));
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){cerrarMenuMovil();cerrarVistaRapida();$('carrito-panel')?.classList.remove('active');}});
}

window.addEventListener('scroll',()=>{ const h=$('header'); if(h)h.classList.toggle('scrolled',window.scrollY>50); });

document.addEventListener('DOMContentLoaded',()=>{
  renderizarProductos(); renderizarFavoritos(); renderizarCarrito(); actualizarHeader(); configurarBusqueda(); configurarNavegacion();
  if(location.hash==='#favoritos') alternarSeccionFavoritos();
  document.querySelectorAll('[data-scroll]').forEach(el=>el.addEventListener('click',()=>document.querySelector(el.dataset.scroll)?.scrollIntoView({behavior:'smooth'})));
  document.querySelectorAll('.prev,.next').forEach(btn=>btn.addEventListener('click',()=>{const c=document.querySelector('.productos-container');if(c)c.scrollBy({left:btn.classList.contains('next')?360:-360,behavior:'smooth'});}));
});

window.alternarFavorito=alternarFavorito;window.alternarSeccionFavoritos=alternarSeccionFavoritos;window.mostrarInicio=mostrarInicio;window.cerrarMenuMovil=cerrarMenuMovil;window.abrirVistaRapida=abrirVistaRapida;window.cerrarVistaRapida=cerrarVistaRapida;window.agregarAlCarrito=agregarAlCarrito;window.cambiarCantidad=cambiarCantidad;window.alternarCarrito=alternarCarrito;
