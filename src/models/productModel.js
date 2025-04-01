const { promisePool } = require('../config/db');

class ProductModel {
    static async getAllProducts() {
        try {
            const [productos_posh] = await promisePool.query(`
                SELECT 
                    producto_id,
                    nombre,
                    descripcion,
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
}

module.exports = ProductModel;