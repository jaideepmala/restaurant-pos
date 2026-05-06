import { useState, useEffect } from "react";

export default function App() {

  // Load cart from localStorage
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("cart");
    return saved ? JSON.parse(saved) : [];
  });

  const menu = [
    { id: 1, name: "Burger", price: 120 },
    { id: 2, name: "Pizza", price: 250 },
    { id: 3, name: "Coke", price: 40 },
    { id: 4, name: "Fries", price: 90 },
  ];

  // Persist cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);

    if (existing) {
      setCart(cart.map(c =>
        c.id === item.id ? { ...c, qty: c.qty + 1 } : c
      ));
    } else {
      setCart([...cart, { ...item, qty: 1 }]);
    }
  };

  const increase = (id) => {
    setCart(cart.map(c =>
      c.id === id ? { ...c, qty: c.qty + 1 } : c
    ));
  };

  const decrease = (id) => {
    setCart(
      cart
        .map(c =>
          c.id === id ? { ...c, qty: c.qty - 1 } : c
        )
        .filter(c => c.qty > 0)
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const checkout = () => {
    if (cart.length === 0) return;

    const orders = JSON.parse(localStorage.getItem("orders") || "[]");

    const newOrder = {
      id: Date.now(),
      items: cart,
      total: total,
      time: new Date().toLocaleString(),
    };

    localStorage.setItem("orders", JSON.stringify([...orders, newOrder]));

    setCart([]);
    alert("✅ Order placed!");
  };

  const viewOrders = () => {
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    console.log("Orders:", orders);
    alert(`Total Orders: ${orders.length} (check console)`);
  };

  return (
    <div style={styles.container}>

      {/* HEADER */}
      <div style={styles.header}>
        <h1>🍽️ POS System</h1>
      </div>

      <div style={styles.content}>

        {/* MENU */}
        <div style={styles.menu}>
          <h2>Menu</h2>

          <div style={styles.menuGrid}>
            {menu.map(item => (
              <div key={item.id} style={styles.card}>
                <h3>{item.name}</h3>
                <p>₹{item.price}</p>
                <button
                  style={styles.addBtn}
                  onClick={() => addToCart(item)}
                >
                  Add
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* CART */}
        <div style={styles.cart}>
          <h2>Cart</h2>

          {cart.length === 0 && (
            <p style={{ opacity: 0.6 }}>No items added</p>
          )}

          {cart.map(item => (
            <div key={item.id} style={styles.cartItem}>

              <div>
                <strong>{item.name}</strong>
                <p>₹{item.price}</p>
              </div>

              <div style={styles.qtyControls}>
                <button onClick={() => decrease(item.id)}>-</button>
                <span>{item.qty}</span>
                <button onClick={() => increase(item.id)}>+</button>
              </div>

              <div>
                ₹{item.price * item.qty}
              </div>
            </div>
          ))}

          <div style={styles.totalBox}>
            <h3>Total: ₹{total}</h3>

            <button style={styles.checkoutBtn} onClick={checkout}>
              Checkout
            </button>

            <button style={styles.secondaryBtn} onClick={viewOrders}>
              View Orders
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

/* STYLES */
const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    background: "#f5f6fa",
    minHeight: "100vh",
  },

  header: {
    background: "#111",
    color: "#fff",
    padding: "20px 30px",
  },

  content: {
    display: "flex",
    gap: "30px",
    padding: "30px",
  },

  menu: {
    flex: 2,
  },

  menuGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
    textAlign: "center",
  },

  addBtn: {
    marginTop: "10px",
    padding: "8px 12px",
    border: "none",
    background: "#007bff",
    color: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
  },

  cart: {
    flex: 1,
    background: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
  },

  cartItem: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "15px",
  },

  qtyControls: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  totalBox: {
    marginTop: "20px",
    borderTop: "1px solid #eee",
    paddingTop: "15px",
  },

  checkoutBtn: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    background: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },

  secondaryBtn: {
    marginTop: "10px",
    width: "100%",
    padding: "10px",
    background: "#555",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};