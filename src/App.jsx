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
    <div className="min-h-screen bg-[#f5f5f7] text-black">
      <div className="bg-white border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-red-500 tracking-tight">
              POS Bistro
            </h1>
            <div className="flex items-center gap-1 text-zinc-500 text-sm mt-1">
              <MapPin size={13} /> Bengaluru
            </div>
          </div>

          <div className="flex-1 max-w-2xl hidden md:flex items-center bg-zinc-100 rounded-2xl px-4 py-3">
            <Search size={18} className="text-zinc-400" />
            <input
              type="text"
              placeholder="Search for dishes..."
              className="bg-transparent outline-none w-full ml-3 text-sm"
            />
          </div>

          <div className="bg-black text-white rounded-2xl px-5 py-3 flex items-center gap-2 shadow-lg">
            <ShoppingCart size={18} />
            <span className="font-bold">{cart.length}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        <div className="flex-1">
          <div className="mb-8">
            <h2 className="text-5xl font-black leading-tight tracking-tight">
              Discover amazing food.
            </h2>

            <p className="text-zinc-500 text-lg mt-3">
              Modern cloud-native restaurant ordering experience.
            </p>
          </div>

          <div className="space-y-5">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-3xl p-4 flex items-center justify-between shadow-sm border border-zinc-100 hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-5">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-28 h-28 rounded-2xl object-cover"
                  />

                  <div>
                    <h3 className="text-2xl font-bold tracking-tight">
                      {item.name}
                    </h3>

                    <div className="flex items-center gap-4 mt-2 text-sm text-zinc-500">
                      <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg font-semibold">
                        <Star size={13} className="fill-green-700" />
                        {item.rating}
                      </div>

                      <div className="flex items-center gap-1">
                        <Clock3 size={14} />
                        {item.time}
                      </div>
                    </div>

                    <div className="mt-3 text-2xl font-black text-red-500">
                      ₹{item.price}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => addToCart(item)}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-md"
                >
                  <Plus size={18} /> Add
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[380px] hidden lg:block">
          <div className="bg-white rounded-3xl p-6 sticky top-28 shadow-xl border border-zinc-100">
            <h2 className="text-3xl font-black mb-6 tracking-tight">
              Your Cart
            </h2>

            {cart.length === 0 ? (
              <div className="text-center py-16 text-zinc-400">
                Cart is empty.
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
                        <p className="text-red-500 font-bold mt-1">
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
                    <span className="text-red-500">₹{total}</span>
                  </div>

                  <button
                    onClick={placeOrder}
                    disabled={loading}
                    className="w-full mt-6 bg-black text-white py-4 rounded-2xl font-bold text-lg hover:opacity-90 shadow-lg"
                  >
                    {loading ? "Processing..." : "Place Order"}
                  </button>

                  {success && (
                    <div className="mt-4 bg-green-50 border border-green-200 text-green-700 p-4 rounded-2xl flex items-center gap-2 font-semibold">
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
