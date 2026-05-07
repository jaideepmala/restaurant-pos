import { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const menuItems = [
    {
      id: 1,
      name: "Margherita Pizza",
      price: 299,
      image:
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800",
    },
    {
      id: 2,
      name: "Veg Burger",
      price: 199,
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
    },
    {
      id: 3,
      name: "French Fries",
      price: 149,
      image:
        "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800",
    },
    {
      id: 4,
      name: "Cold Coffee",
      price: 129,
      image:
        "https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=800",
    },
  ];

  const [cart, setCart] = useState([]);

  const addToCart = (item) => {
    const existingItem = cart.find((cartItem) => cartItem.id === item.id);

    if (existingItem) {
      const updatedCart = cart.map((cartItem) =>
        cartItem.id === item.id
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );

      setCart(updatedCart);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const increaseQuantity = (id) => {
    const updatedCart = cart.map((item) =>
      item.id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );

    setCart(updatedCart);
  };

  const decreaseQuantity = (id) => {
    const updatedCart = cart
      .map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
      .filter((item) => item.quantity > 0);

    setCart(updatedCart);
  };

  const totalAmount = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    try {
      const orderData = {
        items: cart,
        totalAmount: totalAmount,
      };

      const response = await axios.post(
        "https://restaurant-pos-backend-816k.onrender.com/api/orders",
        orderData
      );

      console.log("Order Saved:", response.data);

      alert("🎉 Order placed successfully!");

      setCart([]);
    } catch (error) {
      console.error(error);

      alert("❌ Failed to place order");
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        padding: "30px",
        fontFamily: "Arial",
      }}
    >
      <h1
        style={{
          textAlign: "center",
          fontSize: "48px",
          marginBottom: "10px",
        }}
      >
        🍽 Restaurant POS
      </h1>

      <p
        style={{
          textAlign: "center",
          color: "#94a3b8",
          marginBottom: "40px",
        }}
      >
        Modern Cloud POS System
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "30px",
        }}
      >
        {/* MENU */}
        <div>
          <h2 style={{ marginBottom: "20px" }}>Menu</h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
              gap: "20px",
            }}
          >
            {menuItems.map((item) => (
              <div
                key={item.id}
                style={{
                  background: "#1e293b",
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "100%",
                    height: "180px",
                    objectFit: "cover",
                  }}
                />

                <div style={{ padding: "20px" }}>
                  <h3>{item.name}</h3>

                  <p
                    style={{
                      color: "#38bdf8",
                      fontSize: "20px",
                      fontWeight: "bold",
                    }}
                  >
                    ₹{item.price}
                  </p>

                  <button
                    onClick={() => addToCart(item)}
                    style={{
                      marginTop: "10px",
                      width: "100%",
                      padding: "12px",
                      border: "none",
                      borderRadius: "12px",
                      background: "#38bdf8",
                      color: "white",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CART */}
        <div
          style={{
            background: "#1e293b",
            padding: "20px",
            borderRadius: "20px",
            height: "fit-content",
            position: "sticky",
            top: "20px",
          }}
        >
          <h2>🛒 Cart</h2>

          {cart.length === 0 ? (
            <p style={{ color: "#94a3b8" }}>Cart is empty</p>
          ) : (
            <>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    marginTop: "20px",
                    paddingBottom: "15px",
                    borderBottom: "1px solid #334155",
                  }}
                >
                  <h3>{item.name}</h3>

                  <p>₹{item.price}</p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginTop: "10px",
                    }}
                  >
                    <button
                      onClick={() => decreaseQuantity(item.id)}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() => increaseQuantity(item.id)}
                      style={{
                        width: "30px",
                        height: "30px",
                        borderRadius: "8px",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}

              <h2 style={{ marginTop: "30px" }}>
                Total: ₹{totalAmount}
              </h2>

              <button
                onClick={placeOrder}
                style={{
                  marginTop: "20px",
                  width: "100%",
                  padding: "15px",
                  border: "none",
                  borderRadius: "14px",
                  background: "#22c55e",
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                Place Order
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;