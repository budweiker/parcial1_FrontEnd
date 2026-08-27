// login.js
// Lógica de inicio de sesión para login.html
// Coincide con: POST /login -> controller.login_in (routes.js / controller.js)

const API_BASE = 'http://localhost:3005';

document.addEventListener('DOMContentLoaded', function () {
  const btnIniciar = document.querySelector('.btn-iniciar');
  if (btnIniciar) {
    btnIniciar.addEventListener('click', iniciarSesion);
  }
});

async function iniciarSesion() {
  const user = document.getElementById('user').value.trim();
  const password = document.getElementById('password').value;

  if (!user || !password) {
    alert('Por favor ingresa usuario y contraseña.');
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, password })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || (data.success !== undefined && !data.success)) {
      alert(data.message || 'Usuario o contraseña incorrectos.');
      return;
    }

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    redirigirSegunRol(data.user ? data.user.rol : null);
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    alert('No fue posible conectar con el servidor en ' + API_BASE);
  }
}

function redirigirSegunRol(rol) {
  switch (rol) {
    case 'cajero':
      window.location.href = 'cajero.html';
      break;
    case 'chef':
      window.location.href = 'chef.html';
      break;
    case 'mesero':
      window.location.href = 'mesero.html';
      break;
    default:
      window.location.href = 'pedidos.html';
  }
}