import { useState } from "react";
import axios from "axios";
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  Pizza,
  Coffee,
  IceCream,
  Sandwich,
  CheckCircle,
} from "lucide-react";

const menuItems = [
  {
    id: 1,
    name: "Margherita Pizza",
    price: 299,
    category: "Pizza",
    image:
      "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Farmhouse Pizza",
    price: 399,
    category: "Pizza",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Cold Coffee",
    price: 149,
    category: "Drinks",
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Veg Burger",
    price: 199,
    category: "Burger",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "Pasta Alfredo",
    price: 349,
    category: "Pasta",
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Chocolate Shake",
    price: 179,
    category: "Drinks",
    image:
      "https://images.unsplash.com/photo-1577805947697-89e18249d767?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 7,
    name: "French Fries",
    price: 129,
    category: "Sides",
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=1200&auto=format&fit=crop",
  },
  {
    id: 8,
    name: "Ice Cream Sundae",
    price: 159,
    category: "Dessert",
    image:
      "https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=1200&auto=format&fit=crop",
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

  const removeItem = (id) => {
    setCart(cart.filter((item) => item.id !== id));
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
          createdAt: new Date(),
        }
      );

      setSuccess(true);
      setCart([]);

      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error(error);
      alert("Failed to place order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-6 shadow-2xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Restaurant POS
            </h1>
            <p className="text-sm opacity-90 mt-1">
              Cloud Native SaaS POS Platform
            </p>
          </div>

          <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-2xl backdrop-blur-md">
            <ShoppingCart size={22} />
            <span className="font-semibold">{cart.length} Items</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 p-6">
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3 mb-6 overflow-x-auto pb-2">
            <div className="bg-orange-500 px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap">
              <Pizza size={18} /> Pizza
            </div>
            <div className="bg-zinc-900 px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap">
              <Coffee size={18} /> Drinks
            </div>
            <div className="bg-zinc-900 px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap">
              <Sandwich size={18} /> Burgers
            </div>
            <div className="bg-zinc-900 px-4 py-2 rounded-full flex items-center gap-2 whitespace-nowrap">
              <IceCream size={18} /> Dessert
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {menuItems.map((item) => (
              <div
                key={item.id}
                className="bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-800 hover:border-orange-500 transition-all duration-300 hover:scale-[1.02] shadow-xl"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-48 w-full object-cover"
                />

                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold">{item.name}</h2>
                    <span className="text-orange-400 text-sm">
                      {item.category}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <p className="text-2xl font-extrabold">
                      ₹{item.price}
                    </p>

                    <button
                      onClick={() => addToCart(item)}
                      className="bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition-all"
                    >
                      <Plus size={18} /> Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800 h-fit sticky top-6 shadow-2xl">
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
            <ShoppingCart /> Cart
          </h2>

          {cart.length === 0 ? (
            <div className="text-zinc-400 text-center py-12">
              Your cart is empty
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-black/40 rounded-2xl p-4 border border-zinc-800"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-orange-400 mt-1">
                        ₹{item.price}
                      </p>
                    </div>

                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-red-400 hover:text-red-500"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => decreaseQty(item.id)}
                        className="bg-zinc-800 p-2 rounded-lg hover:bg-zinc-700"
                      >
                        <Minus size={16} />
                      </button>

                      <span className="font-bold text-lg">
                        {item.quantity}
                      </span>

                      <button
                        onClick={() => increaseQty(item.id)}
                        className="bg-zinc-800 p-2 rounded-lg hover:bg-zinc-700"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <p className="font-bold text-lg">
                      ₹{item.quantity * item.price}
                    </p>
                  </div>
                </div>
              ))}

              <div className="border-t border-zinc-700 pt-4 mt-6">
                <div className="flex items-center justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="text-orange-400">₹{total}</span>
                </div>

                <button
                  onClick={placeOrder}
                  disabled={loading}
                  className="w-full mt-6 bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 transition-all py-4 rounded-2xl font-bold text-lg shadow-lg"
                >
                  {loading ? "Processing..." : "Place Order"}
                </button>

                {success && (
                  <div className="mt-4 bg-green-500/20 border border-green-500 text-green-400 p-4 rounded-2xl flex items-center gap-2">
                    <CheckCircle size={20} />
                    Order placed successfully!
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;