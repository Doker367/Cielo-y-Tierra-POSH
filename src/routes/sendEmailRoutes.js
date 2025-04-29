const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit'); // Importar PDFKit para generar el PDF
const fs = require('fs'); // Importar fs para manejar archivos

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
        return res.status(400).json({ message: 'No se proporcionaron productos para enviar en el correo.' });
    }

    // Generar el contenido del PDF
    const doc = new PDFDocument();
    const pdfPath = `ticket_${Date.now()}.pdf`;
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    doc.fontSize(20).text('Gracias por tu compra', { align: 'center' });
    doc.moveDown();
    doc.fontSize(14).text('Detalles de tu compra:', { align: 'left' });
    doc.moveDown();

    productos.forEach((producto, index) => {
        doc.text(`${index + 1}. ${producto.producto} - ${producto.cantidad} x $${producto.precio} = $${producto.subtotal}`);
    });

    doc.moveDown();
    doc.text(`Total: $${productos.reduce((total, p) => total + parseFloat(p.subtotal), 0).toFixed(2)}`, { align: 'right' });
    doc.moveDown();
    doc.text('Número de cuenta para depósito: 1234-5678-9012-3456', { align: 'left' });

    doc.end();

    writeStream.on('finish', async () => {
        try {
            await transporter.sendMail({
                from: 'alberto.grajales97@unach.mx',
                to: 'blcdoker@gmail.com', // Reemplaza con el correo del usuario autenticado
                subject: 'Detalles de tu compra',
                text: 'Adjunto encontrarás el ticket de tu compra.',
                attachments: [
                    {
                        filename: 'ticket.pdf',
                        path: pdfPath
                    }
                ]
            });

            // Eliminar el archivo PDF después de enviarlo
            fs.unlinkSync(pdfPath);

            res.status(200).json({ message: 'Correo enviado exitosamente con el ticket en PDF.' });
        } catch (error) {
            console.error('Error al enviar el correo:', error);
            res.status(500).json({ message: 'Error al enviar el correo.' });
        }
    });
});

module.exports = router;