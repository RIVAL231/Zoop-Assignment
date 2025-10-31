import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import './ProductShowcase.css';

function ProductShowcase({ products, highlightedProduct }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextProduct = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const prevProduct = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  if (!products || products.length === 0) {
    return (
      <div className="product-showcase card">
        <p className="text-muted">No products in this session</p>
      </div>
    );
  }

  const currentProduct = highlightedProduct || products[currentIndex];

  return (
    <div className={`product-showcase card ${highlightedProduct ? 'highlighted' : ''}`}>
      {highlightedProduct && (
        <div className="spotlight-badge">
          <Star size={16} />
          SPOTLIGHT
        </div>
      )}

      <div className="showcase-image">
        <img 
          src={currentProduct.imageUrl || 'https://via.placeholder.com/800x600?text=Product'} 
          alt={currentProduct.name}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/800x600?text=Product';
          }}
        />
      </div>

      <div className="showcase-details">
        <div className="showcase-header">
          <div>
            <span className="badge badge-primary">{currentProduct.category}</span>
            <h2>{currentProduct.name}</h2>
            <p>{currentProduct.description}</p>
          </div>
          <div className="showcase-price">
            <span className="price-label">Price</span>
            <span className="price">${currentProduct.price.toFixed(2)}</span>
          </div>
        </div>

        <div className="showcase-meta">
          <div className="stock-info">
            <span className={currentProduct.stock > 0 ? 'in-stock' : 'out-of-stock'}>
              {currentProduct.stock > 0 ? `${currentProduct.stock} in stock` : 'Out of stock'}
            </span>
          </div>
        </div>
      </div>

      {!highlightedProduct && products.length > 1 && (
        <div className="showcase-controls">
          <button className="nav-btn" onClick={prevProduct}>
            <ChevronLeft size={24} />
          </button>
          
          <div className="product-dots">
            {products.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''}`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>

          <button className="nav-btn" onClick={nextProduct}>
            <ChevronRight size={24} />
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductShowcase;
