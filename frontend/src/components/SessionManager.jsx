import { useState } from 'react';
import { Plus } from 'lucide-react';
import toast from 'react-hot-toast';
import { sessionAPI } from '../services/api';
import SessionList from './SessionList';
import './SessionManager.css';

function SessionManager({ products, sessions, onSessionCreated, onSessionStatusChange }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    products: []
  });
  const [showForm, setShowForm] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleProductSelection = (productId) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.includes(productId)
        ? prev.products.filter(id => id !== productId)
        : [...prev.products, productId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      toast.error('Please fill all required fields');
      return;
    }

    if (formData.products.length === 0) {
      toast.error('Please select at least one product');
      return;
    }

    try {
      await sessionAPI.create(formData);
      toast.success('Session created successfully');
      setFormData({ title: '', description: '', products: [] });
      setShowForm(false);
      onSessionCreated();
    } catch (error) {
      toast.error('Failed to create session');
      console.error(error);
    }
  };

  return (
    <div className="session-manager">
      <div className="section-header">
        <h2>Live Sessions</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} />
          {showForm ? 'Cancel' : 'Create Session'}
        </button>
      </div>

      {showForm && (
        <div className="card session-form">
          <h3>Create New Session</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">Session Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Summer Sale Event"
                maxLength={200}
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your live session..."
                rows={3}
                maxLength={500}
              />
            </div>

            <div className="form-group">
              <label>Select Products *</label>
              <div className="product-selector">
                {products.length === 0 ? (
                  <p className="text-muted">No products available. Create products first.</p>
                ) : (
                  products.map(product => (
                    <label key={product._id} className="product-option">
                      <input
                        type="checkbox"
                        checked={formData.products.includes(product._id)}
                        onChange={() => handleProductSelection(product._id)}
                      />
                      <div className="product-option-content">
                        <img 
                          src={product.imageUrl || 'https://via.placeholder.com/60'} 
                          alt={product.name}
                        />
                        <div>
                          <strong>{product.name}</strong>
                          <span>${product.price.toFixed(2)}</span>
                        </div>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={products.length === 0}>
              Create Session
            </button>
          </form>
        </div>
      )}

      <SessionList 
        sessions={sessions} 
        onSessionStatusChange={onSessionStatusChange}
      />
    </div>
  );
}

export default SessionManager;
