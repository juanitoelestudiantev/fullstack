// src/config/database.js
const sqlite3 = require('sqlite3');
require('dotenv').config();

/**
 * Clase para manejar la conexión a la base de datos
 */
class Database {
    constructor() {
        // La instancia de la base de datos de archivos
        this.db = null;
        this.dbFile = process.env.DB_FILE || './tienda_api.sqlite';

        // Métodos auxiliares para usar async/await con sqlite3
        this.dbRun = null;
        this.dbGet = null;
        this.dbAll = null;
    }

    /**
     * Envuelve el método de sqlite3 con una Promesa para usar async/await.
     */
    promisifyMethod(method) {
        return function(sql, params = []) {
            return new Promise((resolve, reject) => {
                // Llama al método original de sqlite3 (patrón callback)
                this.db[method](sql, params, function (err, row) {
                    if (err) return reject(err);
                    
                    if (method === 'run') {
                        resolve(this); // Devuelve información como lastID/changes
                    } else {
                        resolve(row);
                    }
                });
            });
        }.bind(this);
    }

    /**
     * Crea la conexión a SQLite.
     * Reemplaza la creación del pool de conexiones.
     */
    async connect() {
        try {
            // Abrir la conexión a la base de datos de archivo
            this.db = await new Promise((resolve, reject) => {
                const dbInstance = new sqlite3.Database(this.dbFile, (err) => {
                    if (err) return reject(err);
                    resolve(dbInstance);
                });
            });
            
            // Crear los métodos promisificados que usarán los modelos
            this.dbRun = this.promisifyMethod('run');
            this.dbGet = this.promisifyMethod('get');
            this.dbAll = this.promisifyMethod('all');

            // Aquí replicamos ese log.
            console.log('Conectado a SQLite exitosamente'); 
            
            // Replicamos el retorno, aunque devolvemos la interfaz en lugar del pool
            return this.getDb(); 
        } catch (error) {
            console.error('Error al conectar a SQLite:', error.message);
            throw error;
        }
    }

    /**
     * Obtiene la interfaz de base de datos para hacer consultas
     */
    getDb() {
        // Devolvemos la interfaz con los métodos promisificados (run, get, all)
        return {
            run: this.dbRun, 
            get: this.dbGet, 
            all: this.dbAll, 
        };
    }
}

// Exportamos UNA SOLA instancia (patrón Singleton)
// Así toda la aplicación usa la misma conexión
module.exports = new Database();