const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// IMPORTANTE: Usa una contraseña específica para aplicaciones generada desde tu cuenta de Google.
// Ve a https://support.google.com/accounts/answer/185833 para más información.
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Cambia esto si usas otro proveedor
    port: 587, // Puerto para STARTTLS
    secure: false, // Usa true para el puerto 465, false para otros puertos
    auth: {
        user: 'alberto.grajales97@unach.mx', // Reemplaza con tu correo
        pass: 'luzx fjwd kvrd zkjb' // Reemplaza con tu contraseña
    }
});

// Endpoint para enviar correos electrónicos
router.post('/send-email', async (req, res) => {
    const { productos } = req.body;

    if (!productos || productos.length === 0) {
        return res.status(400).json({ error: 'No hay productos en el carrito' });
    }

    try {
        // Crear el contenido del correo
        let contenido = 'Productos en tu carrito:\n\n';
        productos.forEach(producto => {
            contenido += `Producto: ${producto.producto}\nCantidad: ${producto.cantidad}\nSubtotal: ${producto.subtotal}\n\n`;
        });

        // Opciones del correo
        const mailOptions = {
            from: 'tu-correo@gmail.com',
            to: 'destinatario@gmail.com', // Reemplaza con el correo del destinatario
            subject: 'Detalles de tu compra',
            text: contenido
        };

        // Enviar el correo
        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Correo enviado exitosamente' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ error: 'Error al enviar el correo' });
    }
});

module.exports = router;