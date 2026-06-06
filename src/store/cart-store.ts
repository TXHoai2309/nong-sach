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

  // Modal states
  activeProductForModal: Product | null;
  defaultQuantityForModal: number;
  isOptionsModalOpen: boolean;
  openOptionsModal: (product: Product, defaultQuantity?: number) => void;
  closeOptionsModal: () => void;

  // Toast states
  addedItemForToast: CartItem | null;
  isAddedToastOpen: boolean;
  openAddedToast: (item: CartItem) => void;
  closeAddedToast: () => void;

  // Action to add with options
  addToCartWithOptions: (product: Product, quantity: number, weight: "500g" | "1kg" | "2kg") => void;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  // Legacy/compatibility fallback
  addToCart: (product: Product) => {
    // Parse weight from product ID if it exists (e.g. from reorder list)
    let weight: "500g" | "1kg" | "2kg" = "1kg";
    let baseId = product.id;
    if (product.id.endsWith("-500g")) {
      weight = "500g";
      baseId = product.id.replace("-500g", "");
    } else if (product.id.endsWith("-2kg")) {
      weight = "2kg";
      baseId = product.id.replace("-2kg", "");
    } else if (product.id.endsWith("-1kg")) {
      weight = "1kg";
      baseId = product.id.replace("-1kg", "");
    }

    let priceFactor = 1.0;
    if (weight === "500g") priceFactor = 0.5;
    else if (weight === "2kg") priceFactor = 2.0;

    const baseProduct: Product = {
      ...product,
      id: baseId,
      price: product.price / priceFactor,
    };

    get().addToCartWithOptions(baseProduct, 1, weight);
  },

  addToCartWithOptions: (product: Product, quantity: number, weight: "500g" | "1kg" | "2kg") => {
    if (product.stock <= 0) return;

    set((state) => {
      const targetId = `${product.id}-${weight}`;
      const suffix = ` (${weight})`;
      const displayName = product.name.endsWith(suffix) ? product.name : `${product.name}${suffix}`;

      let priceFactor = 1.0;
      if (weight === "500g") priceFactor = 0.5;
      else if (weight === "2kg") priceFactor = 2.0;
      const adjustedPrice = Math.round(product.price * priceFactor);

      const existingItem = state.items.find((item) => item.productId === targetId);

      if (existingItem) {
        const nextQty = Math.min(product.stock, existingItem.quantity + quantity);
        const updatedItems = state.items.map((item) =>
          item.productId === targetId
            ? { ...item, quantity: nextQty }
            : item
        );
        const updatedItem = updatedItems.find((item) => item.productId === targetId);
        if (updatedItem) {
          // Defer triggering the toast state to ensure state updates commit first
          setTimeout(() => {
            get().openAddedToast(updatedItem);
          }, 0);
        }
        return { items: updatedItems };
      }

      const newItem: CartItem = {
        productId: targetId,
        name: displayName,
        price: adjustedPrice,
        image: product.image,
        quantity: quantity,
        stock: product.stock,
        sellerId: product.sellerId,
        shopName: product.shopName,
      };

      setTimeout(() => {
        get().openAddedToast(newItem);
      }, 0);

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

  // Modal control
  activeProductForModal: null,
  defaultQuantityForModal: 1,
  isOptionsModalOpen: false,
  openOptionsModal: (product: Product, defaultQuantity = 1) => {
    set({
      activeProductForModal: product,
      defaultQuantityForModal: defaultQuantity,
      isOptionsModalOpen: true,
    });
  },
  closeOptionsModal: () => {
    set({
      activeProductForModal: null,
      isOptionsModalOpen: false,
    });
  },

  // Toast control
  addedItemForToast: null,
  isAddedToastOpen: false,
  openAddedToast: (item: CartItem) => {
    set({
      addedItemForToast: item,
      isAddedToastOpen: true,
    });
  },
  closeAddedToast: () => {
    set({
      addedItemForToast: null,
      isAddedToastOpen: false,
    });
  },
}));
