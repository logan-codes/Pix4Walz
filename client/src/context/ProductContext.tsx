
import React, { createContext, useState, useContext, ReactNode } from 'react';

export type ProductType = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
};

export const PRODUCTS: ProductType[] = [
  {
    id: "polaroid",
    name: "Classic Polaroid",
    description: "Your favorite photos in vintage polaroid style.",
    price: 9.99,
    image: "/placeholder.svg",
  },
  {
    id: "three-piece",
    name: "3 Piece Poster",
    description: "A stunning triptych print of your cherished moment.",
    price: 24.99,
    image: "/placeholder.svg",
  },
  {
    id: "a4-poster",
    name: "A4 Size Poster",
    description: "Standard A4 size poster with premium finish.",
    price: 14.99,
    image: "/placeholder.svg",
  },
];

type ProductContextType = {
  products: ProductType[];
  selectedProduct: ProductType | null;
  setSelectedProduct: (product: ProductType | null) => void;
};

const ProductContext = createContext<ProductContextType>({
  products: PRODUCTS,
  selectedProduct: null,
  setSelectedProduct: () => {},
});

export const ProductProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);

  return (
    <ProductContext.Provider
      value={{
        products: PRODUCTS,
        selectedProduct,
        setSelectedProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);
