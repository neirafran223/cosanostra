// static/js/catalogo.js
document.addEventListener("DOMContentLoaded", function () {
  // Añadir estilos de notificación
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = '../static/css/notification.css';
  document.head.appendChild(style);

  // Verificar y ocultar enlace de admin si no es administrador
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const adminLink = document.getElementById("adminLink");

  if (!currentUser || currentUser.userType !== "admin") {
    if (adminLink) adminLink.style.display = "none";
  }

  // Cargar armas
  let armas = JSON.parse(localStorage.getItem("armas")) || [];
  mostrarProductos(armas);

  // Configurar filtros
  document.getElementById("buscador").addEventListener("input", filtrar);
  document.getElementById("categoria").addEventListener("change", filtrar);
  document.getElementById("tipo").addEventListener("change", filtrar);

  function mostrarProductos(productos) {
    const contenedor = document.getElementById("productos");
    contenedor.innerHTML = "";

    if (productos.length === 0) {
      contenedor.innerHTML = '<p class="no-resultados">No se encontraron armas con estos filtros.</p>';
      return;
    }

    productos.forEach((arma) => {
      const div = document.createElement("div");
      div.classList.add("producto");
      div.innerHTML = `
        <img src="${arma.imagen || "https://via.placeholder.com/300x200"}" alt="${arma.nombre}">
        <div class="producto-info">
          <h2>${arma.nombre}</h2>
          <p>${arma.descripcion}</p>
          <p><strong>Precio:</strong> $${arma.precio.toFixed(2)} USD</p>
          <button class="btn-add-cart" data-id="${arma.id}">Añadir al carrito</button>
        </div>
      `;
      contenedor.appendChild(div);
    });

    // Configurar eventos para botones "Añadir al carrito"
    document.querySelectorAll(".btn-add-cart").forEach((btn) => {
      btn.addEventListener("click", function() {
        const armaId = parseInt(this.getAttribute("data-id"));
        const arma = armas.find(a => a.id === armaId);
        
        if (arma) {
          // Verificar stock
          if (arma.stock <= 0) {
            showNotification("No hay suficiente stock disponible", "warning");
            return;
          }

          // Añadir al carrito
          let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
          const itemExistente = carrito.find(item => item.id === armaId);

          if (itemExistente) {
            if (itemExistente.cantidad >= arma.stock) {
              showNotification("No hay suficiente stock disponible", "warning");
              return;
            }
            itemExistente.cantidad += 1;
          } else {
            carrito.push({
              id: arma.id,
              nombre: arma.nombre,
              precio: arma.precio,
              imagen: arma.imagen,
              cantidad: 1
            });
          }

          localStorage.setItem("carrito", JSON.stringify(carrito));
          showNotification(`${arma.nombre} añadido al carrito`, "success");
        }
      });
    });
  }

  function filtrar() {
    const buscador = document.getElementById("buscador").value.toLowerCase();
    const categoria = document.getElementById("categoria").value;
    const tipo = document.getElementById("tipo").value;

    const productosFiltrados = armas.filter((arma) => {
      const matchesBusqueda =
        arma.nombre.toLowerCase().includes(buscador) ||
        arma.descripcion.toLowerCase().includes(buscador);
      const matchesCategoria = categoria ? arma.categoria === categoria : true;
      const matchesTipo = tipo ? arma.tipo === tipo : true;
      return matchesBusqueda && matchesCategoria && matchesTipo;
    });

    mostrarProductos(productosFiltrados);
  }
});