document.addEventListener("DOMContentLoaded", function () {
  const recoveryForm = document.getElementById("recoveryForm");
  
  recoveryForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();

    if (!email) {
      alert("Por favor ingrese su correo electrónico");
      return;
    }

    try {
      // Verificar si el email existe
      const userExists = await checkEmailExists(email);
      
      if (!userExists) {
        alert("No existe una cuenta asociada a este correo electrónico");
        return;
      }

      // Generar token de recuperación (simplificado)
      const token = generateToken();
      
      // Guardar token temporalmente (en una aplicación real se enviaría por email)
      sessionStorage.setItem("recoveryToken", token);
      sessionStorage.setItem("recoveryEmail", email);

      alert("Se ha enviado un enlace de recuperación a su correo electrónico");
      window.location.href = "reset-password.html";
      
    } catch (error) {
      console.error("Error en recuperación:", error);
      alert("Ocurrió un error al procesar su solicitud");
    }
  });

  async function checkEmailExists(email) {
    return new Promise((resolve) => {
      const request = indexedDB.open("ArmasDB", 1);
      request.onsuccess = (e) => {
        const db = e.target.result;
        const tx = db.transaction("users", "readonly");
        const store = tx.objectStore("users");
        const index = store.index("email");
        const req = index.get(email);
        
        req.onsuccess = () => resolve(!!req.result);
        req.onerror = () => resolve(false);
      };
      request.onerror = () => resolve(false);
    });
  }

  function generateToken() {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15);
  }
});