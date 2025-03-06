import React from 'react';
const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105">
      <img 
        src={product.image} 
        alt={product.name} 
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-800">{product.name}</h3>
        <p className="text-gray-600 mt-1">${product.price.toFixed(2)}</p>
        <div className="mt-4 flex justify-between items-center">
          <button 
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
            onClick={() => product.onAddToCart(product.id)}
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