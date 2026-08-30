// mesero.js
// Lógica de mesero.html

const API_BASE = 'http://localhost:3005';

document.addEventListener('DOMContentLoaded', function () {
  cargarPedidosMesero();
  setupModalHandlers();
});

async function cargarPedidosMesero() {
  const tbodyPorEntregar = document.querySelector('#PorEntregar tbody');
  const tbodyEntregado = document.querySelector('#Entregado tbody');
  if (!tbodyPorEntregar || !tbodyEntregado) return;

  try {
    const response = await fetch(`${API_BASE}/mesero`);
    const json = await response.json().catch(() => null);

    if (!response.ok || (json && json.success === false)) {
      tbodyPorEntregar.innerHTML = '<tr><td colspan="3">No fue posible cargar los pedidos.</td></tr>';
      tbodyEntregado.innerHTML = '<tr><td colspan="3">No fue posible cargar los pedidos.</td></tr>';
      return;
    }

    let porEntregar = [];
    let entregado = [];

    if (Array.isArray(json)) {
      porEntregar = json.filter(p => p.estado === 'entregar');
      entregado = json.filter(p => p.estado === 'entregado');
    } else if (json && json.data) {
      porEntregar = json.data.porEntregar || [];
      entregado = json.data.entregado || [];
    }

    renderPorEntregar(tbodyPorEntregar, porEntregar);
    renderEntregado(tbodyEntregado, entregado);
  } catch (error) {
    console.error('Error al cargar pedidos:', error);
    tbodyPorEntregar.innerHTML = '<tr><td colspan="3">No fue posible conectar con el servidor en ' + API_BASE + '</td></tr>';
    tbodyEntregado.innerHTML = '<tr><td colspan="3">No fue posible conectar con el servidor en ' + API_BASE + '</td></tr>';
  }
}

function renderPorEntregar(tbody, pedidos) {
  tbody.innerHTML = '';

  if (!pedidos || pedidos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3">No hay pedidos.</td></tr>';
    return;
  }

  pedidos.forEach(function (pedido) {
    const tr = document.createElement('tr');

    const tdPlatillo = document.createElement('td');
    tdPlatillo.textContent = (pedido.cantidad || 1) + 'x ' + (pedido.platillo || '-');

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

  if (!pedidos || pedidos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="3">No hay pedidos entregados.</td></tr>';
    return;
  }

  pedidos.forEach(function (pedido) {
    const tr = document.createElement('tr');

    const tdPlatillo = document.createElement('td');
    tdPlatillo.textContent = (pedido.cantidad || 1) + 'x ' + (pedido.platillo || '-');

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

function setupModalHandlers() {
  const modalEl = document.getElementById('modalAgregarPedido');
  let bootstrapModal = null;
  if (modalEl && window.bootstrap && bootstrap.Modal) bootstrapModal = new bootstrap.Modal(modalEl);

  const btnAdd = document.getElementById('btnAddPorEntregar');
  if (btnAdd && modalEl && bootstrapModal) {
    btnAdd.addEventListener('click', () => {
      const form = document.getElementById('formAgregarPedido');
      if (form) form.reset();
      bootstrapModal.show();
    });
  }

  const form = document.getElementById('formAgregarPedido');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const platillo = document.getElementById('inputPlatillo').value.trim();
      const cantidad = parseInt(document.getElementById('inputCantidad').value, 10) || 1;
      const mesa = document.getElementById('inputMesa').value.trim();
      const observaciones = document.getElementById('inputObservaciones') ? document.getElementById('inputObservaciones').value.trim() : '';

      if (!platillo || !mesa) {
        alert('Platillo y Mesa son obligatorios.');
        return;
      }

      const mesaNum = parseInt(mesa, 10);
      const nowIso = new Date().toISOString();
      const fechaSafe = nowIso.slice(0, 19); // YYYY-MM-DDTHH:MM:SS
      const payload = {
        platillo,
        precio: 0,
        cantidad,
        observaciones,
        cliente: mesa,
        mesa: isNaN(mesaNum) ? 0 : mesaNum,
        fecha: fechaSafe,
        estado: 'preparar'
      };

      try {
        const res = await fetch(`${API_BASE}/pedido`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || (json.success !== undefined && !json.success)) {
          alert(json.message || 'No fue posible crear el pedido.');
          return;
        }
        if (bootstrapModal) bootstrapModal.hide();
        cargarPedidosMesero();
      } catch (err) {
        console.error(err);
        alert('Error al conectar con el servidor.');
      }
    });
  }
}