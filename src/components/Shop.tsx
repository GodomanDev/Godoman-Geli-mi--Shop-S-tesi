import React, { useState, useEffect } from 'react';
import { Gamepad2, ShieldCheck, Users, X } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { useProducts } from '../contexts/ProductContext';
import { useVisitors } from '../contexts/VisitorContext';

function Shop() {
  const { products } = useProducts();
  const { visitorCount, addVisitor } = useVisitors();
  const [showNotification, setShowNotification] = useState(true);

  useEffect(() => {
    const getVisitorIP = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        addVisitor(data.ip);
      } catch (error) {
        console.error('Error fetching IP:', error);
        addVisitor(Date.now().toString());
      }
    };

    getVisitorIP();
  }, [addVisitor]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2
    }).format(price);
  };

  const handlePurchase = (e: React.MouseEvent<HTMLAnchorElement>, inStock: boolean) => {
    e.preventDefault();

    if (!inStock) {
      toast.error('Üzgünüz, bu ürün şu anda stokta yok!', {
        duration: 3000,
        position: 'top-center',
      });
      return;
    }

    toast.success('Satın Alınacak Yere Yönlendiriliyorsunuz', {
      duration: 3000,
      position: 'top-center',
    });

    setTimeout(() => {
      window.location.href = e.currentTarget.href;
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
      <Toaster />

      {showNotification && (
  <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md">
    <div className="relative bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 mx-4 text-center">
      {/* X Butonu Sağ Üstte */}
      <button
        onClick={() => setShowNotification(false)}
        className="absolute top-2 right-2 text-gray-400 hover:text-gray-300 transition-colors"
      >
        <X className="w-5 h-5" />
      </button>
      <div className="text-9xl mb-4">⚠️</div>
      <p className="text-gray-300 mb-4">
        Hala Discord sunucumuza gelmediyseniz sizi bekliyoruz!
      </p>
      <div className="flex justify-center">
        <a
          href="https://discord.gg/gp79f5Cu"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          Discord'a Git
        </a>
      </div>
    </div>
  </div>
)}


      <nav className="bg-gradient-to-r from-gray-900 to-gray-800 shadow-xl border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <img
                src="https://images.unsplash.com/photo-1616763355548-1b606f439f86?auto=format&fit=crop&w=200&h=200&q=80"
                alt="Godoman Logo"
                className="w-12 h-12 rounded-full object-cover border-2 border-gray-600 hover:border-gray-400 transition-colors"
              />
            </div>
            <div className="flex items-center">
              <h1 className="text-3xl font-bold text-white hover:text-white-400 transition-colors duration-300">
                Godoman Shop
              </h1>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6 hover:text-blue-400 transition-colors duration-300 cursor-pointer">
            Godoman Shop
          </h1>
          <div className="flex items-center justify-center space-x-2 text-xl text-gray-300 mb-4">
            <ShieldCheck className="w-6 h-6 text-green-500" />
            <p className="hover:text-blue-400 transition-colors duration-300">
              Buradan güvenli şekilde alışveriş yapabilirsiniz
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group relative bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_0_40px_rgba(234,179,8,0.3)] transition-all duration-500 transform hover:-translate-y-2"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-t ${product.inStock ? 'from-yellow-500/30' : 'from-red-500/30'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 glow-effect`}
              />
              <div className="relative">
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <img
                  src={product.image}
                  alt={product.name}
                  className={`w-full h-48 object-cover transform transition-transform duration-500 ${product.inStock ? 'group-hover:scale-110' : 'grayscale group-hover:scale-105'}`}
                />
                <div
                  className="absolute top-0 left-0 m-3 px-3 py-1 rounded-full shadow-md text-xs font-bold uppercase tracking-wide z-10"
                  style={{
                    backgroundColor: product.labelColor || (product.inStock ? '#EAB308' : '#EF4444'),
                    color: '#1F2937',
                  }}
                >
                  {product.labelText || (product.inStock ? 'Yeni Ürün' : 'Tükendi')}
                </div>
              </div>
              <div className="relative p-6">
                <div
                  className={`bg-gradient-to-br from-gray-800/80 via-gray-900/80 to-gray-800/80 backdrop-blur-sm rounded-xl p-4 transition-shadow duration-500 ${product.inStock ? 'group-hover:shadow-[0_0_20px_rgba(234,179,8,0.2)]' : 'group-hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]'}`}
                >
                  <h3
                    className={`text-xl font-bold mb-3 transition-colors ${product.inStock ? 'text-white group-hover:text-yellow-400' : 'text-gray-400 group-hover:text-red-400'}`}
                  >
                    {product.name}
                  </h3>
                  <div className="flex items-center justify-between mb-4">
                    <p
                      className={`text-2xl font-bold transition-colors ${product.inStock ? 'text-blue-400 group-hover:text-yellow-300' : 'text-gray-500 group-hover:text-red-300'}`}
                    >
                      {formatPrice(product.price)}
                    </p>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${product.inStock ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}
                    >
                      {product.inStock ? 'Stokta' : 'Tükendi'}
                    </div>
                  </div>
                  <a
                    href={product.link}
                    onClick={(e) => handlePurchase(e, product.inStock)}
                    className={`block w-full text-center py-3 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg ${product.inStock ? 'bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-500 hover:to-green-400 hover:shadow-green-500/25' : 'bg-gradient-to-r from-gray-600 to-gray-500 text-gray-300 hover:from-gray-500 hover:to-gray-400 hover:shadow-gray-500/25 cursor-not-allowed'}`}
                  >
                    {product.inStock ? 'Satın Al' : 'Stokta Yok'}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="bg-gradient-to-r from-gray-900 to-gray-800 border-t border-gray-700 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 group">
              <Gamepad2 className="w-8 h-8 text-yellow-500 group-hover:text-yellow-400 transition-colors" />
              <span className="text-xl font-bold text-gray-400 group-hover:text-yellow-400 transition-colors">Godoman</span>
            </div>
            <div className="flex items-center space-x-2 group bg-gray-800/50 px-4 py-2 rounded-full">
              <Users className="w-6 h-6 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <span className="text-lg font-bold text-gray-300">
                Tekil Ziyaretçi Sayısı: 
                <span className="text-blue-400 ml-2 group-hover:text-blue-300 transition-colors">
                  {visitorCount}
                </span>
              </span>
            </div>
            <div className="text-xl font-bold text-gray-400 hover:text-yellow-400 transition-colors cursor-pointer">
              Godoman Shop
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Shop;
