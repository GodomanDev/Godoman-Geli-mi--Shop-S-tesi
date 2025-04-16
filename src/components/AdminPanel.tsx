import React, { useState, useEffect } from 'react';
import { useNavigate, Routes, Route } from 'react-router-dom';
import { Package, PlusCircle, LogOut, Users, Shield } from 'lucide-react';
import ProductList from './ProductList';
import ProductForm from './ProductForm';
import VisitorList from './VisitorList';
import AdminList from './AdminList';
import toast from 'react-hot-toast';

const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showVisitors, setShowVisitors] = useState(false);
  const [showAdmins, setShowAdmins] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/admin/login');
    toast.success('Çıkış yapıldı!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-yellow-500" />
              <span className="ml-2 text-xl font-bold text-white">Admin Panel</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => {
                  setShowVisitors(false);
                  setShowAdmins(false);
                  setShowAddProduct(!showAddProduct);
                }}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                <PlusCircle className="h-5 w-5 mr-2" />
                Ürün Ekle
              </button>
              <button
                onClick={() => {
                  setShowAddProduct(false);
                  setShowAdmins(false);
                  setShowVisitors(!showVisitors);
                }}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Users className="h-5 w-5 mr-2" />
                Ziyaretçiler
              </button>
              <button
                onClick={() => {
                  setShowAddProduct(false);
                  setShowVisitors(false);
                  setShowAdmins(!showAdmins);
                }}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-md hover:bg-purple-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              >
                <Shield className="h-5 w-5 mr-2" />
                Adminler
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Çıkış Yap
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showAddProduct ? (
          <ProductForm onClose={() => setShowAddProduct(false)} />
        ) : showVisitors ? (
          <VisitorList />
        ) : showAdmins ? (
          <AdminList />
        ) : (
          <ProductList />
        )}
      </div>
    </div>
  );
};

export default AdminPanel;