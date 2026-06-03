import { create } from "zustand";
import { CartItem } from "@/types/cart";
import { Product } from "@/types/product";

interface CartState {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  increaseQuantity: (productId: string) => void;
  decreaseQuantity: (productId: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addToCart: (product: Product) => {
    if (product.stock <= 0) return;

    set((state) => {
      const existingItem = state.items.find((item) => item.productId === product.id);

      if (existingItem) {
        if (existingItem.quantity >= product.stock) {
          return state;
        }
        return {
          items: state.items.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }

      const newItem: CartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: 1,
        stock: product.stock,
      };

      return { items: [...state.items, newItem] };
    });
  },

  removeFromCart: (productId: string) => {
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    }));
  },

  increaseQuantity: (productId: string) => {
    set((state) => {
      const item = state.items.find((i) => i.productId === productId);
      if (!item || item.quantity >= item.stock) return state;

      return {
        items: state.items.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity + 1 } : i
        ),
      };
    });
  },

  decreaseQuantity: (productId: string) => {
    set((state) => {
      const item = state.items.find((i) => i.productId === productId);
      if (!item) return state;

      if (item.quantity <= 1) {
        return {
          items: state.items.filter((i) => i.productId !== productId),
        };
      }

      return {
        items: state.items.map((i) =>
          i.productId === productId ? { ...i, quantity: i.quantity - 1 } : i
        ),
      };
    });
  },

  clearCart: () => set({ items: [] }),

  getTotalItems: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },

  getTotalPrice: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },
}));
