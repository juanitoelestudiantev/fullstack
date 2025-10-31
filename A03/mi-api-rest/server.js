// server.js
require('dotenv').config(); // Carga las variables del archivo .env
const App = require('./src/app');
const database = require('./src/config/database');
/**
* Clase para iniciar el servidor
* Este es el punto de entrada de toda la aplicación
*/
class Server {
    constructor() {
        this.port = process.env.PORT || 3000;
        this.app = new App().getApp();
    }
    async iniciar() {
        try {
            // PASO 1: Conectar a la base de datos
            console.log(' Conectando a SQLite...');
            await database.connect();

            // PASO 2: Iniciar el servidor web
            this.app.listen(this.port, () => {
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log(`Servidor corriendo en http://localhost:${this.port}`);
                console.log(`Documentación:http://localhost:${this.port}/api/productos`);
                console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
                console.log('Presiona Ctrl+C para detener el servidor');
            });
        } catch (error) {
            console.error('Error al iniciar el servidor:', error);
            process.exit(1); // Salir del proceso con error
        }
    }
}
// Crear e iniciar el servidor
const server = new Server();
server.iniciar();