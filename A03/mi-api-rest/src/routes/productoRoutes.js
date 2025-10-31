// src/routes/productoRoutes.js
const express = require('express');
const ProductoController = require('../controllers/ProductoController');

/**
 * Clase para configurar las rutas de productos
 * Las rutas definen QUÉ hacer cuando el usuario visita una URL
 */
class ProductoRoutes {
    constructor() {
        this.router = express.Router(); // Creamos un router
        this.productoController = new ProductoController();
        this.configurarRutas();
    }

    configurarRutas() {
        /**
         * IMPORTANTE sobre bind():
         * Lo usamos para que 'this' dentro del controlador
         * siga apuntando al controlador y no se pierda
         */

        // GET /api/productos - Listar todos
        this.router.get(
            '/',
            this.productoController.obtenerTodos.bind(this.productoController)
        );

        // GET /api/productos/:id - Obtener uno
        this.router.get(
            '/:id',
            this.productoController.obtenerPorId.bind(this.productoController)
        );

        // POST /api/productos - Crear uno nuevo
        this.router.post(
            '/',
            this.productoController.crear.bind(this.productoController)
        );

        // PUT /api/productos/:id - Actualizar uno
        this.router.put(
            '/:id',
            this.productoController.actualizar.bind(this.productoController)
        );

        // DELETE /api/productos/:id - Eliminar uno
        this.router.delete(
            '/:id',
            this.productoController.eliminar.bind(this.productoController)
        );
    }

    getRouter() {
        return this.router;
    }
}

module.exports = ProductoRoutes;