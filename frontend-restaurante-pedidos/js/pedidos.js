// pedidos.js
// Lógica de pedidos.html

const API_BASE = 'http://localhost:3005';

const ESTADOS_LEGIBLES = {
  pending: 'Por preparar',
  preparing: 'Preparando',
  ready: 'Listo para entregar',
  delivered: 'Entregado',
  paid: 'Pagado'
};

document.addEventListener('DOMContentLoaded', function () {
  cargarTodosLosPedidos();
});

async function cargarTodosLosPedidos() {
  const tbody = document.querySelector('#PorPreparar tbody');
  if (!tbody) return;

  try {
    const response = await fetch(`${API_BASE}/orders`, {
      headers: authHeaders()
    });

    const data = await response.json().catch(() => null);

    if (!response.ok || (data && data.success === false)) {
      tbody.innerHTML = '<tr><td colspan="4">No fue posible cargar los pedidos.</td></tr>';
      return;
    }

    const pedidos = Array.isArray(data) ? data : (data ? data.orders || [] : []);
    tbody.innerHTML = '';

    if (!pedidos.length) {
      tbody.innerHTML = '<tr><td colspan="4">No hay pedidos registrados.</td></tr>';
      return;
    }

    pedidos.forEach(function (pedido) {
      tbody.appendChild(renderFilaPedido(pedido));
    });
  } catch (error) {
    console.error('Error al cargar pedidos:', error);
    tbody.innerHTML = '<tr><td colspan="4">No fue posible conectar con el servidor en ' + API_BASE + '</td></tr>';
  }
}

function renderFilaPedido(pedido) {
  const tr = document.createElement('tr');

  const platillos = (pedido.items || []).map(function (item) {
    return item.qty + 'x ' + item.name;
  }).join(', ');

  const tdPlatillo = document.createElement('td');
  tdPlatillo.textContent = platillos;

  const tdMesa = document.createElement('td');
  tdMesa.textContent = pedido.table || pedido.client || '-';

  const tdEstado = document.createElement('td');
  tdEstado.textContent = ESTADOS_LEGIBLES[pedido.status] || pedido.status;

  const tdAcciones = document.createElement('td');
  if (pedido.status !== 'delivered' && pedido.status !== 'paid') {
    const btnCancelar = document.createElement('button');
    btnCancelar.className = 'btn btn-sm btn-outline-danger';
    btnCancelar.textContent = 'Cancelar';
    btnCancelar.addEventListener('click', function () {
      cancelarPedido(pedido.id);
    });
    tdAcciones.appendChild(btnCancelar);
  } else {
    tdAcciones.textContent = '-';
  }

  tr.appendChild(tdPlatillo);
  tr.appendChild(tdMesa);
  tr.appendChild(tdEstado);
  tr.appendChild(tdAcciones);

  return tr;
}

async function cancelarPedido(id) {
  if (!confirm('¿Seguro que deseas cancelar este pedido?')) return;

  try {
    const response = await fetch(`${API_BASE}/orders/${id}`, {
      method: 'DELETE',
      headers: authHeaders()
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || (data.success !== undefined && !data.success)) {
      alert(data.message || 'No fue posible cancelar el pedido.');
      return;
    }

    cargarTodosLosPedidos();
  } catch (error) {
    console.error('Error al cancelar pedido:', error);
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