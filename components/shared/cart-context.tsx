'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type { Image, Money, Universe } from '@/lib/shopify/types';
import { refreshCartPrices, startCheckout } from '@/lib/actions';

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
  checkoutError: string | null;
  checkingOut: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (line: Omit<LocalCartLine, 'quantity'>, quantity?: number) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  removeItem: (variantId: string) => void;
  clear: () => void;
  /** Re-read every line's price from Shopify (cart/checkout entry points). */
  refreshPrices: () => Promise<void>;
  checkout: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = 'qavier-cart-v1';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<LocalCartLine[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [checkingOut, setCheckingOut] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // Latest lines, readable from callbacks without re-creating them.
  const linesRef = useRef<LocalCartLine[]>([]);
  linesRef.current = lines;

  /**
   * Re-price the bag against Shopify. Stored lines carry the price they had
   * when they were added, so without this a price change in the Shopify admin
   * would never reach a shopper with an existing cart — and the bag total would
   * disagree with the Shopify checkout they're sent to.
   */
  const syncPrices = useCallback(async (target?: LocalCartLine[]) => {
    const current = target ?? linesRef.current;
    const ids = Array.from(new Set(current.map((l) => l.variantId)));
    if (!ids.length) return;

    const fresh = await refreshCartPrices(ids);
    if (!Object.keys(fresh).length) return; // offline / not configured — keep the snapshot

    setLines((prev) => {
      let changed = false;
      const next = prev.map((line) => {
        const update = fresh[line.variantId];
        if (
          !update ||
          (update.price.amount === line.price.amount &&
            update.price.currencyCode === line.price.currencyCode)
        ) {
          return line;
        }
        changed = true;
        return { ...line, price: update.price };
      });
      return changed ? next : prev;
    });
  }, []);

  // Hydrate from localStorage once on mount, then re-price against Shopify.
  useEffect(() => {
    let stored: LocalCartLine[] = [];
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) stored = JSON.parse(raw);
    } catch {
      /* ignore corrupt storage */
    }
    if (stored.length) setLines(stored);
    setHydrated(true);
    void syncPrices(stored);
  }, [syncPrices]);

  // Whenever the bag is opened, confirm its prices are still the Shopify ones.
  useEffect(() => {
    if (isOpen) void syncPrices();
  }, [isOpen, syncPrices]);

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

  // Stable identity — callers put this in effect dependency arrays.
  const refreshPrices = useCallback(() => syncPrices(), [syncPrices]);

  const checkout = useCallback(async () => {
    if (!lines.length) return;
    setCheckingOut(true);
    setCheckoutError(null);
    try {
      const result = await startCheckout(
        lines.map((l) => ({ merchandiseId: l.variantId, quantity: l.quantity })),
      );
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
        return;
      }
      setCheckoutError(result.error ?? 'Checkout failed. Please try again.');
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
    checkoutError,
    checkingOut,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem,
    updateQuantity,
    removeItem,
    clear,
    refreshPrices,
    checkout,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}
