// src/models/ProductoModel.js
const database = require('../config/database');

/**
 * Modelo Producto
 * Este modelo se encarga de TODA la comunicación con la tabla 'productos'
 */
class ProductoModel {
    constructor() {
        this.table = 'productos'; // Nombre de nuestra tabla
    }

    /**
     * Método: Obtener TODOS los productos
     * SQL: SELECT * FROM productos
     */
    async obtenerTodos() {
        try {
            const db = database.getDb(); // Usamos getDb() en lugar de getPool()
            // db.all() para obtener múltiples filas. El bind se hace con un array
            const rows = await db.all(`SELECT * FROM ${this.table}`);
            return rows;
        } catch (error) {
            throw new Error('Error al obtener productos: ' + error.message);
        }
    }

    /**
     * Método: Obtener UN producto por su ID
     * SQL: SELECT * FROM productos WHERE id = ?
     * @param {number} id - El ID del producto a buscar
     */
    async obtenerPorId(id) {
        try {
            const db = database.getDb();
            // db.get() para obtener una sola fila
            const row = await db.get(
                `SELECT * FROM ${this.table} WHERE id = ?`,
                [id] // Los parámetros se pasan en un array
            );
            return row; // Retorna el objeto o undefined
        } catch (error) {
            throw new Error('Error al obtener producto: ' + error.message);
        }
    }

    /**
     * Método: Crear un NUEVO producto
     * SQL: INSERT INTO productos (...) VALUES (?, ?, ?, ?)
     * @param {Object} datos - {nombre, descripcion, precio, stock}
     */
    async crear(datos) {
        try {
            const db = database.getDb();
            const { nombre, descripcion, precio, stock } = datos;

            // db.run() para INSERT, UPDATE, DELETE. Retorna información de la operación.
            const result = await db.run(
                `INSERT INTO ${this.table} (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)`,
                [nombre, descripcion, precio, stock]
            );

            // SQLite (usando la librería 'sqlite') devuelve 'lastID' con el ID insertado
            return {
                id: result.lastID, 
                ...datos
            };
        } catch (error) {
            throw new Error('Error al crear producto: ' + error.message);
        }
    }

    /**
     * Método: ACTUALIZAR un producto existente
     * SQL: UPDATE productos SET ... WHERE id = ?
     * @param {number} id - ID del producto
     * @param {Object} datos - Nuevos datos
     */
    async actualizar(id, datos) {
        try {
            const db = database.getDb();
            const { nombre, descripcion, precio, stock } = datos;

            const result = await db.run(
                `UPDATE ${this.table} SET nombre = ?, descripcion = ?, precio = ?, stock = ? WHERE id = ?`,
                [nombre, descripcion, precio, stock, id]
            );

            // changes nos dice cuántas filas se modificaron
            return result.changes > 0;
        } catch (error) {
            throw new Error('Error al actualizar producto: ' + error.message);
        }
    }

    /**
     * Método: ELIMINAR un producto
     * SQL: DELETE FROM productos WHERE id = ?
     * @param {number} id - ID del producto a eliminar
     */
    async eliminar(id) {
        try {
            const db = database.getDb();
            const result = await db.run(
                `DELETE FROM ${this.table} WHERE id = ?`,
                [id]
            );

            // changes nos dice cuántas filas se eliminaron
            return result.changes > 0;
        } catch (error) {
            throw new Error('Error al eliminar producto: ' + error.message);
        }
    }
}
module.exports = ProductoModel;