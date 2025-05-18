document.addEventListener("DOMContentLoaded", function () {
  // Verificar autenticación
  checkAuthStatus();

  // Cargar carrito
  loadCart();

  // Configurar evento de logout
  const logoutLink = document.getElementById("logout-link");
  if (logoutLink) {
    logoutLink.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("currentUser");
      window.location.href = "index.html";
    });
  }

  // Configurar botón de pago
  const checkoutBtn = document.getElementById("checkout-btn");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", proceedToCheckout);
  }

  // Cargar productos recomendados
  loadRecommendedProducts();
});

function checkAuthStatus() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser) {
    alert("Debes iniciar sesión para ver el carrito");
    window.location.href = "login.html";
  }
}

function loadCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const cart = JSON.parse(localStorage.getItem("carrito")) || [];

  if (cart.length === 0) {
    // Mostrar mensaje de carrito vacío
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

  // Obtener todos los productos disponibles
  const allProducts = JSON.parse(localStorage.getItem("armas")) || [];

  // Generar HTML para cada producto en el carrito
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
                <img src="${product.imagen}" alt="${
      product.nombre
    }" class="cart-item-img">
                <div class="cart-item-details">
                    <h3 class="cart-item-title">${product.nombre}</h3>
                    <span class="cart-item-price">$${product.precio.toFixed(
                      2
                    )} USD</span>
                </div>
                <div class="cart-item-actions">
                    <div class="quantity-control">
                        <button class="quantity-btn minus" data-id="${
                          item.id
                        }">-</button>
                        <input type="number" class="quantity-input" value="${
                          item.cantidad
                        }" min="1" data-id="${item.id}">
                        <button class="quantity-btn plus" data-id="${
                          item.id
                        }">+</button>
                    </div>
                    <button class="remove-item" data-id="${item.id}">×</button>
                </div>
            </div>
        `;
  });

  cartItemsContainer.innerHTML = cartHTML;

  // Configurar eventos para controles de cantidad
  document.querySelectorAll(".quantity-btn.minus").forEach((btn) => {
    btn.addEventListener("click", decreaseQuantity);
  });

  document.querySelectorAll(".quantity-btn.plus").forEach((btn) => {
    btn.addEventListener("click", increaseQuantity);
  });

  document.querySelectorAll(".quantity-input").forEach((input) => {
    input.addEventListener("change", updateQuantity);
  });

  // Configurar eventos para eliminar items
  document.querySelectorAll(".remove-item").forEach((btn) => {
    btn.addEventListener("click", removeItem);
  });

  // Actualizar resumen
  const shipping = calculateShipping(subtotal);
  updateCartSummary(subtotal, shipping);
}

function calculateShipping(subtotal) {
  // Envío gratuito para compras mayores a $1000
  if (subtotal > 1000) {
    return 0;
  }
  // Costo fijo de envío
  return 50;
}

function updateCartSummary(subtotal, shipping) {
  document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
  document.getElementById("shipping").textContent =
    shipping === 0 ? "Gratis" : `$${shipping.toFixed(2)}`;
  document.getElementById("total").textContent = `$${(
    subtotal + shipping
  ).toFixed(2)}`;
}

function decreaseQuantity(e) {
  const productId = parseInt(e.target.getAttribute("data-id"));
  updateCartItemQuantity(productId, -1);
}

function increaseQuantity(e) {
  const productId = parseInt(e.target.getAttribute("data-id"));
  updateCartItemQuantity(productId, 1);
}

function updateQuantity(e) {
  const productId = parseInt(e.target.getAttribute("data-id"));
  const newQuantity = parseInt(e.target.value);

  if (isNaN(newQuantity)) return;

  let cart = JSON.parse(localStorage.getItem("carrito")) || [];
  const itemIndex = cart.findIndex((item) => item.id === productId);

  if (itemIndex !== -1) {
    cart[itemIndex].cantidad = newQuantity;
    localStorage.setItem("carrito", JSON.stringify(cart));
    loadCart(); // Recargar el carrito para actualizar precios
  }
}

function updateCartItemQuantity(productId, change) {
  let cart = JSON.parse(localStorage.getItem("carrito")) || [];
  const itemIndex = cart.findIndex((item) => item.id === productId);

  if (itemIndex !== -1) {
    cart[itemIndex].cantidad += change;

    // Eliminar si la cantidad es menor a 1
    if (cart[itemIndex].cantidad < 1) {
      cart.splice(itemIndex, 1);
    }

    localStorage.setItem("carrito", JSON.stringify(cart));
    loadCart(); // Recargar el carrito para actualizar precios
  }
}

function removeItem(e) {
  const productId = parseInt(e.target.getAttribute("data-id"));
  let cart = JSON.parse(localStorage.getItem("carrito")) || [];

  cart = cart.filter((item) => item.id !== productId);
  localStorage.setItem("carrito", JSON.stringify(cart));
  loadCart(); // Recargar el carrito

  // Mostrar notificación
  showNotification("Producto eliminado del carrito");
}

function proceedToCheckout() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const cart = JSON.parse(localStorage.getItem("carrito")) || [];

  if (cart.length === 0) {
    alert("Tu carrito está vacío");
    return;
  }

  // En una aplicación real, aquí se procesaría el pago
  alert("Redirigiendo al proceso de pago...");

  // Simular proceso de pago exitoso
  setTimeout(() => {
    // Guardar historial de compra
    const purchase = {
      date: new Date().toISOString(),
      items: cart,
      user: currentUser.email,
    };

    let purchaseHistory =
      JSON.parse(localStorage.getItem("purchaseHistory")) || [];
    purchaseHistory.push(purchase);
    localStorage.setItem("purchaseHistory", JSON.stringify(purchaseHistory));

    // Vaciar carrito
    localStorage.removeItem("carrito");

    // Redirigir a página de confirmación
    window.location.href = "confirmacion.html";
  }, 1000);
}

function loadRecommendedProducts() {
  const container = document.getElementById("recommended-products");
  if (!container) return;

  // Obtener productos del catálogo
  const allProducts = JSON.parse(localStorage.getItem("armas")) || [];

  // Obtener productos en el carrito para no recomendarlos
  const cart = JSON.parse(localStorage.getItem("carrito")) || [];
  const cartProductIds = cart.map((item) => item.id);

  // Filtrar productos no están en el carrito
  const availableProducts = allProducts.filter(
    (product) => !cartProductIds.includes(product.id)
  );

  // Seleccionar 4 productos aleatorios (o menos si no hay suficientes)
  const recommendedProducts =
    availableProducts.length <= 4
      ? [...availableProducts]
      : [...availableProducts].sort(() => 0.5 - Math.random()).slice(0, 4);

  if (recommendedProducts.length === 0) {
    container.innerHTML = "<p>No hay productos recomendados disponibles</p>";
    return;
  }

  let productsHTML = "";

  recommendedProducts.forEach((product) => {
    productsHTML += `
            <div class="recommended-product">
                <img src="${product.imagen}" alt="${product.nombre}">
                <div class="recommended-product-info">
                    <h3>${product.nombre}</h3>
                    <p>${product.descripcion}</p>
                    <span class="recommended-product-price">$${product.precio.toFixed(
                      2
                    )} USD</span>
                    <button class="btn btn-secondary add-to-cart" data-id="${
                      product.id
                    }">Añadir al Carrito</button>
                </div>
            </div>
        `;
  });

  container.innerHTML = productsHTML;

  // Configurar eventos para botones "Añadir al carrito"
  document.querySelectorAll(".add-to-cart").forEach((btn) => {
    btn.addEventListener("click", addToCartFromRecommendations);
  });
}

function addToCartFromRecommendations(e) {
  const productId = parseInt(e.target.getAttribute("data-id"));
  const allProducts = JSON.parse(localStorage.getItem("armas")) || [];
  const product = allProducts.find((p) => p.id === productId);

  if (!product) return;

  let cart = JSON.parse(localStorage.getItem("carrito")) || [];
  const existingItem = cart.find((item) => item.id === productId);

  if (existingItem) {
    existingItem.cantidad += 1;
  } else {
    cart.push({
      id: product.id,
      nombre: product.nombre,
      precio: product.precio,
      imagen: product.imagen,
      cantidad: 1,
    });
  }

  localStorage.setItem("carrito", JSON.stringify(cart));
  showNotification(`${product.nombre} añadido al carrito`);
  loadCart(); // Recargar el carrito para mostrar los cambios
}

function showNotification(message) {
  const notification = document.createElement("div");
  notification.className = "notification";
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}
