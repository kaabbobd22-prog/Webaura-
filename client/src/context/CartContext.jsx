import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('wm_cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('wm_cart', JSON.stringify(items));
  }, [items]);

  const value = useMemo(() => ({
    items,
    addItem: (product) => {
      setItems((current) => {
        if (current.find((item) => item._id === product._id)) return current;
        return [...current, product];
      });
    },
    removeItem: (id) => setItems((current) => current.filter((item) => item._id !== id)),
    clearCart: () => setItems([]),
    subtotal: items.reduce((sum, item) => sum + Number(item.price || 0), 0)
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}
