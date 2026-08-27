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

//LOGIN
controller.login_in = (req, res) => {
    // Obtén los datos enviados desde el formulario en el cuerpo de la solicitud
    const { user, password } = req.body;

    // Validar campos obligatorios
    if (!user || !password) {
        return res.status(400).json({ 
            success: false, 
            message: "El nombre de usuario y la contraseña son obligatorios" 
        });
    }
    console.log("Intento de inicio de sesión:", { user });

    // Requerir la conexión a la base de datos utilizando req.getConnection
    req.getConnection((err, conn) => {
        // Si hay un error al obtener la conexión, responde con un JSON que contiene el error
        if (err) {
            console.error("Error al conectar a la base de datos:", err);
            return res.status(500).json({ 
                success: false, 
                message: "Error interno del servidor al conectar a la base de datos" 
            });
        }

        // Ejecuta una consulta SQL para buscar el usuario por su nombre de usuario
        conn.query('SELECT * FROM users WHERE user = ?', [user], async (err, results) => {
            // Si hay un error al ejecutar la consulta, responde con un JSON que contiene el error
            if (err) {
                console.error("Error al buscar el usuario:", err);
                return res.status(500).json({ 
                    success: false, 
                    message: "Error interno del servidor al buscar el usuario" 
                });
            }

            // Si no se encuentra ningún usuario con el nombre de usuario proporcionado, muestra un mensaje de error
            if (results.length === 0) {
                return res.status(401).json({ 
                    success: false, 
                    message: "Usuario o contraseña incorrecta" 
                });
            }

            // Obtener el registro del usuario
            const userRecord = results[0];

            // Si la contraseña es correcta, devolver los datos del usuario (sin la contraseña)
            const { password: _, ...userData } = userRecord; // Excluir la contraseña de la respuesta
            res.status(200).json({ 
                success: true, 
                message: "Inicio de sesión exitoso", 
                user: userData 
            });

            /* 
            // Si necesitas redireccionar según el rol, es mejor manejarlo en el frontend
            if (userRecord.rol === "cajero") {
                res.redirect('/cajero');
            } else if (userRecord.rol === "chef") {
                res.redirect('/chef');
            } else {
                res.redirect('/mesero');
            }
            */
        });
    });
};

//CREAR USUARIO
controller.save_register = (req, res) => {
    // Obtén los datos enviados desde el formulario en el cuerpo de la solicitud
    const { user, name, rol, password } = req.body;
    console.log("Servidor recibió los datos:", req.body);

    const data = await response.json().catch(() => null);

    if (!response.ok || (data && data.success === false)) {
      tbody.innerHTML = '<tr><td colspan="4">No fue posible cargar los pedidos.</td></tr>';
      return;
    }

    const pedidos = Array.isArray(data) ? data : (data ? data.orders || [] : []);
    tbody.innerHTML = '';

    // Validar campos obligatorios
    if (!platillo || !precio || !cantidad || !cliente || !fecha) {
        return res.status(400).json({ 
            success: false, 
            message: "Faltan campos obligatorios: platillo, precio, cantidad, cliente o fecha" 
        });
    }

    // Validar tipos de datos
    if (typeof precio !== 'number' || typeof cantidad !== 'number') {
        return res.status(400).json({ 
            success: false, 
            message: "Los campos 'precio' y 'cantidad' deben ser números" 
        });
    }

    // Crear un objeto con los datos del nuevo pedido, asignando el estado por defecto
    const newPedido = { 
        platillo, 
        precio, 
        cantidad, 
        observaciones: observaciones || null, // Si observaciones no está presente, se asigna null
        cliente, 
        fecha, 
        estado: "preparar" // Estado por defecto
    };
    console.log("Datos a insertar:", newPedido);

    // Requerir la conexión a la base de datos utilizando req.getConnection
    req.getConnection((err, conn) => {
        // Si hay un error al obtener la conexión, responde con un JSON que contiene el error
        if (err) {
            console.error("Error al conectar a la base de datos:", err);
            return res.status(500).json({ 
                success: false, 
                message: "Error interno del servidor al conectar a la base de datos" 
            });
        }

        // Ejecuta una consulta SQL para insertar el nuevo pedido en la tabla 'pedido'
        conn.query('INSERT INTO pedido SET ?', newPedido, (err, result) => {
            // Si hay un error al ejecutar la consulta, responde con un JSON que contiene el error
            if (err) {
                console.error("Error al crear el pedido:", err);
                return res.status(500).json({ 
                    success: false, 
                    message: "Error interno del servidor al crear el pedido" 
                });
            }

            // Si todo sale bien, responde con un mensaje de éxito
            res.status(200).json({ 
                success: true, 
                message: "Pedido creado con éxito", 
                id: result.insertId // Opcional: Devuelve el ID del pedido creado
            });
        });
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
};

//ELIMINAR PEDIDO
controller.delete_Pedido = (req, res) => {
    // Obtén el ID del pedido que se va a eliminar desde los parámetros de la URL
    const { id } = req.body;
    console.log("ID del pedido a eliminar:", id);

    // Validar que el ID esté presente
    if (!id) {
        return res.status(400).json({ 
            success: false, 
            message: "El ID del pedido es obligatorio" 
        });
    }

    // Requerir la conexión a la base de datos utilizando req.getConnection
    req.getConnection((err, conn) => {
        // Si hay un error al obtener la conexión, responde con un JSON que contiene el error
        if (err) {
            console.error("Error al conectar a la base de datos:", err);
            return res.status(500).json({ 
                success: false, 
                message: "Error interno del servidor al conectar a la base de datos" 
            });
        }

        // Ejecuta una consulta SQL para eliminar el pedido con el ID proporcionado
        conn.query('DELETE FROM pedido WHERE id = ?', [id], (err, result) => {
            // Si hay un error al ejecutar la consulta, responde con un JSON que contiene el error
            if (err) {
                console.error("Error al eliminar el pedido:", err);
                return res.status(500).json({ 
                    success: false, 
                    message: "Error interno del servidor al eliminar el pedido" 
                });
            }

            // Verificar si se eliminó algún registro
            if (result.affectedRows === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: "No se encontró el pedido con el ID proporcionado" 
                });
            }

            // Si todo sale bien, responde con un mensaje de éxito
            res.status(200).json({ 
                success: true, 
                message: "Pedido eliminado con éxito" 
            });
        });
    });
};

//OBTENER PEDIDOS POR PREPARAR PARA EL CHEF
controller.chef = async (req, res) => {
    try {
        // Obtener la conexión a la base de datos
        const conn = await new Promise((resolve, reject) => {
            req.getConnection((err, conn) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(conn);
                }
            });
        });

        // Consulta para obtener los pedidos con estado "por preparar" y "preparando"
        const query = `
            SELECT * 
            FROM pedido 
            WHERE estado IN ('preparar', 'preparando')
            ORDER BY estado, fecha;`; // Ordenar por estado y fecha

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
