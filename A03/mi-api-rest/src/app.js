// src/app.js
const express = require('express');
const cors = require('cors');
const ProductoRoutes = require('./routes/productoRoutes');

/**
 * Clase principal de la aplicación
 * Aquí configuramos Express y todos los middlewares
 */
class App {
    constructor() {
        this.app = express(); // Creamos la aplicación Express
        this.configurarMiddlewares();
        this.configurarRutas();
    }

    /**
     * Middlewares: funciones que procesan las peticiones ANTES
     * de que lleguen a nuestros controladores
     */
    configurarMiddlewares() {
        // CORS: permite que otros sitios web usen nuestra API
        this.app.use(cors());

        // Permite leer JSON en el body de las peticiones
        this.app.use(express.json());

        // Permite leer datos de formularios
        this.app.use(express.urlencoded({ extended: true }));

        // Middleware personalizado: muestra en consola cada petición
        this.app.use((req, res, next) => {
            console.log(` ${req.method} ${req.path}`);
            next(); // Continúa al siguiente middleware
        });
    }

    configurarRutas() {
        // Ruta raíz - Página de bienvenida
        this.app.get('/', (req, res) => {
            res.json({
                mensaje: ' ¡Bienvenido a la API REST de Productos!',
                version: '1.0.0',
                endpoints: {
                    productos: '/api/productos',
                    documentacion: 'Usa Postman en VSCode para probar'
                }
            });
        });

        // Rutas de productos
        const productoRoutes = new ProductoRoutes();
        this.app.use('/api/productos', productoRoutes.getRouter());

        // Ruta 404 - Cuando la URL no existe
        this.app.use((req, res) => {
            res.status(404).json({
                success: false,
                mensaje: 'Ruta no encontrada'
            });
        });
    }

    getApp() {
        return this.app;
    }
}

module.exports = App;