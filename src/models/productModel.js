const db = require('../config/db');
class ProductModel {
    static async getAllProducts() {
        try {
            const [productos] = await db.query(`
                SELECT 
                    producto_id,
                    nombre,
                    descripcion,
                    precio
                FROM productos_posh
            `);
            return productos;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }
}
module.exports = ProductModel;