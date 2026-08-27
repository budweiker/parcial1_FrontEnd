//Metodos para CRUD
const controller = {}

//BIENVENIDO
controller.login = (req,res)=>{
    //requerimos la conexion, podemos obtener un error err o la la conexion conn
    req.getConnection((err ,conn) => {
        // Si hay un error al obtener la conexión, responde con un JSON que contiene el error
        if (err) {
            res.json(err);
        }
        // Ejecuta un mensaje en pantalla y consola
        console.log("BIENVENIDO RESTAURANTE");
        res.send({"Message":"Bienvenido API REstaurante Ratatouille"});
    });
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

    // Validar campos obligatorios
    if (!user || !name || !rol || !password) {
        return res.status(400).json({ 
            success: false, 
            message: "Todos los campos son obligatorios" 
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

        // Verificar si el usuario ya existe en la base de datos
        conn.query('SELECT * FROM users WHERE user = ?', [user], (err, rows) => {
            if (err) {
                console.error("Error al buscar el usuario:", err);
                return res.status(500).json({ 
                    success: false, 
                    message: "Error interno del servidor al buscar el usuario" 
                });
            }

            // Si el usuario ya existe, devolver un error
            if (rows.length > 0) {
                return res.status(400).json({ 
                    success: false, 
                    message: "El nombre de usuario ya está registrado" 
                });
            }

            // Si el usuario no existe, crear el nuevo usuario
            const newUser = { user, name, rol, password };

            // Ejecuta una consulta SQL para insertar el nuevo usuario en la tabla 'users'
            conn.query('INSERT INTO users SET ?', newUser, (err, result) => {
                // Si hay un error al ejecutar la consulta, responde con un JSON que contiene el error
                if (err) {
                    console.error("Error al crear el usuario:", err);
                    return res.status(500).json({ 
                        success: false, 
                        message: "Error interno del servidor al crear el usuario" 
                    });
                }

                // Si todo sale bien, responde con un mensaje de éxito
                res.status(200).json({ 
                    success: true, 
                    message: "Usuario registrado con éxito", 
                    userId: result.insertId // Opcional: Devuelve el ID del usuario creado
                });
            });
        });
    });
};


//OBTENER LOS PEDIDOS REGISTRADOS POR EL CAJERO
controller.pedidos = (req,res)=>{
    //requerimos la conexion, podemos obtener un error err o la la conexion conn
    req.getConnection((err ,conn) => {
        //res.render('cajero');
        if (err) {
            res.json(err);
        }
        // Ejecuta una consulta SQL para buscar pedidos guardados
        conn.query('SELECT * FROM pedido', (err, results) => {
            // Si hay un error al ejecutar la consulta, responde con un JSON que contiene el error
            if (err) {
                res.json(err);
            }

            console.log(results);
            // Si no se encuentra ningún usuario con el nombre de usuario proporcionado, muestra un mensaje de error
            if (results.length === 0) {
                res.send({"mensaje":"No hay pedidos en la base de datos"});
                return;
            }

            // Verifica si la contraseña coincide
            const userRecord = results;
            res.json(userRecord);
        });
    });
};


//CREAR PEDIDO
controller.pedido = (req, res) => {
    // Obtén los datos enviados desde el formulario en el cuerpo de la solicitud
    const { platillo, precio, cantidad, observaciones, cliente, fecha } = req.body;
    console.log("Datos recibidos:", req.body);

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
};

//ACTUALIZAR PEDIDO
controller.update_pedido = (req, res) => {
    const { id, platillo, cantidad, observaciones, precio, cliente, fecha, estado } = req.body;
    console.log("ID del pedido para actualizar:", id); // Verifica si se captura el ID correctamente
    //res.send("Pedido Actualizado")
    // Crea un objeto con los datos del nuevo pedido
    const newPedido = { platillo, precio, cantidad, observaciones, cliente, fecha, estado };
    req.getConnection((err, conn) => {
        if (err) {
            console.log(err);
            res.send('Error al conectar a la base de datos');
            return;
        }
        const validKeys = ['platillo', 'precio', 'cantidad', 'observaciones', 'cliente', 'fecha', 'estado'];
        const receivedKeys = Object.keys(req.body);

        // Verificar si hay claves no permitidas
        const invalidKeys = receivedKeys.filter(key => !validKeys.includes(key));
        if (invalidKeys.length > 0) {
            return res.status(400).json({ 
                success: false, 
                message: `Claves no permitidas o mal escritas o faltantes: ${invalidKeys.join(', ')}` 
            });
        }
        // Validar campos obligatorios
        if (!platillo || !precio || !cantidad || !observaciones || !cliente || !fecha || !estado) {
            return res.status(400).json({ 
                success: false, 
                message: "Faltan campos obligatorios o son inválidos" 
            });
        }
        // Validar tipos de datos (opcional)
        if (typeof precio !== 'number' || typeof cantidad !== 'number') {
            return res.status(400).json({ 
                success: false, 
                message: "Los campos 'precio' y 'cantidad' deben ser números" 
            });
        }
        
        const query = 'UPDATE pedido SET platillo = ?, precio = ?, cantidad = ?, observaciones = ?, cliente = ?, fecha = ?, estado = ? WHERE id = ?';
        const params = [newPedido.platillo, newPedido.precio, newPedido.cantidad, newPedido.observaciones, newPedido.cliente, newPedido.fecha, newPedido.estado, id];

        conn.query(query, params, (err, result) => {
            if (err) {
                console.log(err);
                res.send('Error al actualizar el pedido');
            } else {
                res.send("Pedido actualizado con éxito");
            }
        });
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

        const pedidos = await new Promise((resolve, reject) => {
            conn.query(query, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        // Separar los pedidos por estado
        const dataPorPreparar = pedidos.filter(pedido => pedido.estado === 'preparar');
        const dataPreparando = pedidos.filter(pedido => pedido.estado === 'preparando');

        // Enviar la respuesta estructurada
        res.status(200).json({
            success: true,
            message: "Datos obtenidos correctamente",
            data: {
                porPreparar: dataPorPreparar,
                preparando: dataPreparando
            }
        });
    } catch (err) {
        console.error("Error en la petición del chef:", err);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor al obtener los pedidos"
        });
    }
};

//ROL CHEF - CAMBIAR ESTADO DEL PEDIDO "A PREPARANDO"
controller.preparando = async (req, res) => {
    const { id } = req.body;

    // Validar que el ID sea un número y no esté vacío
    if (!id || isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: "El ID del pedido es inválido"
        });
    }

    console.log("ID del pedido a actualizar:", id);

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

        // Verificar si el pedido existe antes de actualizarlo
        const pedidoExistente = await new Promise((resolve, reject) => {
            conn.query('SELECT * FROM pedido WHERE id = ?', [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        if (pedidoExistente.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontró el pedido con el ID proporcionado"
            });
        }

        // Actualizar el estado del pedido a "preparando"
        const result = await new Promise((resolve, reject) => {
            conn.query('UPDATE pedido SET estado = ? WHERE id = ?', ['preparando', id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        // Verificar si se actualizó algún registro
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontró el pedido con el ID proporcionado"
            });
        }

        // Enviar respuesta de éxito
        res.status(200).json({
            success: true,
            message: "Estado del pedido actualizado a 'preparando'",
            pedidoId: id
        });
    } catch (err) {
        console.error("Error al actualizar el estado del pedido:", err);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor al actualizar el estado del pedido"
        });
    }
};

//ROL CHEF - CAMBIAR ESTADO DEL PEDIDO A "POR ENTREGAR"
controller.listo = async (req, res) => {
    const { id } = req.body;

    // Validar que el ID sea un número y no esté vacío
    if (!id || isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: "El ID del pedido es inválido"
        });
    }

    console.log("ID del pedido a actualizar:", id);

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

        // Verificar si el pedido existe antes de actualizarlo
        const pedidoExistente = await new Promise((resolve, reject) => {
            conn.query('SELECT * FROM pedido WHERE id = ?', [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        if (pedidoExistente.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontró el pedido con el ID proporcionado"
            });
        }

        // Actualizar el estado del pedido a "preparando"
        const result = await new Promise((resolve, reject) => {
            conn.query('UPDATE pedido SET estado = ? WHERE id = ?', ['entregar', id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        // Verificar si se actualizó algún registro
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontró el pedido con el ID proporcionado"
            });
        }

        // Enviar respuesta de éxito
        res.status(200).json({
            success: true,
            message: "Estado del pedido actualizado a 'entregar'",
            pedidoId: id
        });
    } catch (err) {
        console.error("Error al actualizar el estado del pedido:", err);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor al actualizar el estado del pedido"
        });
    }
};


