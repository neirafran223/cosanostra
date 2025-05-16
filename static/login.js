document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("login");

  // Función de inicio de sesión
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevenir envío del formulario por defecto

    const email = loginForm.querySelector('input[placeholder="Correo electronico"]').value.trim();
    const password = loginForm.querySelector('input[placeholder="Contraseña"]').value.trim();

    // Obtener los datos del usuario almacenados en el localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser) {
      alert("No hay usuarios registrados.");
      return;
    }

    // Validación de las credenciales
    if (email === storedUser.email && password === storedUser.password) {
      alert("¡Inicio de sesión exitoso!");
      window.location.href = "catalogo.html"; // Redirige al catálogo
    } else {
      alert("Correo o contraseña incorrectos.");
    }
  });
});
