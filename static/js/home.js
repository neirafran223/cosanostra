document.addEventListener("DOMContentLoaded", function () {
  // Cargar productos destacados
  loadFeaturedProducts();

  // Verificar estado de autenticación
  checkAuthStatus();

  // Configurar slider de productos
  setupProductSlider();
});

function loadFeaturedProducts() {
  const slider = document.getElementById("products-slider");

  // Obtener productos del localStorage o usar algunos predeterminados
  const allProducts = JSON.parse(localStorage.getItem("armas")) || [
    {
      id: 1,
      nombre: "AK-47",
      descripcion: "Rifle automático de asalto",
      precio: 1200,
      categoria: "rifle",
      tipo: "automatica",
      imagen: "https://via.placeholder.com/300x200",
    },
    {
      id: 2,
      nombre: "Desert Eagle",
      descripcion: "Pistola semiautomática de gran potencia",
      precio: 800,
      categoria: "pistola",
      tipo: "semi-automatica",
      imagen: "https://via.placeholder.com/300x200",
    },
    {
      id: 3,
      nombre: "Remington 870",
      descripcion: "Escopeta de acción de bombeo",
      precio: 700,
      categoria: "escopeta",
      tipo: "manual",
      imagen: "https://via.placeholder.com/300x200",
    },
  ];

  // Seleccionar 3 productos aleatorios (o los primeros 3 si hay menos)
  const featuredProducts =
    allProducts.length <= 3
      ? allProducts
      : [...allProducts].sort(() => 0.5 - Math.random()).slice(0, 3);

  // Mostrar productos en el slider
  featuredProducts.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.className = "product-card";
    productCard.innerHTML = `
            <img src="${product.imagen}" alt="${product.nombre}">
            <div class="product-info">
                <h3>${product.nombre}</h3>
                <p>${product.descripcion}</p>
                <span class="product-price">$${product.precio.toFixed(
                  2
                )} USD</span>
                <a href="catalogo.html" class="btn btn-primary">Ver más</a>
            </div>
        `;
    slider.appendChild(productCard);
  });
}

function checkAuthStatus() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navList = document.querySelector(".nav-list");

  if (currentUser) {
    // Cambiar "Iniciar Sesión" por "Cerrar Sesión"
    const loginItem = document.querySelector(".nav-item:last-child");
    if (loginItem) {
      loginItem.innerHTML = `
                <a href="#" class="nav-link" id="logout-link">Cerrar Sesión</a>
            `;

      // Agregar evento para cerrar sesión
      document
        .getElementById("logout-link")
        .addEventListener("click", function (e) {
          e.preventDefault();
          localStorage.removeItem("currentUser");
          window.location.href = "index.html";
        });
    }

    // Agregar enlace al carrito si el usuario está autenticado
    const cartItem = document.createElement("li");
    cartItem.className = "nav-item";
    cartItem.innerHTML = `
            <a href="carrito.html" class="nav-link">Carrito</a>
        `;
    navList.insertBefore(cartItem, navList.lastChild);
  }
}

function setupProductSlider() {
  // Configuración básica del slider (mejorar con una librería como Splide o Swiper en producción)
  const slider = document.getElementById("products-slider");
  let isDown = false;
  let startX;
  let scrollLeft;

  slider.addEventListener("mousedown", (e) => {
    isDown = true;
    slider.style.cursor = "grabbing";
    startX = e.pageX - slider.offsetLeft;
    scrollLeft = slider.scrollLeft;
  });

  slider.addEventListener("mouseleave", () => {
    isDown = false;
    slider.style.cursor = "grab";
  });

  slider.addEventListener("mouseup", () => {
    isDown = false;
    slider.style.cursor = "grab";
  });

  slider.addEventListener("mousemove", (e) => {
    if (!isDown) return;
    e.preventDefault();
    const x = e.pageX - slider.offsetLeft;
    const walk = (x - startX) * 2;
    slider.scrollLeft = scrollLeft - walk;
  });
}
