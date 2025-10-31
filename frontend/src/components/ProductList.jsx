import { Edit, Trash2, DollarSign, Package } from 'lucide-react';
import './ProductList.css';

function ProductList({ products, onEdit, onDelete }) {
  if (!products || products.length === 0) {
    return (
      <div className="empty-state">
        <Package size={48} className="text-muted" />
        <p>No products yet. Create your first product!</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      {products.map(product => (
        <div key={product._id} className="product-card">
          <div className="product-image">
            <img 
              src={product.imageUrl || 'https://via.placeholder.com/400x300?text=Product'} 
              alt={product.name}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/400x300?text=Product';
              }}
            />
            <span className={`badge ${product.isActive ? 'badge-success' : 'badge-danger'}`}>
              {product.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div className="product-details">
            <div className="product-header">
              <h3>{product.name}</h3>
              <span className="badge badge-primary">{product.category}</span>
            </div>
            
            <p className="product-description">{product.description}</p>

            <div className="product-meta">
              <div className="meta-item">
                <DollarSign size={16} />
                <span className="price">${product.price.toFixed(2)}</span>
              </div>
              <div className="meta-item">
                <Package size={16} />
                <span>Stock: {product.stock}</span>
              </div>
            </div>

            <div className="product-actions">
              <button 
                className="btn btn-outline" 
                onClick={() => onEdit(product)}
              >
                <Edit size={16} />
                Edit
              </button>
              <button 
                className="btn btn-danger" 
                onClick={() => onDelete(product._id)}
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
