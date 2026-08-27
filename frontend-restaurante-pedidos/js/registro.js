// registro.js
// Lógica de registro de usuarios para registro.html
// Coincide con: POST /register -> controller.save_register

const API_BASE = 'http://localhost:3005'; // cambia esto por la URL real cuando despliegues el backend

document.addEventListener('DOMContentLoaded', function () {
  const btnGuardar = document.querySelector('.btn-guardar');
  if (btnGuardar) {
    btnGuardar.addEventListener('click', registrarUsuario);
  }
});

async function registrarUsuario() {
  const user = document.getElementById('user').value.trim();
  const name = document.getElementById('name').value.trim();
  const rol = document.getElementById('rol').value;
  const password = document.getElementById('password').value;

  if (!user || !name || !password) {
    alert('Por favor completa todos los campos.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, name, rol, password })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      alert(data.message || 'No fue posible registrar el usuario.');
      return;
    }

    alert('Usuario registrado correctamente. Ahora puedes iniciar sesión.');
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    alert('No fue posible conectar con el servidor. Verifica que el backend esté corriendo en ' + API_BASE);
  }
}