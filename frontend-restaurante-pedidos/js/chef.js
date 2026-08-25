// chef.js
// Lógica de chef.html: lista "Por preparar" (pending) y "Preparando" (preparing)

const API_BASE = 'PON_AQUI_LA_API_BASE'; // ej: https://mi-backend.com/api

document.addEventListener('DOMContentLoaded', function () {
  cargarPedidosChef();
});

async function cargarPedidosChef() {
  await cargarLista('pending', '#PorPreparar tbody', 'preparing', 'Empezar a preparar');
  await cargarLista('preparing', '#Preparando tbody', 'ready', 'Marcar como listo');
}

async function cargarLista(estadoActual, selectorTbody, siguienteEstado, textoBoton) {
  const tbody = document.querySelector(selectorTbody);
  if (!tbody) return;

  try {
    const response = await fetch(`${API_BASE}/orders?status=${estadoActual}`, {
      headers: authHeaders()
    });

    if (!response.ok) {
      tbody.innerHTML = '<tr><td colspan="3">No fue posible cargar los pedidos.</td></tr>';
      return;
    }

    const pedidos = await response.json();
    tbody.innerHTML = '';

    if (!pedidos.length) {
      tbody.innerHTML = '<tr><td colspan="3">No hay pedidos.</td></tr>';
      return;
    }

    pedidos.forEach(function (pedido) {
      tbody.appendChild(renderFilaChef(pedido, siguienteEstado, textoBoton));
    });
  } catch (error) {
    console.error('Error al cargar pedidos:', error);
    tbody.innerHTML = '<tr><td colspan="3">No fue posible conectar con el servidor.</td></tr>';
  }
}

function renderFilaChef(pedido, siguienteEstado, textoBoton) {
  const tr = document.createElement('tr');

  const platillos = (pedido.items || []).map(function (item) {
    return item.qty + 'x ' + item.name;
  }).join(', ');

  const tdPlatillo = document.createElement('td');
  tdPlatillo.textContent = platillos;

  const tdMesa = document.createElement('td');
  tdMesa.textContent = pedido.table || pedido.client || '-';

  const tdEstado = document.createElement('td');
  const btn = document.createElement('button');
  btn.className = 'btn btn-sm btn-primary';
  btn.textContent = textoBoton;
  btn.addEventListener('click', function () {
    cambiarEstadoPedido(pedido.id, siguienteEstado);
  });
  tdEstado.appendChild(btn);

  tr.appendChild(tdPlatillo);
  tr.appendChild(tdMesa);
  tr.appendChild(tdEstado);

  return tr;
}

async function cambiarEstadoPedido(id, nuevoEstado) {
  try {
    const response = await fetch(`${API_BASE}/orders/${id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ status: nuevoEstado })
    });

    if (!response.ok) {
      alert('No fue posible actualizar el estado del pedido.');
      return;
    }

    cargarPedidosChef();
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    alert('No fue posible conectar con el servidor.');
  }
}

function getToken() {
  return localStorage.getItem('token');
}

function authHeaders() {
  return {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + getToken()
  };
}