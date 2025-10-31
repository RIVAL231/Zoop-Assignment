import { useState, useEffect } from 'react';
import { Plus, Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { productAPI, sessionAPI } from '../services/api';
import ProductForm from '../components/ProductForm';
import ProductList from '../components/ProductList';
import SessionManager from '../components/SessionManager';
import LiveSessionControl from '../components/LiveSessionControl';
import './AdminDashboard.css';

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [liveSession, setLiveSession] = useState(null);
  const [showProductForm, setShowProductForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [productsRes, sessionsRes, liveRes] = await Promise.all([
        productAPI.getAll({ isActive: true }),
        sessionAPI.getAll(),
        sessionAPI.getLive()
      ]);

      setProducts(productsRes.data.data);
      setSessions(sessionsRes.data.data);
      setLiveSession(liveRes.data.data);
    } catch (error) {
      toast.error('Failed to load data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = () => {
    setEditingProduct(null);
    setShowProductForm(true);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      await productAPI.delete(productId);
      toast.success('Product deleted successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete product');
      console.error(error);
    }
  };

  const handleProductSubmit = async (productData) => {
    try {
      if (editingProduct) {
        await productAPI.update(editingProduct._id, productData);
        toast.success('Product updated successfully');
      } else {
        await productAPI.create(productData);
        toast.success('Product created successfully');
      }
      setShowProductForm(false);
      setEditingProduct(null);
      fetchData();
    } catch (error) {
      toast.error(editingProduct ? 'Failed to update product' : 'Failed to create product');
      console.error(error);
    }
  };

  const handleSessionCreated = () => {
    fetchData();
  };

  const handleSessionStatusChange = (session) => {
    if (session.status === 'live') {
      setLiveSession(session);
    } else if (session.status === 'ended') {
      setLiveSession(null);
    }
    fetchData();
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container admin-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p className="text-muted">Manage products and live sessions</p>
        </div>
      </div>

      {liveSession && (
        <div className="live-session-alert">
          <LiveSessionControl 
            session={liveSession} 
            onSessionUpdate={handleSessionStatusChange}
          />
        </div>
      )}

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          <Package size={18} />
          Products
        </button>
        <button
          className={`tab ${activeTab === 'sessions' ? 'active' : ''}`}
          onClick={() => setActiveTab('sessions')}
        >
          <Plus size={18} />
          Sessions
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'products' && (
          <div className="fade-in">
            <div className="section-header">
              <h2>Products</h2>
              <button className="btn btn-primary" onClick={handleCreateProduct}>
                <Plus size={18} />
                Add Product
              </button>
            </div>

            {showProductForm && (
              <div className="modal-overlay" onClick={() => setShowProductForm(false)}>
                <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                  <ProductForm
                    product={editingProduct}
                    onSubmit={handleProductSubmit}
                    onCancel={() => {
                      setShowProductForm(false);
                      setEditingProduct(null);
                    }}
                  />
                </div>
              </div>
            )}

            <ProductList
              products={products}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
            />
          </div>
        )}

        {activeTab === 'sessions' && (
          <div className="fade-in">
            <SessionManager
              products={products}
              sessions={sessions}
              onSessionCreated={handleSessionCreated}
              onSessionStatusChange={handleSessionStatusChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
