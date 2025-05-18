document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const userType = document.getElementById("userType").value;

    // Obtener usuarios
    const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
    const user = storedUsers.find((u) => u.email === email);

    if (!user) {
      alert("No existe un usuario con este correo.");
      return;
    }

    if (user.password !== password) {
      alert("Contraseña incorrecta.");
      return;
    }

    // Verificar tipo de usuario
    if (user.userType !== userType) {
      alert("El tipo de usuario no coincide con las credenciales.");
      return;
    }

    // Guardar usuario actual en sesión
    localStorage.setItem("currentUser", JSON.stringify(user));

    // Redirigir según el tipo de usuario
    if (userType === "admin") {
      window.location.href = "agregar-arma.html";
    } else {
      window.location.href = "catalogo.html";
    }
  });
});
