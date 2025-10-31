// src/controllers/ProductoController.js
const ProductoModel = require('../models/ProductoModel');

/**
 * Controlador de Productos
 * El controlador es el "cerebro" - recibe peticiones y decide qué hacer
 * Se comunica entre las rutas (lo que pide el usuario) y el modelo (la base de datos)
 */
class ProductoController {
    constructor() {
        // Creamos una instancia del modelo para usar sus métodos
        this.productoModel = new ProductoModel();
    }

    /**
     * Obtener todos los productos
     * Ruta: GET /api/productos
     * @param {Object} req - Request (petición del cliente)
     * @param {Object} res - Response (respuesta al cliente)
     */
    async obtenerTodos(req, res) {
        try {
            // Pedimos al modelo que nos traiga todos los productos
            const productos = await this.productoModel.obtenerTodos();

            // Enviamos una respuesta exitosa (código 200)
            res.status(200).json({
                success: true,
                mensaje: 'Productos obtenidos correctamente',
                data: productos
            });
        } catch (error) {
            // Si algo sale mal, enviamos un error (código 500)
            res.status(500).json({
                success: false,
                mensaje: 'Error al obtener productos',
                error: error.message
            });
        }
    }

    /**
     * Obtener un producto específico por su ID
     * Ruta: GET /api/productos/:id
     * Ejemplo: GET /api/productos/1
     */
    async obtenerPorId(req, res) {
        try {
            // req.params contiene los parámetros de la URL
            const { id } = req.params; // Extraemos el ID
            const producto = await this.productoModel.obtenerPorId(id);

            // Si no existe, enviamos error 404 (No encontrado)
            if (!producto) {
                return res.status(404).json({
                    success: false,
                    mensaje: 'Producto no encontrado'
                });
            }

            // Si existe, lo enviamos
            res.status(200).json({
                success: true,
                mensaje: 'Producto encontrado',
                data: producto
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                mensaje: 'Error al obtener producto',
                error: error.message
            });
        }
    }

    /**
     * Crear un nuevo producto
     * Ruta: POST /api/productos
     * El cliente envía los datos en el body de la petición
     */
    async crear(req, res) {
        try {
            // req.body contiene los datos enviados por el cliente
            const { nombre, descripcion, precio, stock } = req.body;

            // Validación: verificamos que existan los datos obligatorios
            if (!nombre || !precio) {
                return res.status(400).json({
                    success: false,
                    mensaje: 'Nombre y precio son obligatorios'
                });
            }

            // Creamos el producto
            const nuevoProducto = await this.productoModel.crear({
                nombre,
                descripcion,
                precio,
                stock: stock || 0 // Si no envían stock, ponemos 0
            });

            // Código 201 significa "Creado exitosamente"
            res.status(201).json({
                success: true,
                mensaje: 'Producto creado exitosamente',
                data: nuevoProducto
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                mensaje: 'Error al crear producto',
                error: error.message
            });
        }
    }

    /**
     * Actualizar un producto existente
     * Ruta: PUT /api/productos/:id
     */
    async actualizar(req, res) {
        try {
            const { id } = req.params;
            const { nombre, descripcion, precio, stock } = req.body;

            // Primero verificamos que el producto exista
            const productoExiste = await this.productoModel.obtenerPorId(id);
            if (!productoExiste) {
                return res.status(404).json({
                    success: false,
                    mensaje: 'Producto no encontrado'
                });
            }

            // Actualizamos el producto
            const actualizado = await this.productoModel.actualizar(id, {
                nombre,
                descripcion,
                precio,
                stock
            });

            if (actualizado) {
                res.status(200).json({
                    success: true,
                    mensaje: 'Producto actualizado exitosamente'
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                mensaje: 'Error al actualizar producto',
                error: error.message
            });
        }
    }

    /**
     * Eliminar un producto
     * Ruta: DELETE /api/productos/:id
     */
    async eliminar(req, res) {
        try {
            const { id } = req.params;

            // Verificamos que exista antes de eliminar
            const productoExiste = await this.productoModel.obtenerPorId(id);
            if (!productoExiste) {
                return res.status(404).json({
                    success: false,
                    mensaje: 'Producto no encontrado'
                });
            }

            // Eliminamos el producto
            const eliminado = await this.productoModel.eliminar(id);
            if (eliminado) {
                res.status(200).json({
                    success: true,
                    mensaje: 'Producto eliminado exitosamente'
                });
            }
        } catch (error) {
            res.status(500).json({
                success: false,
                mensaje: 'Error al eliminar producto',
                error: error.message
            });
        }
    }
}

module.exports = ProductoController;