document.addEventListener("DOMContentLoaded", function () {
  const contactForm = document.getElementById("contact-form");

  // Verificar estado de autenticación
  checkAuthStatus();

  // Manejar el envío del formulario
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      submitContactForm();
    });
  }

  // Validación en tiempo real
  setupFormValidation();
});

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

function setupFormValidation() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const nombre = form.querySelector("#nombre");
  const email = form.querySelector("#email");
  const telefono = form.querySelector("#telefono");
  const asunto = form.querySelector("#asunto");
  const mensaje = form.querySelector("#mensaje");
  const privacidad = form.querySelector("#privacidad");

  // Validar email
  email.addEventListener("input", function () {
    if (!validateEmail(email.value)) {
      email.setCustomValidity("Por favor ingrese un correo electrónico válido");
    } else {
      email.setCustomValidity("");
    }
  });

  // Validar teléfono (opcional)
  telefono.addEventListener("input", function () {
    if (telefono.value && !validatePhone(telefono.value)) {
      telefono.setCustomValidity(
        "Por favor ingrese un número de teléfono válido"
      );
    } else {
      telefono.setCustomValidity("");
    }
  });

  // Validar checkbox de privacidad
  privacidad.addEventListener("change", function () {
    if (!privacidad.checked) {
      privacidad.setCustomValidity("Debe aceptar la política de privacidad");
    } else {
      privacidad.setCustomValidity("");
    }
  });
}

function submitContactForm() {
  const form = document.getElementById("contact-form");
  const messageContainer = document.createElement("div");

  // Simular envío del formulario (en producción usar fetch o XMLHttpRequest)
  setTimeout(() => {
    // Mostrar mensaje de éxito
    messageContainer.className = "message success";
    messageContainer.textContent =
      "¡Mensaje enviado con éxito! Nos pondremos en contacto contigo pronto.";
    form.prepend(messageContainer);

    // Limpiar el formulario
    form.reset();

    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
      messageContainer.style.display = "none";
    }, 5000);
  }, 1000);
}

function validateEmail(email) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  const phoneRegex = /^[0-9\s+-]*$/;
  return phoneRegex.test(phone);
}
