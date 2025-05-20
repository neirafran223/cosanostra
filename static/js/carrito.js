document.addEventListener("DOMContentLoaded", function () {
  // Verificar autenticación
  if (!checkAuthStatus()) {
    return;
  }

  loadCart();
  setupEventListeners();
  loadRecommendedProducts();

  function checkAuthStatus() {
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
    
    if (!currentUser) {
      sessionStorage.setItem("redirectAfterLogin", window.location.href);
      const shouldRedirect = confirm("Debes iniciar sesión para ver el carrito. ¿Deseas ir al login ahora?");
      
      if (shouldRedirect) {
        window.location.href = "login.html";
      }
      return false;
    }
    return true;
  }

  function setupEventListeners() {
    const logoutLink = document.getElementById("logout-link");
    if (logoutLink) {
      logoutLink.addEventListener("click", function (e) {
        e.preventDefault();
        sessionStorage.removeItem("currentUser");
        localStorage.removeItem("carrito");
        window.location.href = "index.html";
      });
    }

    const checkoutBtn = document.getElementById("checkout-btn");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", proceedToCheckout);
    }
  }

  function loadCart() {
    const cartItemsContainer = document.getElementById("cart-items");
    const cart = JSON.parse(localStorage.getItem("carrito")) || [];
    const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));

    if (!currentUser) {
      cartItemsContainer.innerHTML = `
        <div class="auth-error-message">
          <p>Error de autenticación. Por favor inicie sesión nuevamente.</p>
          <a href="login.html" class="btn btn-primary">Ir al Login</a>
        </div>
      `;
      return;
    }

    if (cart.length === 0) {
      cartItemsContainer.innerHTML = `
        <div class="empty-cart-message">
          <p>Tu carrito está vacío</p>
          <a href="catalogo.html" class="btn btn-primary">Ir al Catálogo</a>
        </div>
      `;
      document.getElementById("checkout-btn").disabled = true;
      updateCartSummary(0, 0);
      return;
    }

    const allProducts = JSON.parse(localStorage.getItem("armas")) || [];
    let cartHTML = "";
    let subtotal = 0;

    cart.forEach((item) => {
      const product = allProducts.find((p) => p.id === item.id) || {
        nombre: "Producto no disponible",
        precio: 0,
        imagen: "https://via.placeholder.com/100x80",
      };

      const itemTotal = product.precio * item.cantidad;
      subtotal += itemTotal;

      cartHTML += `
        <div class="cart-item" data-id="${item.id}">
          <img src="${product.imagen}" alt="${product.nombre}" class="cart-item-img">
          <div class="cart-item-details">
            <h3 class="cart-item-title">${product.nombre}</h3>
            <span class="cart-item-price">$${product.precio.toFixed(2)} USD</span>
          </div>
          <div class="cart-item-actions">
            <div class="quantity-control">
              <button class="quantity-btn minus" data-id="${item.id}">-</button>
              <input type="number" class="quantity-input" value="${item.cantidad}" min="1" data-id="${item.id}">
              <button class="quantity-btn plus" data-id="${item.id}">+</button>
            </div>
            <button class="remove-item" data-id="${item.id}">×</button>
          </div>
        </div>
      `;
    });

    cartItemsContainer.innerHTML = cartHTML;

    document.querySelectorAll(".quantity-btn.minus").forEach((btn) => {
      btn.addEventListener("click", decreaseQuantity);
    });

    document.querySelectorAll(".quantity-btn.plus").forEach((btn) => {
      btn.addEventListener("click", increaseQuantity);
    });

    document.querySelectorAll(".quantity-input").forEach((input) => {
      input.addEventListener("change", updateQuantity);
    });

    document.querySelectorAll(".remove-item").forEach((btn) => {
      btn.addEventListener("click", removeItem);
    });

    const shipping = calculateShipping(subtotal);
    updateCartSummary(subtotal, shipping);
  }

  // Resto de las funciones (calculateShipping, updateCartSummary, etc.)
  // ... [Mantén las mismas funciones auxiliares que ya tenías]
});