// static/js/carrito.js
document.addEventListener("DOMContentLoaded", function () {
  // Añadir estilos de notificación
  const style = document.createElement('link');
  style.rel = 'stylesheet';
  style.href = '../static/css/notification.css';
  document.head.appendChild(style);

  // Verificar autenticación
  const currentUser = JSON.parse(sessionStorage.getItem("currentUser"));
  if (!currentUser) {
    showNotification("Debes iniciar sesión para ver el carrito", "warning");
    setTimeout(() => window.location.href = "login.html", 2000);
    return;
  }

  // Configurar logout
  const logoutLink = document.getElementById("logout-link");
  if (logoutLink) {
    logoutLink.addEventListener("click", function(e) {
      e.preventDefault();
      sessionStorage.removeItem("currentUser");
      showNotification("Sesión cerrada correctamente", "success");
      setTimeout(() => window.location.href = "index.html", 1500);
    });
  }

  // Cargar carrito
  loadCart();

  function loadCart() {
    const cart = JSON.parse(localStorage.getItem("carrito")) || [];
    const cartItemsContainer = document.getElementById("cart-items");
    
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

    // Resto de la lógica para mostrar el carrito...
  }

  // Función para agregar producto al carrito
  function addToCart(product) {
    let cart = JSON.parse(localStorage.getItem("carrito")) || [];
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.nombre,
        price: product.precio,
        image: product.imagen,
        quantity: 1
      });
    }
    
    localStorage.setItem("carrito", JSON.stringify(cart));
    showNotification(`${product.nombre} añadido al carrito`, "success");
    loadCart();
  }

  // Función para eliminar producto del carrito
  function removeItem(productId) {
    let cart = JSON.parse(localStorage.getItem("carrito")) || [];
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem("carrito", JSON.stringify(cart));
    showNotification("Producto eliminado del carrito", "info");
    loadCart();
  }

  // Función para proceder al pago
  function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem("carrito")) || [];
    if (cart.length === 0) {
      showNotification("Tu carrito está vacío", "warning");
      return;
    }

    showNotification("Redirigiendo al proceso de pago...", "info");
    setTimeout(() => {
      // Guardar historial de compra
      const purchase = {
        date: new Date().toISOString(),
        items: cart,
        user: currentUser.email
      };

      let purchaseHistory = JSON.parse(localStorage.getItem("purchaseHistory")) || [];
      purchaseHistory.push(purchase);
      localStorage.setItem("purchaseHistory", JSON.stringify(purchaseHistory));

      // Vaciar carrito
      localStorage.removeItem("carrito");

      // Redirigir
      window.location.href = "confirmacion.html";
    }, 1500);
  }
});