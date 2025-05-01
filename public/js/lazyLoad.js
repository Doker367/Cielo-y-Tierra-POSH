// Eliminado el script de lazy loading para que todo cargue de forma estática
document.addEventListener('DOMContentLoaded', function() {
  const lazyImages = document.querySelectorAll('img[loading="lazy"]');

  lazyImages.forEach(img => {
    img.classList.add('loaded');
  });
});