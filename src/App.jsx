import { useState } from "react";
import axios from "axios";
import {
  ShoppingCart,
  Search,
  MapPin,
  Star,
  Clock3,
  CheckCircle,
  Tag,
  Plus,
  Minus,
  Trash2,
} from "lucide-react";

const menuItems = [
  {
    id: 1,
    name: "Margherita Pizza",
    price: 299,
    rating: 4.5,
    time: "25 mins",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Farmhouse Pizza",
    price: 399,
    rating: 4.7,
    time: "30 mins",
    image:
      "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Veg Burger",
    price: 199,
    rating: 4.4,
    time: "20 mins",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Cold Coffee",
    price: 149,
    rating: 4.8,
    time: "10 mins",
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "French Fries",
    price: 129,
    rating: 4.2,
    time: "15 mins",
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=600&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Chocolate Shake",
    price: 179,
    rating: 4.9,
    time: "12 mins",
    image:
      "https://images.unsplash.com/photo-1577805947697-89e18249d767?q=80&w=600&auto=format&fit=crop",
  },
];

// ── Veg indicator dot ──────────────────────────────────────────────
function VegDot() {
  return (
    <span className="inline-flex items-center justify-center w-3.5 h-3.5 border-2 border-green-600 rounded-sm">
      <span className="w-1.5 h-1.5 bg-green-600 rounded-full" />
    </span>
  );
}

// ── Single menu card ───────────────────────────────────────────────
function MenuCard({ item, qty, onAdd, onDecrease }) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 overflow-visible shadow-sm hover:shadow-lg transition-all duration-200 group cursor-pointer">
      {/* Image */}
      <div className="relative rounded-t-2xl overflow-hidden h-44">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* ADD / QTY button floating on image bottom */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-10">
          {qty === 0 ? (
            <button
              onClick={() => onAdd(item)}
              className="bg-white border-2 border-green-600 text-green-600 font-black text-sm tracking-widest px-7 py-1.5 rounded-lg shadow-md hover:bg-green-600 hover:text-white transition-all duration-150"
            >
              ADD
            </button>
          ) : (
            <div className="flex items-center bg-white border-2 border-green-600 rounded-lg overflow-hidden shadow-md">
              <button
                onClick={() => onDecrease(item.id)}
                className="text-green-600 font-black text-lg px-3 py-1 hover:bg-green-600 hover:text-white transition-colors leading-none"
              >
                −
              </button>
              <span className="text-green-600 font-black text-sm min-w-[24px] text-center">
                {qty}
              </span>
              <button
                onClick={() => onAdd(item)}
                className="text-green-600 font-black text-lg px-3 py-1 hover:bg-green-600 hover:text-white transition-colors leading-none"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Card body */}
      <div className="pt-7 pb-4 px-3">
        <div className="flex items-center gap-1.5 mb-1.5">
          <VegDot />
          <span className="text-[11px] text-zinc-400">Veg</span>
        </div>

        <h3 className="font-bold text-[15px] text-zinc-900 leading-snug mb-2">
          {item.name}
        </h3>

        <hr className="border-dashed border-zinc-200 mb-2" />

        <div className="flex items-center justify-between">
          <span className="font-black text-[16px] text-zinc-900">
            ₹{item.price}
          </span>
          <div className="flex items-center gap-1 bg-green-600 text-white text-[11px] font-bold px-2 py-0.5 rounded-md">
            <Star size={9} fill="white" />
            {item.rating}
          </div>
        </div>

        <div className="flex items-center gap-1 mt-1.5 text-[12px] text-zinc-400">
          <Clock3 size={12} />
          {item.time}
        </div>
      </div>
    </div>
  );
}

// ── Cart item row ──────────────────────────────────────────────────
function CartItem({ item, onAdd, onDecrease, onRemove }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-100 last:border-none">
      <img
        src={item.image}
        alt={item.name}
        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[13px] text-zinc-900 leading-snug truncate">
          {item.name}
        </p>
        <p className="text-[12px] text-zinc-400 mt-0.5">
          ₹{item.price} × {item.quantity}
        </p>
      </div>

      {/* Qty stepper */}
      <div className="flex items-center border-2 border-green-600 rounded-lg overflow-hidden">
        <button
          onClick={() => onDecrease(item.id)}
          className="text-green-600 font-black text-base px-2 py-0.5 hover:bg-green-600 hover:text-white transition-colors leading-none"
        >
          −
        </button>
        <span className="text-green-600 font-black text-[13px] min-w-[20px] text-center">
          {item.quantity}
        </span>
        <button
          onClick={() => onAdd(item)}
          className="text-green-600 font-black text-base px-2 py-0.5 hover:bg-green-600 hover:text-white transition-colors leading-none"
        >
          +
        </button>
      </div>

      <div className="font-black text-[14px] text-zinc-900 min-w-[44px] text-right">
        ₹{item.price * item.quantity}
      </div>

      <button
        onClick={() => onRemove(item.id)}
        className="text-zinc-300 hover:text-red-400 transition-colors ml-1"
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

// ── Main App ───────────────────────────────────────────────────────
export default function App() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const getQty = (id) => {
    const item = cart.find((c) => c.id === id);
    return item ? item.quantity : 0;
  };

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((c) => (c.id === id ? { ...c, quantity: c.quantity - 1 } : c))
        .filter((c) => c.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((c) => c.id !== id));
  };

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + tax;
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);

  const placeOrder = async () => {
    if (cart.length === 0) return;
    try {
      setLoading(true);
      await axios.post(
        "https://restaurant-pos-backend-816k.onrender.com/api/orders",
        { items: cart, total }
      );
      setCart([]);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3500);
    } catch (err) {
      console.error(err);
      alert("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] text-zinc-900">
      {/* ── HEADER ── */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center gap-5">
          {/* Logo */}
          <h1 className="font-black text-2xl text-red-500 tracking-tight flex-shrink-0">
            pos<span className="text-zinc-900">bistro</span>
          </h1>

          {/* Location */}
          <div className="flex items-center gap-1.5 text-[13px] text-zinc-500 border border-zinc-200 rounded-lg px-3 py-1.5 flex-shrink-0">
            <MapPin size={13} className="text-red-500" />
            Bengaluru, KA
          </div>

          {/* Search */}
          <div className="flex-1 flex items-center gap-2.5 bg-zinc-50 border border-zinc-200 focus-within:border-red-400 rounded-xl px-4 py-2.5 transition-colors">
            <Search size={15} className="text-zinc-400 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search for dishes, restaurants…"
              className="bg-transparent outline-none text-sm text-zinc-900 placeholder-zinc-400 w-full"
            />
          </div>

          {/* Cart badge */}
          <div className="flex items-center gap-2 bg-red-500 text-white rounded-xl px-4 py-2 flex-shrink-0">
            <ShoppingCart size={16} />
            <span className="font-bold text-sm">{totalItems}</span>
          </div>
        </div>
      </header>

      {/* ── MAIN ── */}
      <div className="max-w-[1200px] mx-auto px-6 py-7 flex gap-7 items-start">
        {/* ── MENU ── */}
        <div className="flex-1">
          <div className="flex items-baseline gap-3 mb-5">
            <h2 className="text-xl font-black text-zinc-900">🍽️ Menu</h2>
            <span className="text-sm text-zinc-400">{menuItems.length} items available</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {menuItems.map((item) => (
              <MenuCard
                key={item.id}
                item={item}
                qty={getQty(item.id)}
                onAdd={addToCart}
                onDecrease={decreaseQty}
              />
            ))}
          </div>
        </div>

        {/* ── CART ── */}
        <div className="w-[360px] flex-shrink-0 hidden lg:block">
          <div className="bg-white rounded-2xl border border-zinc-100 shadow-lg sticky top-24 overflow-hidden">
            {/* Cart header */}
            <div className="bg-red-500 px-5 py-4 text-white">
              <h2 className="font-black text-lg">🛒 Your Cart</h2>
              <p className="text-[13px] opacity-80 mt-0.5">
                {totalItems === 0
                  ? "Add items to get started"
                  : `${totalItems} item${totalItems > 1 ? "s" : ""} in your cart`}
              </p>
            </div>

            {/* Empty state */}
            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-14 text-zinc-300">
                <ShoppingCart size={52} strokeWidth={1} />
                <p className="font-semibold text-[15px] text-zinc-400 mt-4">
                  Your cart is empty
                </p>
                <p className="text-[13px] mt-1">Add items from the menu</p>
              </div>
            ) : (
              <>
                {/* Cart items */}
                <div>
                  {cart.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onAdd={addToCart}
                      onDecrease={decreaseQty}
                      onRemove={removeFromCart}
                    />
                  ))}
                </div>

                {/* Coupon strip */}
                <div className="flex items-center gap-2.5 px-4 py-3 bg-yellow-50 border-t border-yellow-100 text-yellow-700 text-[13px] font-semibold cursor-pointer hover:bg-yellow-100 transition-colors">
                  <Tag size={14} />
                  Apply coupon &amp; save more
                </div>

                {/* Bill breakdown */}
                <div className="px-4 py-4 border-t border-zinc-100">
                  <div className="space-y-2 text-[13.5px] text-zinc-500">
                    <div className="flex justify-between">
                      <span>Item Total</span>
                      <span>₹{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery fee</span>
                      <span className="text-green-600 font-semibold">FREE</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Taxes &amp; charges (5%)</span>
                      <span>₹{tax}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center font-black text-[16px] text-zinc-900 border-t border-dashed border-zinc-200 mt-3 pt-3">
                    <span>To Pay</span>
                    <span className="text-red-500">₹{total}</span>
                  </div>

                  <button
                    onClick={placeOrder}
                    disabled={loading}
                    className="w-full mt-4 bg-red-500 hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed text-white font-black text-[16px] py-4 rounded-xl transition-all shadow-md"
                  >
                    {loading ? "Placing order…" : "Place Order →"}
                  </button>

                  {success && (
                    <div className="mt-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3 flex items-center gap-2 font-semibold text-sm">
                      <CheckCircle size={17} />
                      Order placed successfully!
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}