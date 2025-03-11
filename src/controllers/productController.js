const ProductModel = require('../models/productModel');
class ProductController {
    static async getProducts() {
        try {
            const products = await ProductModel.getAllProducts();
            return products.map(producto => ({
                producto_id: producto.producto_id,
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                precio: parseFloat(producto.precio),
                descuento: Math.round(((producto.precio_regular - producto.precio_descuento) / producto.precio_regular) * 100)
            }));
        } catch (error) {
            console.error('Error en el controlador:', error);
            throw error;
        }
    }
}
module.exports = ProductController;