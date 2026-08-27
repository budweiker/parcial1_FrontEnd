// mesero.js
// Lógica de mesero.html

const API_BASE = 'http://localhost:3005';

document.addEventListener('DOMContentLoaded', function () {
  cargarPedidosMesero();
});

async function cargarPedidosMesero() {
  const tbodyPorEntregar = document.querySelector('#PorEntregar tbody');
  const tbodyEntregado = document.querySelector('#Entregado tbody');
  if (!tbodyPorEntregar || !tbodyEntregado) return;

  try {
    const response = await fetch(`${API_BASE}/mesero`);
    const data = await response.json();

    const data = await response.json().catch(() => null);

    if (!response.ok || (data && data.success === false)) {
      tbody.innerHTML = '<tr><td colspan="3">No fue posible cargar los pedidos.</td></tr>';
      return;
    }

    const pedidos = Array.isArray(data) ? data : (data ? data.orders || [] : []);
    tbody.innerHTML = '';

    renderPorEntregar(tbodyPorEntregar, porEntregar);
    renderEntregado(tbodyEntregado, entregado);
  } catch (error) {
    console.error('Error al cargar pedidos:', error);
    tbody.innerHTML = '<tr><td colspan="3">No fue posible conectar con el servidor en ' + API_BASE + '</td></tr>';
  }
}

function renderPorEntregar(tbody, pedidos) {
  tbody.innerHTML = '';

  if (!pedidos.length) {
    tbody.innerHTML = '<tr><td colspan="3">No hay pedidos.</td></tr>';
    return;
  }

  pedidos.forEach(function (pedido) {
    const tr = document.createElement('tr');

    const tdPlatillo = document.createElement('td');
    tdPlatillo.textContent = pedido.cantidad + 'x ' + pedido.platillo;

    const tdMesa = document.createElement('td');
    tdMesa.textContent = pedido.mesa || pedido.cliente || '-';

    const tdEstado = document.createElement('td');
    const btn = document.createElement('button');
    btn.className = 'btn btn-sm btn-success';
    btn.textContent = 'Marcar como entregado';
    btn.addEventListener('click', function () {
      marcarEntregado(pedido.id);
    });
    tdEstado.appendChild(btn);

    tr.appendChild(tdPlatillo);
    tr.appendChild(tdMesa);
    tr.appendChild(tdEstado);

    tbody.appendChild(tr);
  });
}

function renderEntregado(tbody, pedidos) {
  tbody.innerHTML = '';

  if (!pedidos.length) {
    tbody.innerHTML = '<tr><td colspan="3">No hay pedidos entregados.</td></tr>';
    return;
  }

  pedidos.forEach(function (pedido) {
    const tr = document.createElement('tr');

    const tdPlatillo = document.createElement('td');
    tdPlatillo.textContent = pedido.cantidad + 'x ' + pedido.platillo;

    const tdMesa = document.createElement('td');
    tdMesa.textContent = pedido.mesa || pedido.cliente || '-';

    const tdEstado = document.createElement('td');
    tdEstado.textContent = 'Entregado';

    tr.appendChild(tdPlatillo);
    tr.appendChild(tdMesa);
    tr.appendChild(tdEstado);

    tbody.appendChild(tr);
  });
}

async function marcarEntregado(id) {
  try {
    const response = await fetch(`${API_BASE}/entregado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
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