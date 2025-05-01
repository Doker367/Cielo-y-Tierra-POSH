class ProductDetailCard {
    static create(producto) {
        if (!producto) {
            return '<p class="text-red-500">No se encontró información del producto</p>';
        }

        return `
            <div class="w-full flex flex-col md:flex-row">
                <!-- Imagen del producto -->
                <div class="w-full md:w-1/2 p-4">
                    <div class="relative">
                        ${producto.descuento ? `
                            <span class="absolute top-2 left-2 bg-orange-400 text-white text-xs font-semibold px-2 py-1 rounded-full">
                                -${producto.descuento}%
                            </span>
                        ` : ''}
                        <img src="${producto.imagen}" 
                             alt="${producto.nombre}" 
                             class="w-full h-auto object-contain rounded-lg shadow-lg">
                    </div>
                </div>

                <!-- Información del producto -->
                <div class="w-full md:w-1/2 p-4">
                    <h1 class="text-3xl font-bold text-gray-800 mb-4">${producto.nombre}</h1>
                    
                    <div class="bg-gray-50 rounded-lg p-4 mb-4">
                        <p class="text-gray-600 text-lg">${producto.descripcion || 'Sin descripción disponible'}</p>
                    </div>

                    <div class="flex items-baseline space-x-4 mb-6">
                        <span class="text-3xl font-bold text-blue-600">$${producto.precio?.toFixed(2)}</span>
                        ${producto.precio_regular ? `
                            <span class="text-xl text-gray-400 line-through">
                                $${producto.precio_regular.toFixed(2)}
                            </span>
                        ` : ''}
                    </div>

                    <div class="border-t border-gray-200 py-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div class="text-gray-600">
                                <span class="font-semibold">Contenido:</span>
                                <span class="ml-2">${producto.contenido_ml || 'N/A'} ml</span>
                            </div>
                            ${producto.grados_alcohol ? `
                                <div class="text-gray-600">
                                    <span class="font-semibold">Grados de alcohol:</span>
                                    <span class="ml-2">${producto.grados_alcohol}°</span>
                                </div>
                            ` : ''}
                        </div>
                    </div>

                    <div class="mt-6 flex space-x-4">
                        <button onclick="agregarAlCarrito(${producto.producto_id})" 
                                class="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center">
                            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"/>
                            </svg>
                            Agregar al carrito
                        </button>
                        
                        <button onclick="agregarAFavoritos(${producto.producto_id})" 
                                class="px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200">
                            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }
}

// Para usar en archivos JavaScript
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductDetailCard;
}