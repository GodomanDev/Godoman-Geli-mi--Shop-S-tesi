import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Shop from './components/Shop';
import AdminLogin from './components/AdminLogin';
import AdminPanel from './components/AdminPanel';
import BannedPage from './components/BannedPage';
import { ProductProvider } from './contexts/ProductContext';
import { VisitorProvider, useVisitors } from './contexts/VisitorContext';
import { AdminProvider } from './contexts/AdminContext';

const ProtectedShop = () => {
  const { isIpBanned } = useVisitors();
  const [loading, setLoading] = React.useState(true);
  const [isBanned, setIsBanned] = React.useState(false);

  React.useEffect(() => {
    const checkIp = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setIsBanned(isIpBanned(data.ip));
      } catch (error) {
        console.error('Error checking IP:', error);
      } finally {
        setLoading(false);
      }
    };

    checkIp();
  }, [isIpBanned]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return isBanned ? <BannedPage /> : <Shop />;
};

function App() {
  return (
    <AdminProvider>
      <ProductProvider>
        <VisitorProvider>
          <Router>
            <Toaster
              position="top-center"
              toastOptions={{
                duration: 3000,
                style: {
                  background: '#1F2937',
                  color: '#fff',
                  border: '1px solid #374151',
                },
                success: {
                  iconTheme: {
                    primary: '#10B981',
                    secondary: '#fff',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#EF4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
            <Routes>
              <Route path="/" element={<ProtectedShop />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin/*" element={<AdminPanel />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </VisitorProvider>
      </ProductProvider>
    </AdminProvider>
  );
}

export default App;