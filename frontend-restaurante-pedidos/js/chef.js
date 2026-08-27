// chef.js
// Lógica de chef.html

const API_BASE = 'http://localhost:3005';

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

    const data = await response.json().catch(() => null);

    if (!response.ok || (data && data.success === false)) {
      tbody.innerHTML = '<tr><td colspan="3">No fue posible cargar los pedidos.</td></tr>';
      return;
    }

    const pedidos = Array.isArray(data) ? data : (data ? data.orders || [] : []);
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
    tbody.innerHTML = '<tr><td colspan="3">No fue posible conectar con el servidor en ' + API_BASE + '</td></tr>';
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

    const data = await response.json().catch(() => ({}));

    if (!response.ok || (data.success !== undefined && !data.success)) {
      alert(data.message || 'No fue posible actualizar el estado del pedido.');
      return;
    }

    cargarPedidosChef();
  } catch (error) {
    console.error('Error al actualizar pedido:', error);
    alert('No fue posible conectar con el servidor en ' + API_BASE);
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