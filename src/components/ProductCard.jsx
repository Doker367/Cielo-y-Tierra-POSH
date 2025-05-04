class ProductCard {
    static create(producto, options = {}) {
        const {
            showControls = true,
            showDetails = false,
            isClickable = true
        } = options;

        const productImage = `

                <div>
                    ${isClickable 
                        ? `<a href="/pages/productoCard.html?producto_id=${producto.producto_id}">
                            <img src="${producto.imagen}" alt="${producto.nombre}" 
                                class="object-contain w-full h-48 cursor-pointer hover:scale-105 transition-transform duration-200">
                           </a>`
                        : `<img src="${producto.imagen}" alt="${producto.nombre}" 
                            class="object-contain w-full h-48">`
                    }
                </div>
            </div>
        `;

        const productInfo = `
            <div class="mt-4">
                <h3 class="text-gray-800 font-medium text-base">
                    ${isClickable 
                        ? `<a href="/pages/productoCard.html?producto_id=${producto.producto_id}" 
                            class="hover:underline">${producto.nombre}</a>`
                        : producto.nombre
                    }
                </h3>
                <p class="uppercase text-green-600 text-xs font-medium">${producto.descripcion || ''}</p>
                <div class="flex items-baseline space-x-2 mt-2">
                    <span class="text-blue-600 text-xl font-semibold">
                        $${producto.precio?.toFixed(2)}
                    </span>
                    ${producto.precio_regular ? 
                        `<span class="text-gray-400 text-sm line-through">
                            $${producto.precio_regular.toFixed(2)}
                         </span>` 
                        : ''
                    }
                </div>
                ${showDetails ? `
                    <div class="mt-2">
                        <p class="text-gray-500">Contenido: ${producto.contenido_ml || 'N/A'} ml</p>
                        <p class="text-gray-500">Categoría: ${producto.categoria || 'N/A'}</p>
                        <p class="text-gray-500">Marca: ${producto.marca || 'N/A'}</p>
                    </div>
                ` : ''}
            </div>
        `;

        const controls = showControls ? `
            <div class="mt-4 flex justify-between items-center">
                <button onclick="agregarAlCarrito(${producto.producto_id})" 
                    class="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center shadow text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                        <path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                        <path d="M17 17h-11v-14h-2" />
                        <path d="M6 5l14 1l-1 7h-13" />
                    </svg>
                </button>
                <button onclick="agregarAFavoritos(${producto.producto_id})" 
                    class="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center shadow text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M12 21l-1-1c-5-5-8-8-8-11a5 5 0 0 1 10 0a5 5 0 0 1 10 0c0 3-3 6-8 11l-1 1z" />
                    </svg>
                </button>
            </div>
        ` : '';

        return `
            <div class="w-full border border-blue-200 rounded-lg shadow-md p-4 bg-white">
                ${productImage}
                ${productInfo}
                ${controls}
            </div>
        `;
    }
}

// Para usar en archivos JavaScript
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ProductCard;
}

