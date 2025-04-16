import React, { useState, useRef } from 'react';
import { useProducts } from '../contexts/ProductContext';
import { X, Upload } from 'lucide-react';
import toast from 'react-hot-toast';

interface ProductFormProps {
  product?: {
    id: number;
    name: string;
    price: number;
    image: string;
    link: string;
    inStock: boolean;
    labelText?: string;
    labelColor?: string;
  };
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, onClose }) => {
  const { addProduct, updateProduct } = useProducts();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || 0,
    image: product?.image || '',
    link: product?.link || '',
    inStock: product?.inStock ?? true,
    labelText: product?.labelText || 'Yeni Ürün',
    labelColor: product?.labelColor || '#EAB308'
  });
  const [previewImage, setPreviewImage] = useState<string | null>(product?.image || null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { 
        toast.error('Resim boyutu 5MB\'dan küçük olmalıdır!');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData({ ...formData, image: base64String });
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || (!formData.image && !formData.link) || formData.price <= 0) {
      toast.error('Başarısız! Lütfen tüm alanları doldurun.');
      return;
    }

    try {
      if (product) {
        updateProduct({ ...formData, id: product.id });
        toast.success('Başarıyla güncellendi!');
      } else {
        addProduct(formData);
        toast.success('Başarıyla eklendi!');
      }
      onClose();
    } catch (error) {
      toast.error(product ? 'Başarısız güncelleme!' : 'Başarısız ürün ekleme!');
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-white">
          {product ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
        </h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-300 transition-colors p-2 hover:bg-gray-700 rounded-lg"
        >
          <X className="h-6 w-6" />
        </button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ürün Adı
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                placeholder="Ürün adını girin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Fiyat (TL)
              </label>
              <input
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                placeholder="Fiyat girin"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Resim
              </label>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                  >
                    <Upload className="w-5 h-5 mr-2" />
                    Dosya Seç
                  </button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  placeholder="veya resim URL'si girin"
                />
                {previewImage && (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Önizleme"
                      className="w-full h-40 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewImage(null);
                        setFormData({ ...formData, image: '' });
                        if (fileInputRef.current) {
                          fileInputRef.current.value = '';
                        }
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Ürün Linki
              </label>
              <input
                type="url"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                placeholder="Ürün linkini girin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Etiket Metni
              </label>
              <input
                type="text"
                value={formData.labelText}
                onChange={(e) => setFormData({ ...formData, labelText: e.target.value })}
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                placeholder="Etiket metnini girin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Etiket Rengi
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={formData.labelColor}
                  onChange={(e) => setFormData({ ...formData, labelColor: e.target.value })}
                  className="h-10 w-20 bg-gray-700 border border-gray-600 rounded cursor-pointer"
                />
                <input
                  type="text"
                  value={formData.labelColor}
                  onChange={(e) => setFormData({ ...formData, labelColor: e.target.value })}
                  className="flex-1 px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        </div>
        <div>
  <label className="block text-sm font-medium text-gray-300 mb-2">
    Stok Durumu
  </label>
  <select
    value={formData.inStock ? 'var' : 'yok'}
    onChange={(e) =>
      setFormData({ ...formData, inStock: e.target.value === 'var' })
    }
    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-200"
  >
    <option value="var">Var</option>
    <option value="yok">Yok</option>
  </select>
</div>

        <div className="flex justify-end space-x-4 mt-8">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-3 bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 font-medium"
          >
            İptal
          </button>
          <button
            type="submit"
            className="px-6 py-3 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-all duration-200 font-medium"
          >
            {product ? 'Güncelle' : 'Ekle'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductForm;