import { useState } from "react";
import axios from "axios";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Search,
  Star,
  Clock3,
  MapPin,
  CheckCircle,
} from "lucide-react";

const menuItems = [
  {
    id: 1,
    name: "Margherita Pizza",
    price: 299,
    rating: 4.5,
    time: "25 mins",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Farmhouse Pizza",
    price: 399,
    rating: 4.7,
    time: "30 mins",
    image:
      "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Veg Burger",
    price: 199,
    rating: 4.4,
    time: "20 mins",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Cold Coffee",
    price: 149,
    rating: 4.8,
    time: "10 mins",
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "French Fries",
    price: 129,
    rating: 4.2,
    time: "15 mins",
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Chocolate Shake",
    price: 179,
    rating: 4.9,
    time: "12 mins",
    image:
      "https://images.unsplash.com/photo-1577805947697-89e18249d767?q=80&w=1200&auto=format&fit=crop",
  },
];

function App() {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const addToCart = (item) => {
    const existing = cart.find((c) => c.id === item.id);

    if (existing) {
      setCart(
        cart.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        )
      );
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const increaseQty = (id) => {
    setCart(
      cart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQty = (id) => {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    if (cart.length === 0) return;

    try {
      setLoading(true);

      await axios.post(
        "https://restaurant-pos-backend-816k.onrender.com/api/orders",
        {
          items: cart,
          total,
        }
      );

      setSuccess(true);
      setCart([]);

      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error(err);
      alert("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-black">
      <div className="bg-white sticky top-0 z-50 border-b border-zinc-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-4xl font-black text-red-500">
                POS Bistro
              </h1>
              <div className="flex items-center gap-2 text-zinc-500 mt-1 text-sm">
                <MapPin size={14} /> Bengaluru
              </div>
            </div>

            <div className="hidden md:flex items-center bg-zinc-100 px-4 py-3 rounded-2xl w-[420px]">
              <Search size={18} className="text-zinc-400" />
              <input
                type="text"
                placeholder="Search for pizza, burger, coffee..."
                className="bg-transparent outline-none w-full ml-3"
              />
            </div>

            <div className="bg-black text-white px-5 py-3 rounded-2xl flex items-center gap-2 shadow-lg">
              <ShoppingCart size={20} />
              <span className="font-bold">{cart.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <h2 className="text-5xl font-black leading-tight">
              Delicious food,
              <br />
              delivered fast.
            </h2>

            <p className="text-zinc-500 mt-4 text-lg max-w-2xl">
              Premium restaurant ordering experience with real-time cloud POS.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-zinc-100"
              >
                <div className="relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-52 w-full object-cover"
                  />

                  <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow-md">
                    ₹{item.price}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold">{item.name}</h3>
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-sm text-zinc-500">
                    <div className="flex items-center gap-1">
                      <Star size={14} className="fill-yellow-400 text-yellow-400" />
                      {item.rating}
                    </div>

                    <div className="flex items-center gap-1">
                      <Clock3 size={14} />
                      {item.time}
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(item)}
                    className="w-full mt-5 bg-red-500 hover:bg-red-600 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all"
                  >
                    <Plus size={18} /> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="bg-white rounded-3xl p-6 sticky top-28 shadow-lg border border-zinc-100">
            <h2 className="text-3xl font-black mb-6">
              Your Cart
            </h2>

            {cart.length === 0 ? (
              <div className="text-center py-12 text-zinc-400">
                No items added yet.
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="border border-zinc-100 rounded-2xl p-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-lg">
                          {item.name}
                        </h3>
                        <p className="text-red-500 font-semibold mt-1">
                          ₹{item.price}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          setCart(cart.filter((c) => c.id !== item.id))
                        }
                        className="text-zinc-400 hover:text-red-500"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => decreaseQty(item.id)}
                          className="bg-zinc-100 p-2 rounded-xl"
                        >
                          <Minus size={14} />
                        </button>

                        <span className="font-bold text-lg">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQty(item.id)}
                          className="bg-zinc-100 p-2 rounded-xl"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      <div className="font-black text-lg">
                        ₹{item.quantity * item.price}
                      </div>
                    </div>
                  </div>
                ))}

                <div className="border-t border-zinc-200 pt-5 mt-5">
                  <div className="flex items-center justify-between text-2xl font-black">
                    <span>Total</span>
                    <span>₹{total}</span>
                  </div>

                  <button
                    onClick={placeOrder}
                    disabled={loading}
                    className="w-full mt-6 bg-black text-white py-4 rounded-2xl font-bold text-lg hover:opacity-90"
                  >
                    {loading ? "Processing..." : "Place Order"}
                  </button>

                  {success && (
                    <div className="mt-4 bg-green-50 border border-green-200 text-green-600 p-4 rounded-2xl flex items-center gap-2">
                      <CheckCircle size={18} />
                      Order placed successfully!
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
