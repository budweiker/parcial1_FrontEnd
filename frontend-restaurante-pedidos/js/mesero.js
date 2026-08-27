// mesero.js
// Lógica de mesero.html

const API_BASE = 'http://localhost:3005';

document.addEventListener('DOMContentLoaded', function () {
  cargarPedidosMesero();
});

async function cargarPedidosMesero() {
  await cargarListaEntrega('ready', '#PorEntregar tbody', true);
  await cargarListaEntrega('delivered', '#Entregado tbody', false);
}

async function cargarListaEntrega(estado, selectorTbody, mostrarBoton) {
  const tbody = document.querySelector(selectorTbody);
  if (!tbody) return;

  try {
    const response = await fetch(`${API_BASE}/orders?status=${estado}`, {
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
      tbody.appendChild(renderFilaMesero(pedido, mostrarBoton));
    });
  } catch (error) {
    console.error('Error al cargar pedidos:', error);
    tbody.innerHTML = '<tr><td colspan="3">No fue posible conectar con el servidor en ' + API_BASE + '</td></tr>';
  }
}

function renderFilaMesero(pedido, mostrarBoton) {
  const tr = document.createElement('tr');

  const platillos = (pedido.items || []).map(function (item) {
    return item.qty + 'x ' + item.name;
  }).join(', ');

  const tdPlatillo = document.createElement('td');
  tdPlatillo.textContent = platillos;

  const tdMesa = document.createElement('td');
  tdMesa.textContent = pedido.table || pedido.client || '-';

  const tdEstado = document.createElement('td');
  if (mostrarBoton) {
    const btn = document.createElement('button');
    btn.className = 'btn btn-sm btn-success';
    btn.textContent = 'Marcar como entregado';
    btn.addEventListener('click', function () {
      marcarEntregado(pedido.id);
    });
    tdEstado.appendChild(btn);
  } else {
    tdEstado.textContent = 'Entregado';
  }

  tr.appendChild(tdPlatillo);
  tr.appendChild(tdMesa);
  tr.appendChild(tdEstado);

  return tr;
}

async function marcarEntregado(id) {
  try {
    const response = await fetch(`${API_BASE}/orders/${id}`, {
      method: 'PATCH',
      headers: authHeaders(),
      body: JSON.stringify({ status: 'delivered' })
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || (data.success !== undefined && !data.success)) {
      alert(data.message || 'No fue posible actualizar el estado del pedido.');
      return;
    }

    cargarPedidosMesero();
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