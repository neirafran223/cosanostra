document.addEventListener("DOMContentLoaded", function () {
  // Verificar y ocultar enlace de admin
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  const adminLink = document.getElementById("adminLink");

  if (!currentUser || currentUser.userType !== "admin") {
    if (adminLink) adminLink.style.display = "none";
  }

  // Cargar armas
  let armas = JSON.parse(localStorage.getItem("armas")) || [
    {
      id: Date.now(),
      nombre: "AK-47",
      modelo: "AK-47",
      descripcion: "Rifle automático de asalto",
      categoria: "rifle",
      tipo: "automatica",
      precio: 1200,
      stock: 10,
      imagen: "https://via.placeholder.com/300x200",
    },
    {
      id: Date.now() + 1,
      nombre: "M16",
      modelo: "M16A4",
      descripcion: "Rifle de asalto de largo alcance",
      categoria: "rifle",
      tipo: "semi-automatica",
      precio: 1300,
      stock: 8,
      imagen: "https://via.placeholder.com/300x200",
    },
  ];

  if (!localStorage.getItem("armas")) {
    localStorage.setItem("armas", JSON.stringify(armas));
  }

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
          <p><strong>Modelo:</strong> ${arma.modelo}</p>
          <p><strong>Categoría:</strong> ${arma.categoria}</p>
          <p><strong>Tipo:</strong> ${arma.tipo}</p>
          <p><strong>Stock:</strong> ${arma.stock}</p>
          <span class="precio">$${arma.precio.toFixed(2)} USD</span>
          <button class="btn-add-cart" data-id="${arma.id}">Añadir al carrito</button>
        </div>
      `;
      contenedor.appendChild(div);
    });

    document.querySelectorAll(".btn-add-cart").forEach((btn) => {
      btn.addEventListener("click", agregarAlCarrito);
    });
  }

  function filtrar() {
    const buscador = document.getElementById("buscador").value.toLowerCase();
    const categoria = document.getElementById("categoria").value;
    const tipo = document.getElementById("tipo").value;

    const productosFiltrados = armas.filter((arma) => {
      const matchesBusqueda =
        arma.nombre.toLowerCase().includes(buscador) ||
        arma.descripcion.toLowerCase().includes(buscador) ||
        arma.modelo.toLowerCase().includes(buscador);
      const matchesCategoria = categoria ? arma.categoria === categoria : true;
      const matchesTipo = tipo ? arma.tipo === tipo : true;
      return matchesBusqueda && matchesCategoria && matchesTipo;
    });

    mostrarProductos(productosFiltrados);
  }

  function agregarAlCarrito(event) {
    const armaId = parseInt(event.target.getAttribute("data-id"));
    const arma = armas.find((a) => a.id === armaId);

    if (!arma) return;

    if (arma.stock <= 0) {
      alert("No hay suficiente stock disponible");
      return;
    }

    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
    const itemExistente = carrito.find((item) => item.id === armaId);

    if (itemExistente) {
      if (itemExistente.cantidad >= arma.stock) {
        alert("No hay suficiente stock disponible");
        return;
      }
      itemExistente.cantidad += 1;
    } else {
      carrito.push({
        id: arma.id,
        nombre: arma.nombre,
        precio: arma.precio,
        imagen: arma.imagen,
        cantidad: 1,
      });
    }

    localStorage.setItem("carrito", JSON.stringify(carrito));
    alert(`${arma.nombre} añadido al carrito`);
  }
});