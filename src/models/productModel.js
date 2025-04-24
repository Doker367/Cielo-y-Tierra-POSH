const { promisePool } = require('../config/db');

class ProductModel {
    static async getAllProducts() {
        try {
            const [productos_posh] = await promisePool.query(`
                SELECT 
                    producto_id,
                    nombre,
                    descripcion,
                    REPLACE(imagen, '/public', '') AS imagen,
                    precio,
                    contenido_ml
                FROM productos_posh
            `);
            return productos_posh;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }

    static async getProductById(id) {
        try {
            const [rows] = await promisePool.query(
                'SELECT * FROM productos_posh WHERE producto_id = ?',
                [id]
            );
            return rows[0];
        } catch (error) {
            console.error('Error al obtener el producto por ID:', error);
            throw error;
        }
    }
}

module.exports = ProductModel;