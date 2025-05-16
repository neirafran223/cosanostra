document.addEventListener("DOMContentLoaded", function () {
    const registerForm = document.getElementById("register");
  
    // Validación al enviar el formulario
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault(); // Evita que el formulario se envíe por defecto
  
      const firstName = registerForm.querySelector('input[placeholder="Nombre"]').value.trim();
      const lastName = registerForm.querySelector('input[placeholder="Apellido"]').value.trim();
      const email = registerForm.querySelector('input[placeholder="Correo electronico"]').value.trim();
      const password = registerForm.querySelector('input[placeholder="Contraseña"]').value.trim();
      const confirmPassword = registerForm.querySelector('input[placeholder="Repetir contraseña"]').value.trim();
  
      // Validaciones
      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        alert("Por favor, llena todos los campos.");
        return;
      }
  
      if (password !== confirmPassword) {
        alert("Las contraseñas no coinciden.");
        return;
      }
  
      if (!validateEmail(email)) {
        alert("Por favor, ingresa un correo electrónico válido.");
        return;
      }
  
      // Guardar los datos en el almacenamiento local
      const userData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        password: password
      };
  
      // Guardar los datos del usuario en el localStorage
      localStorage.setItem("user", JSON.stringify(userData));
  
      // Confirmación de registro
      alert("¡Registro exitoso!");
  
      // Redirigir al login o a otra página
      window.location.href = "login.html"; // Cambiar a la ruta que desees
    });
  
    // Función para validar el correo electrónico
    function validateEmail(email) {
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return emailRegex.test(email);
    }
  });
  