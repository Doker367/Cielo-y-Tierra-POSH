const db = require('../config/db');
class ProductModel {
    static async getAllProducts() {
        try {
            const [rows] = await db.query('SELECT * FROM productos');
            return rows;
        } catch (error) {
            console.error('Error al obtener productos:', error);
            throw error;
        }
    }
}
module.exports = ProductModel;