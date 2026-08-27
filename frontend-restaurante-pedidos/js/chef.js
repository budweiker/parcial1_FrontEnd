// chef.js
// Lógica de chef.html

const API_BASE = 'http://localhost:3005';

document.addEventListener('DOMContentLoaded', function () {
  cargarPedidosChef();
});

async function cargarPedidosChef() {
  const tbodyPorPreparar = document.querySelector('#PorPreparar tbody');
  const tbodyPreparando = document.querySelector('#Preparando tbody');
  if (!tbodyPorPreparar || !tbodyPreparando) return;

  try {
    const response = await fetch(`${API_BASE}/chef`);
    const data = await response.json();

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

    renderTabla(tbodyPorPreparar, porPreparar, 'Empezar a preparar', pasarAPreparando);
    renderTabla(tbodyPreparando, preparando, 'Marcar como listo', pasarAListo);
  } catch (error) {
    console.error('Error al cargar pedidos:', error);
    tbody.innerHTML = '<tr><td colspan="3">No fue posible conectar con el servidor en ' + API_BASE + '</td></tr>';
  }
}

function renderTabla(tbody, pedidos, textoBoton, accion) {
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
    btn.className = 'btn btn-sm btn-primary';
    btn.textContent = textoBoton;
    btn.addEventListener('click', function () {
      accion(pedido.id);
    });
    tdEstado.appendChild(btn);

    tr.appendChild(tdPlatillo);
    tr.appendChild(tdMesa);
    tr.appendChild(tdEstado);

    tbody.appendChild(tr);
  });
}

async function pasarAPreparando(id) {
  await actualizarEstado('/preparando', id);
}

async function pasarAListo(id) {
  await actualizarEstado('/listo', id);
}

async function actualizarEstado(endpoint, id) {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id })
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