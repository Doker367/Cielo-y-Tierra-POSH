const ProductModel = require('../models/productModel');

class ProductController {
    static async getProducts() {
        try {
            const products = await ProductModel.getAllProducts();
            return products.map(producto => ({
                producto_id: producto.id_producto,
                nombre: producto.nombre,
                descripcion: producto.descripcion,
                precio: parseFloat(producto.precio),
                imagen: producto.imagen,
                descuento: Math.round(((producto.precio_regular - producto.precio_descuento) / producto.precio_regular) * 100) || 0
            }));
        } catch (error) {
            console.error('Error en el controlador:', error);
            throw error;
        }
    }

    static async getProductById(req, res) {
        try {
            const { id } = req.params;
            if (!id) {
                return res.status(400).json({ message: 'El parámetro id es requerido' });
            }
            const product = await ProductModel.getProductById(id);
            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado' });
            }
            return res.status(200).json(product);
        } catch (error) {
            console.error('Error al obtener el producto:', error);
            return res.status(500).json({ message: 'Error interno del servidor al obtener el producto' });
        }
    }
}

module.exports = ProductController;