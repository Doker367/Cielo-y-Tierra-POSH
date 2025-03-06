const ProductModel = require('../models/productModel');
class ProductController {
    static async getProducts() {
        try {
            const products = await ProductModel.getAllProducts();
            return products;
        } catch (error) {
            console.error('Error en el controlador:', error);
            throw error;
        }
    }
}
module.exports = ProductController;