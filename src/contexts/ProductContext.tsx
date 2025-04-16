import React, { createContext, useContext, useState, useEffect } from 'react';

export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  link: string;
  inStock: boolean;
  labelText?: string;
  labelColor?: string;
};

type ProductContextType = {
  products: Product[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (id: number) => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    const savedProducts = localStorage.getItem('products');
    return savedProducts ? JSON.parse(savedProducts) : [
      {
        id: 1,
        name: "Gaming Headset Pro",
        price: 3999.99,
        image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?auto=format&fit=crop&w=500&q=80",
        link: "https://example.com/product1",
        inStock: true,
        labelText: "Yeni Ürün",
        labelColor: "#EAB308"
      },
      {
        id: 2,
        name: "Mechanical Keyboard",
        price: 4899.99,
        image: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?auto=format&fit=crop&w=500&q=80",
        link: "https://example.com/product2",
        inStock: false,
        labelText: "Tükendi",
        labelColor: "#EF4444"
      },
      {
        id: 3,
        name: "Gaming Mouse",
        price: 2499.99,
        image: "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?auto=format&fit=crop&w=500&q=80",
        link: "https://example.com/product3",
        inStock: true,
        labelText: "Yeni Ürün",
        labelColor: "#EAB308"
      },
      {
        id: 4,
        name: "Gaming Monitor",
        price: 8999.99,
        image: "https://images.unsplash.com/photo-1616763355603-9755a640a287?auto=format&fit=crop&w=500&q=80",
        link: "https://example.com/product4",
        inStock: true,
        labelText: "Yeni Ürün",
        labelColor: "#EAB308"
      },
      {
        id: 5,
        name: "Gaming Chair",
        price: 7499.99,
        image: "https://images.unsplash.com/photo-1610395219791-21b0353e43cb?auto=format&fit=crop&w=500&q=80",
        link: "https://example.com/product5",
        inStock: false,
        labelText: "Tükendi",
        labelColor: "#EF4444"
      },
      {
        id: 6,
        name: "Gaming Console",
        price: 14999.99,
        image: "https://images.unsplash.com/photo-1605901309584-818e25960a8f?auto=format&fit=crop&w=500&q=80",
        link: "https://example.com/product6",
        inStock: true,
        labelText: "Yeni Ürün",
        labelColor: "#EAB308"
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem('products', JSON.stringify(products));
  }, [products]);

  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = {
      ...product,
      id: Math.max(...products.map(p => p.id), 0) + 1
    };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(products.map(product => 
      product.id === updatedProduct.id ? updatedProduct : product
    ));
  };

  const deleteProduct = (id: number) => {
    setProducts(products.filter(product => product.id !== id));
  };

  return (
    <ProductContext.Provider value={{ products, addProduct, updateProduct, deleteProduct }}>
      {children}
    </ProductContext.Provider>
  );
};