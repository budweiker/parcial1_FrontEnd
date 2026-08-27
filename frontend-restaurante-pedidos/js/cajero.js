// cajero.js
// Lógica para crear pedidos desde cajero.html

const API_BASE = 'http://localhost:3005';

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.btn-pedido').forEach(function (btn) {
    btn.addEventListener('click', function (event) {
      crearPedido(event.currentTarget);
    });
  });
});

async function crearPedido(boton) {
  const form = boton.closest('form');
  if (!form) return;

  const platilloSelect = form.querySelector('.platillo');
  const clienteInput = form.querySelector('.cliente');
  const cantidadInput = form.querySelector('.cantidad');
  const fechaInput = form.querySelector('.fecha');
  const observacionesInput = form.querySelector('.observaciones');

  if (!platilloSelect.closest('#Pizza, #Pasta, #Starter')) return;

  const contenedorPestaña = form.closest('.menu');
  const precioTag = contenedorPestaña ? contenedorPestaña.querySelector('.precios') : null;

  const platillo = platilloSelect.value;
  const cliente = clienteInput.value.trim();
  const cantidad = parseInt(cantidadInput.value, 10);
  const fecha = fechaInput.value;
  const observaciones = observacionesInput.value.trim();
  const precioTexto = precioTag ? precioTag.textContent.replace(/[^0-9]/g, '') : '0';
  const precio = parseInt(precioTexto, 10) || 0;

  if (!cliente || !cantidad || !fecha) {
    alert('Por favor completa cliente, cantidad y fecha.');
    return;
  }

  const pedido = {
    items: [{ name: platillo, qty: cantidad, price: precio }],
    client: cliente,
    observations: observaciones,
    status: 'pending',
    createdAt: fecha
  };

  try {
    const response = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify(pedido)
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok || (data.success !== undefined && !data.success)) {
      alert(data.message || 'No fue posible registrar el pedido.');
      return;
    }

    alert('Pedido registrado correctamente para ' + cliente + '.');
    form.reset();
  } catch (error) {
    console.error('Error al crear pedido:', error);
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