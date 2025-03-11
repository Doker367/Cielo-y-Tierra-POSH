import React from 'react';
const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
      <div className="relative">
        <span className="absolute top-2 left-2 bg-orange-400 text-white text-xs font-semibold px-2 py-1 rounded-full">
          -{product.descuento}%
        </span>
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-48 object-cover"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
        <div className="flex items-baseline space-x-2 mt-2">
          <span className="text-blue-600 text-xl font-semibold">
            ${product.precio_descuento.toFixed(2)}
          </span>
          <span className="text-gray-400 text-sm line-through">
            ${product.price.toFixed(2)}
          </span>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <button 
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            onClick={() => product.onAddToCart?.(product.id)}
          >
            Agregar al carrito
          </button>
          {product.stock > 0 ? (
            <span className="text-green-500">En stock</span>
          ) : (
            <span className="text-red-500">Agotado</span>
          )}
        </div>
      </div>
    </div>
  );
};
export default ProductCard;