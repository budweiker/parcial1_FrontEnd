
const express = require('express');
const router = express.Router();

// Requerir el método controller
const controller = require('../controllers/controller')

router.get('/', controller.login);

// Rutas
//router.get('/', controller.login);
router.post('/login', controller.login_in);

//router.get('/register', controller.register);
router.post('/register', controller.save_register);

//crud pedidos
router.get('/pedidos', controller.pedidos);
router.post('/pedido', controller.pedido);
router.put('/pedido', controller.update_pedido);
router.delete('/pedido', controller.delete_Pedido);

//router.get('/list', controller.list);
router.get('/chef', controller.chef);
router.put('/preparando', controller.preparando);
router.put('/listo', controller.listo);

//router.get('/mesero', controller.mesero);
router.get('/mesero', controller.mesero);
router.put('/entregado', controller.finalizado);







































































































module.exports = router;