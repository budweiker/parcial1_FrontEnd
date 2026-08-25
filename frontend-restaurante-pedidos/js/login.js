// login.js
// Lógica de inicio de sesión para login.html

const API_BASE = 'PON_AQUI_LA_API_BASE'; // ej: https://mi-backend.com/api

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
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user, password })
    });

    if (!response.ok) {
      const data = await response.json().catch(() => ({}));
      alert(data.message || 'Usuario o contraseña incorrectos.');
      return;
    }

    const data = await response.json();
    // Se espera { token, user: { username, name, role } }
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));

    redirigirSegunRol(data.user ? data.user.role : null);
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    alert('No fue posible conectar con el servidor. Intenta nuevamente.');
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