//OBTENER PEDIDOS POR PREPARAR PARA EL MESERO
controller.mesero = async (req, res) => {
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
            WHERE estado IN ('entregar', 'entregado')
            ORDER BY estado, fecha;`; // Ordenar por estado y fecha

        const pedidos = await new Promise((resolve, reject) => {
            conn.query(query, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        // Separar los pedidos por estado
        const dataPorentregar = pedidos.filter(pedido => pedido.estado === 'entregar');
        const dataEntregado = pedidos.filter(pedido => pedido.estado === 'entregado');

        // Enviar la respuesta estructurada
        res.status(200).json({
            success: true,
            message: "Datos obtenidos correctamente",
            data: {
                porEntregar: dataPorentregar,
                entregado: dataEntregado
            }
        });
    } catch (err) {
        console.error("Error en la petición del mesero:", err);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor al obtener los pedidos"
        });
    }
};

// ROL MESERO - CAMBIAR ESTADO DEL PEDIDO A "ENTREGADO"
controller.finalizado = async (req, res) => {
    const { id } = req.body;

    // Validar que el ID sea un número y no esté vacío
    if (!id || isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: "El ID del pedido es inválido"
        });
    }

    console.log("ID del pedido a actualizar:", id);

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

        // Verificar si el pedido existe antes de actualizarlo
        const pedidoExistente = await new Promise((resolve, reject) => {
            conn.query('SELECT * FROM pedido WHERE id = ?', [id], (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });

        if (pedidoExistente.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontró el pedido con el ID proporcionado"
            });
        }

        // Actualizar el estado del pedido a "entregado"
        const result = await new Promise((resolve, reject) => {
            conn.query('UPDATE pedido SET estado = ? WHERE id = ?', ['entregado', id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });

        // Verificar si se actualizó algún registro
        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "No se encontró el pedido con el ID proporcionado"
            });
        }

        // Enviar respuesta de éxito
        res.status(200).json({
            success: true,
            message: "Estado del pedido actualizado a 'entregado'",
            pedidoId: id
        });
    } catch (err) {
        console.error("Error al actualizar el estado del pedido:", err);
        res.status(500).json({
            success: false,
            message: "Error interno del servidor al actualizar el estado del pedido"
        });
    }
};




module.exports = controller;

