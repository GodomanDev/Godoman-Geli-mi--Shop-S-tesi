import React, { useState } from 'react';
import { Edit2, Trash2 } from 'lucide-react';
import { useProducts } from '../contexts/ProductContext';
import ProductForm from './ProductForm';
import toast from 'react-hot-toast';
import Swal from 'sweetalert2';

const ProductList: React.FC = () => {
  const { products, deleteProduct } = useProducts();
  const [editingProduct, setEditingProduct] = useState<number | null>(null);

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: 'Ürünü silmek istediğinize emin misiniz?',
      icon: 'error',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Evet',
      cancelButtonText: 'İptal Et',
      background: '#1F2937',
      color: '#fff',
      customClass: {
        popup: 'rounded-lg border border-gray-700',
        title: 'text-xl font-bold text-white',
        htmlContainer: 'text-gray-300',
        confirmButton: 'rounded-md',
        cancelButton: 'rounded-md'
      }
    });

    if (result.isConfirmed) {
      deleteProduct(id);
      toast.success('Ürün başarıyla silindi!', {
        duration: 3000,
        position: 'top-center',
      });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2
    }).format(price);
  };

  if (editingProduct !== null) {
    const product = products.find(p => p.id === editingProduct);
    if (product) {
      return <ProductForm product={product} onClose={() => setEditingProduct(null)} />;
    }
  }

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-white">Ürün Listesi</h3>
      </div>
      <div className="border-t border-gray-700">
        <ul className="divide-y divide-gray-700">
          {products.map((product) => (
            <li key={product.id} className="px-4 py-4 sm:px-6 hover:bg-gray-700/50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-16 w-16 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="text-lg font-medium text-white">{product.name}</h4>
                    <p className="text-yellow-500 font-medium">{formatPrice(product.price)}</p>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {product.inStock ? 'Stokta' : 'Tükendi'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setEditingProduct(product.id)}
                    className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    <Edit2 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="p-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ProductList;