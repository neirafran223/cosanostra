document.addEventListener("DOMContentLoaded", function () {
  // Cargar productos destacados
  loadFeaturedProducts();

  // Verificar estado de autenticación
  checkAuthStatus();

  // Configurar slider de productos
  setupProductSlider();

  function loadFeaturedProducts() {
    const slider = document.getElementById("products-slider");
    const allProducts = JSON.parse(localStorage.getItem("armas")) || [];

    const featuredProducts = allProducts.length <= 3
      ? allProducts
      : [...allProducts].sort(() => 0.5 - Math.random()).slice(0, 3);

    featuredProducts.forEach((product) => {
      const productCard = document.createElement("div");
      productCard.className = "product-card";
      productCard.innerHTML = `
        <img src="${product.imagen}" alt="${product.nombre}">
        <div class="product-info">
          <h3>${product.nombre}</h3>
          <p>${product.descripcion}</p>
          <span class="product-price">$${product.precio.toFixed(2)} USD</span>
          <a href="catalogo.html" class="btn btn-primary">Ver más</a>
        </div>
      `;
      slider.appendChild(productCard);
    });
  }

  function checkAuthStatus() {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    const navList = document.querySelector(".nav-list");

    if (currentUser) {
      const loginItem = document.querySelector(".nav-item:last-child");
      if (loginItem) {
        loginItem.innerHTML = `<a href="#" class="nav-link" id="logout-link">Cerrar Sesión</a>`;
        document.getElementById("logout-link").addEventListener("click", function(e) {
          e.preventDefault();
          logout();
        });
      }

      const cartItem = document.createElement("li");
      cartItem.className = "nav-item";
      cartItem.innerHTML = `<a href="carrito.html" class="nav-link">Carrito</a>`;
      navList.insertBefore(cartItem, navList.lastChild);
    }
  }

  function setupProductSlider() {
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
});