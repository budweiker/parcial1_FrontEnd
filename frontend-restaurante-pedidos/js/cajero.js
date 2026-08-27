// cajero.js
// Lógica para crear pedidos desde cajero.html (pestañas Pizza / Pasta / Starter)
// Coincide con: POST /pedido -> controller.pedido
// El backend exige: platillo, precio (number), cantidad (number), cliente, fecha
// "observaciones" es opcional.

const API_BASE = 'http://localhost:3005'; // cambia esto por la URL real cuando despliegues el backend

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

  if (!cliente || !cantidad || !fecha || !precio) {
    alert('Por favor completa cliente, cantidad y fecha.');
    return;
  }

  // Nota: el backend actual (controller.pedido) no guarda un campo "mesa"
  // aunque aparece en el ejemplo de routes.http; el formulario de cajero.html
  // tampoco tiene un input para la mesa. Si luego agregas ese campo en el
  // formulario y en el controller, solo hay que añadirlo aquí también.
  const nuevoPedido = {
    platillo,
    precio,
    cantidad,
    observaciones,
    cliente,
    fecha
  };

  try {
    const response = await fetch(`${API_BASE}/pedido`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoPedido)
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