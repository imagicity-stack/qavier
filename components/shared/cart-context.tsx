'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import type { Image, Money, Universe } from '@/lib/shopify/types';
import { startCheckout } from '@/lib/actions';

export interface LocalCartLine {
  variantId: string;
  productHandle: string;
  productTitle: string;
  variantTitle: string;
  price: Money;
  image: Image;
  universe: Universe;
  quantity: number;
}

interface CartContextValue {
  lines: LocalCartLine[];
  totalQuantity: number;
  subtotal: number;
  currencyCode: string;
  isOpen: boolean;
  isDemo: boolean | null;
  checkingOut: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (line: Omit<LocalCartLine, 'quantity'>, quantity?: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clear: () => void;
  checkout: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'qavier-cart-v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<LocalCartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isDemo, setIsDemo] = useState<boolean | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage once on mount.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  // Persist whenever the cart changes (after hydration).
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* storage may be unavailable (private mode) */
    }
  }, [lines, hydrated]);

  const addItem = useCallback(
    (line: Omit<LocalCartLine, 'quantity'>, quantity = 1) => {
      setLines((prev) => {
        const existing = prev.find((l) => l.variantId === line.variantId);
        if (existing) {
          return prev.map((l) =>
            l.variantId === line.variantId
              ? { ...l, quantity: l.quantity + quantity }
              : l,
          );
        }
        return [...prev, { ...line, quantity }];
      });
      setIsOpen(true);
    },
    [],
  );

  const updateQuantity = useCallback((variantId: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.variantId !== variantId)
        : prev.map((l) => (l.variantId === variantId ? { ...l, quantity } : l)),
    );
  }, []);

  const removeItem = useCallback((variantId: string) => {
    setLines((prev) => prev.filter((l) => l.variantId !== variantId));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const checkout = useCallback(async () => {
    if (!lines.length) return;
    setCheckingOut(true);
    try {
      const result = await startCheckout(
        lines.map((l) => ({ merchandiseId: l.variantId, quantity: l.quantity })),
      );
      if (result.demo) {
        setIsDemo(true);
        return;
      }
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }
      if (result.error) {
        setIsDemo(true); // surface the demo notice as a graceful fallback
      }
    } finally {
      setCheckingOut(false);
    }
  }, [lines]);

  const totalQuantity = useMemo(
    () => lines.reduce((sum, l) => sum + l.quantity, 0),
    [lines],
  );
  const subtotal = useMemo(
    () => lines.reduce((sum, l) => sum + Number(l.price.amount) * l.quantity, 0),
    [lines],
  );
  const currencyCode = lines[0]?.price.currencyCode ?? 'INR';

  const value: CartContextValue = {
    lines,
    totalQuantity,
    subtotal,
    currencyCode,
    isOpen,
    isDemo,
    checkingOut,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem,
    updateQuantity,
    removeItem,
    clear,
    checkout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
