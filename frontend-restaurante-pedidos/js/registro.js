// registro.js
// Lógica de registro de usuarios para registro.html

const API_BASE = 'PON_AQUI_LA_API_BASE'; // ej: https://mi-backend.com/api

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
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: user, name, role: rol, password })
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      alert(data.message || 'No fue posible registrar el usuario.');
      return;
    }

    alert('Usuario registrado correctamente. Ahora puedes iniciar sesión.');
    window.location.href = 'login.html';
  } catch (error) {
    console.error('Error al registrar usuario:', error);
    alert('No fue posible conectar con el servidor. Intenta nuevamente.');
  }
}