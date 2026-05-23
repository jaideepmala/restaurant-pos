import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_BASE, getAuthHeaders } from "../api";
import { connectRealtime } from "../realtime";
import {
  Banknote,
  Bell,
  CheckCircle,
  ChefHat,
  Clock3,
  CreditCard,
  Grid3X3,
  IndianRupee,
  LogOut,
  Minus,
  Plus,
  ReceiptText,
  Search,
  ShoppingCart,
  Sparkles,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";

const fallbackMenuItems = [
  {
    id: 1,
    name: "Margherita Pizza",
    category: "Pizzas",
    price: 299,
    rating: 4.5,
    time: "25m",
    image:
      "https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Farmhouse Pizza",
    category: "Pizzas",
    price: 399,
    rating: 4.7,
    time: "30m",
    image:
      "https://images.unsplash.com/photo-1604382355076-af4b0eb60143?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Veg Burger",
    category: "Burgers",
    price: 199,
    rating: 4.4,
    time: "20m",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Cold Coffee",
    category: "Drinks",
    price: 149,
    rating: 4.8,
    time: "10m",
    image:
      "https://images.unsplash.com/photo-1517701604599-bb29b565090c?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 5,
    name: "French Fries",
    category: "Sides",
    price: 129,
    rating: 4.2,
    time: "15m",
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?q=80&w=900&auto=format&fit=crop",
  },
  {
    id: 6,
    name: "Chocolate Shake",
    category: "Drinks",
    price: 179,
    rating: 4.9,
    time: "12m",
    image:
      "https://images.unsplash.com/photo-1577805947697-89e18249d767?q=80&w=900&auto=format&fit=crop",
  },
];

const fallbackTables = ["T1", "T2", "T3", "T4", "Takeaway"];
const modes = ["Dine In", "Takeaway", "Delivery"];
const OPEN_STATUSES = ["PLACED", "ACCEPTED", "PREPARING", "READY"];
const STATUS_FLOW = ["PLACED", "ACCEPTED", "PREPARING", "READY", "SERVED"];

const formatStatus = (status) =>
  status
    .toLowerCase()
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

const nextStatusFor = (status) => {
  const index = STATUS_FLOW.indexOf(status);
  return index >= 0 && index < STATUS_FLOW.length - 1
    ? STATUS_FLOW[index + 1]
    : null;
};

const getItemId = (item) => item._id || item.id;

function MenuCard({ item, qty, onAdd, onDecrease }) {
  return (
    <article className="dish-card">
      <div className="dish-media">
        <img src={item.image} alt={item.name} />
        <div className="dish-chip">
          <Clock3 size={13} />
          {item.time}
        </div>
      </div>

      <div className="dish-body">
        <div className="dish-kicker">
          <span>{item.category}</span>
          <span className="dish-rating">{item.rating}</span>
        </div>

        <h3>{item.name}</h3>

        <div className="dish-actions">
          <strong>₹{item.price}</strong>
          {qty === 0 ? (
            <button className="add-btn" onClick={() => onAdd(item)}>
              <Plus size={16} />
              Add
            </button>
          ) : (
            <div className="qty-stepper" aria-label={`${item.name} quantity`}>
              <button onClick={() => onDecrease(getItemId(item))} aria-label="Decrease">
                <Minus size={14} />
              </button>
              <span>{qty}</span>
              <button onClick={() => onAdd(item)} aria-label="Increase">
                <Plus size={14} />
              </button>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

function CartItem({ item, onAdd, onDecrease, onRemove }) {
  return (
    <div className="ticket-item">
      <img src={item.image} alt={item.name} />
      <div className="ticket-info">
        <p>{item.name}</p>
        <span>₹{item.price} each</span>
      </div>
      <div className="ticket-controls">
        <div className="mini-stepper">
          <button onClick={() => onDecrease(getItemId(item))} aria-label="Decrease">
            <Minus size={13} />
          </button>
          <span>{item.quantity}</span>
          <button onClick={() => onAdd(item)} aria-label="Increase">
            <Plus size={13} />
          </button>
        </div>
        <strong>₹{item.price * item.quantity}</strong>
      </div>
      <button
        className="icon-danger"
        onClick={() => onRemove(getItemId(item))}
        aria-label={`Remove ${item.name}`}
      >
        <Trash2 size={15} />
      </button>
    </div>
  );
}

function ActiveOrders({ orders, loading, onRefresh, onStatusChange }) {
  return (
    <section className="orders-panel">
      <div className="panel-title">
        <h2>
          <ReceiptText size={20} />
          Open Tickets
        </h2>
        <button className="refresh-btn" onClick={onRefresh} disabled={loading}>
          {loading ? "Refreshing" : "Refresh"}
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty">
          No open tickets. Place an order to start the kitchen flow.
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => {
            const nextStatus = nextStatusFor(order.status);

            return (
              <article className="order-card" key={order._id}>
                <div className="order-card-top">
                  <div>
                    <strong>{order.tableName || "Counter"}</strong>
                    <span>{order.orderType?.replace("_", " ") || "DINE IN"}</span>
                  </div>
                  <span className={`status-badge status-${order.status?.toLowerCase()}`}>
                    {formatStatus(order.status || "PLACED")}
                  </span>
                </div>

                <div className="order-lines">
                  {order.items?.slice(0, 3).map((item, index) => (
                    <div key={`${order._id}-${index}`}>
                      <span>
                        {item.quantity} x {item.name}
                      </span>
                      <strong>₹{item.lineTotal || item.price * item.quantity}</strong>
                    </div>
                  ))}
                </div>

                <div className="order-card-bottom">
                  <strong>₹{order.totalAmount}</strong>
                  <div>
                    {nextStatus && (
                      <button
                        className="order-action"
                        onClick={() => onStatusChange(order._id, nextStatus)}
                      >
                        Mark {formatStatus(nextStatus)}
                      </button>
                    )}
                    <button
                      className="order-action ghost"
                      onClick={() => onStatusChange(order._id, "CANCELLED")}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default function POS({ user, logout }) {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [activeTable, setActiveTable] = useState("T1");
  const [mode, setMode] = useState("Dine In");
  const [menuItems, setMenuItems] = useState([]);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [restaurant, setRestaurant] = useState(null);

  const tables = restaurant?.tables?.length ? restaurant.tables : fallbackTables;

  const categories = useMemo(
    () => ["All", ...new Set(menuItems.map((item) => item.category))],
    [menuItems]
  );

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return menuItems.filter((item) => {
      const matchesCategory = category === "All" || item.category === category;
      const matchesQuery = item.name.toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query, menuItems]);

  const getQty = (id) => {
    const item = cart.find((c) => getItemId(c) === id);
    return item ? item.quantity : 0;
  };

  const addToCart = (item) => {
    setCart((prev) => {
      const existing = prev.find((c) => getItemId(c) === getItemId(item));
      if (existing) {
        return prev.map((c) =>
          getItemId(c) === getItemId(item) ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const decreaseQty = (id) => {
    setCart((prev) =>
      prev
        .map((c) => (getItemId(c) === id ? { ...c, quantity: c.quantity - 1 } : c))
        .filter((c) => c.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((c) => getItemId(c) !== id));
  };

  const openOrders = useMemo(
    () => orders.filter((order) => OPEN_STATUSES.includes(order.status)),
    [orders]
  );

  const activeTableOrders = useMemo(
    () => openOrders.filter((order) => order.tableName === activeTable),
    [activeTable, openOrders]
  );

  const subtotal = cart.reduce((s, i) => s + i.price * i.quantity, 0);
  const tax = Math.round(subtotal * Number(restaurant?.taxRate ?? 0.05));
  const service = cart.length ? Number(restaurant?.serviceCharge ?? 24) : 0;
  const total = subtotal + tax + service;
  const totalItems = cart.reduce((s, i) => s + i.quantity, 0);
  const openTicketValue = openOrders.reduce(
    (sum, order) => sum + Number(order.totalAmount || 0),
    0
  );

  const fetchProducts = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/products`, {
        headers: getAuthHeaders(),
      });
      const availableProducts = res.data
        .filter((product) => product.isAvailable)
        .map((product) => ({
          ...product,
          id: product._id,
          image:
            product.image ||
            "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=900&auto=format&fit=crop",
          rating: 4.7,
          time: "15m",
        }));
      setMenuItems(availableProducts.length ? availableProducts : fallbackMenuItems);
    } catch (err) {
      console.error(err);
      setMenuItems(fallbackMenuItems);
    }
  }, []);

  const fetchOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      const res = await axios.get(`${API_BASE}/orders`, { headers: getAuthHeaders() });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  const fetchRestaurant = useCallback(async () => {
    try {
      const res = await axios.get(`${API_BASE}/restaurant/me`, { headers: getAuthHeaders() });
      setRestaurant(res.data);
      if (res.data.tables?.length) setActiveTable(res.data.tables[0]);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
    fetchOrders();
    fetchRestaurant();
  }, [fetchProducts, fetchOrders, fetchRestaurant]);

  useEffect(() => {
    const socket = connectRealtime({
      onOrderCreated: (order) => {
        setOrders((prev) =>
          prev.some((existing) => existing._id === order._id)
            ? prev
            : [order, ...prev]
        );
      },
      onOrderStatusUpdated: (updatedOrder) => {
        setOrders((prev) =>
          prev.map((order) =>
            order._id === updatedOrder._id ? updatedOrder : order
          )
        );
      },
      onProductChanged: () => fetchProducts(),
    });

    return () => socket?.disconnect();
  }, [fetchProducts]);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const res = await axios.patch(
        `${API_BASE}/orders/${orderId}/status`,
        { status },
        {
          headers: getAuthHeaders(),
        }
      );

      setOrders((prev) =>
        prev.map((order) => (order._id === orderId ? res.data : order))
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update order status.");
    }
  };

  const placeOrder = async () => {
    if (cart.length === 0) return;

    try {
      setLoading(true);

      const res = await axios.post(
        `${API_BASE}/orders`,
        {
          items: cart,
          total,
          tableName: activeTable,
          mode,
        },
        {
          headers: getAuthHeaders(),
        }
      );

      setOrders((prev) =>
        prev.some((order) => order._id === res.data._id)
          ? prev
          : [res.data, ...prev]
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
    <div className="pos-console">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@800;900&display=swap');

        * { box-sizing: border-box; }
        body { margin: 0; background: #09070d; }
        #root {
          width: 100%;
          max-width: none;
          margin: 0;
          border-inline: 0;
          text-align: left;
          display: block;
        }
        button, input { font: inherit; }
        button { cursor: pointer; }

        .pos-console {
          min-height: 100vh;
          width: 100%;
          color: #f7f4ed;
          font-family: 'DM Sans', system-ui, sans-serif;
          background:
            linear-gradient(135deg, rgba(245, 166, 35, 0.12), transparent 28%),
            linear-gradient(225deg, rgba(0, 229, 204, 0.1), transparent 26%),
            #09070d;
          text-align: left;
        }

        .pos-shell {
          width: min(1480px, calc(100vw - 32px));
          margin: 0 auto;
          padding: 18px 0 24px;
        }

        .topbar {
          height: 72px;
          display: flex;
          align-items: center;
          gap: 16px;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.055);
          backdrop-filter: blur(20px);
          padding: 10px;
          border-radius: 8px;
          box-shadow: 0 24px 70px rgba(0,0,0,0.24);
        }

        .brand-block {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 220px;
          padding-left: 6px;
        }

        .brand-mark {
          width: 46px;
          height: 46px;
          border-radius: 8px;
          display: grid;
          place-items: center;
          color: #150d06;
          background: linear-gradient(135deg, #ffd166, #ff4e1a);
          box-shadow: 0 0 32px rgba(245,166,35,0.38);
        }

        .brand-name {
          font-family: 'Playfair Display', serif;
          font-size: 24px;
          font-weight: 900;
          line-height: 1;
          letter-spacing: 0;
          color: #fff;
          margin: 0;
        }

        .brand-name span { color: #ffd166; }
        .brand-sub {
          margin-top: 4px;
          font-size: 11px;
          color: rgba(255,255,255,0.48);
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        .search-box {
          flex: 1;
          height: 48px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 16px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.62);
        }

        .search-box:focus-within {
          border-color: rgba(245,166,35,0.62);
          box-shadow: 0 0 0 3px rgba(245,166,35,0.12);
        }

        .search-box input {
          width: 100%;
          border: 0;
          outline: 0;
          color: #fff;
          background: transparent;
          font-size: 14px;
        }

        .search-box input::placeholder { color: rgba(255,255,255,0.42); }

        .top-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .icon-button {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.72);
          background: rgba(255,255,255,0.06);
          transition: 0.2s ease;
        }

        .icon-button:hover {
          color: #fff;
          border-color: rgba(255,255,255,0.22);
          background: rgba(255,255,255,0.1);
        }

        .cashier-pill {
          min-width: 132px;
          height: 46px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 0 14px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.06);
        }

        .cashier-pill strong {
          color: #fff;
          font-size: 13px;
          line-height: 1.1;
        }

        .cashier-pill span {
          margin-top: 3px;
          color: rgba(255,255,255,0.45);
          font-size: 11px;
        }

        .console-grid {
          display: grid;
          grid-template-columns: 1fr 420px;
          gap: 18px;
          margin-top: 18px;
          align-items: start;
        }

        .workbench {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .hero-strip {
          min-height: 186px;
          display: grid;
          grid-template-columns: 1.25fr 0.75fr;
          overflow: hidden;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.09);
          background:
            linear-gradient(90deg, rgba(8,5,16,0.96) 0%, rgba(8,5,16,0.78) 56%, rgba(8,5,16,0.22) 100%),
            url("https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=1400&auto=format&fit=crop") center/cover;
          box-shadow: 0 24px 80px rgba(0,0,0,0.24);
        }

        .hero-copy {
          padding: 24px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .eyebrow {
          display: inline-flex;
          width: max-content;
          align-items: center;
          gap: 8px;
          padding: 7px 10px;
          border-radius: 999px;
          color: #ffd166;
          background: rgba(245,166,35,0.1);
          border: 1px solid rgba(245,166,35,0.24);
          font-size: 12px;
          font-weight: 700;
        }

        .hero-copy h1 {
          max-width: 620px;
          margin: 14px 0 8px;
          color: #fff;
          font: 900 38px/1.02 'Playfair Display', serif;
          letter-spacing: 0;
        }

        .hero-copy p {
          max-width: 560px;
          margin: 0;
          color: rgba(255,255,255,0.58);
          font-size: 14px;
          line-height: 1.6;
        }

        .shift-panel {
          align-self: stretch;
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          padding: 16px;
          background: rgba(255,255,255,0.06);
          border-left: 1px solid rgba(255,255,255,0.08);
          backdrop-filter: blur(16px);
        }

        .metric {
          min-height: 72px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 6px;
          padding: 12px;
          border-radius: 8px;
          background: rgba(0,0,0,0.28);
          border: 1px solid rgba(255,255,255,0.08);
        }

        .metric span {
          color: rgba(255,255,255,0.46);
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: 1.6px;
        }

        .metric strong {
          color: #fff;
          font-size: 22px;
          line-height: 1;
        }

        .control-row {
          display: grid;
          grid-template-columns: 1fr auto;
          gap: 14px;
        }

        .segmented, .table-strip {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.055);
          overflow-x: auto;
        }

        .segment-btn, .table-btn {
          flex: 0 0 auto;
          height: 38px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 0 14px;
          border-radius: 8px;
          border: 1px solid transparent;
          color: rgba(255,255,255,0.58);
          background: transparent;
          font-weight: 800;
          font-size: 13px;
          transition: 0.18s ease;
        }

        .segment-btn.active, .table-btn.active {
          color: #150d06;
          background: #ffd166;
          border-color: rgba(255,255,255,0.18);
          box-shadow: 0 10px 24px rgba(245,166,35,0.22);
        }

        .menu-panel, .orders-panel {
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.045);
          padding: 16px;
        }

        .refresh-btn {
          height: 34px;
          padding: 0 12px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.72);
          background: rgba(255,255,255,0.06);
          font-size: 12px;
          font-weight: 900;
        }

        .refresh-btn:disabled {
          opacity: 0.55;
          cursor: not-allowed;
        }

        .orders-empty {
          min-height: 74px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          border: 1px dashed rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.44);
          font-size: 13px;
          text-align: center;
        }

        .orders-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }

        .order-card {
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(0,0,0,0.2);
          padding: 12px;
        }

        .order-card-top, .order-card-bottom {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .order-card-top strong {
          display: block;
          color: #fff;
          font-size: 16px;
        }

        .order-card-top span:not(.status-badge) {
          display: block;
          margin-top: 3px;
          color: rgba(255,255,255,0.42);
          font-size: 11px;
          font-weight: 800;
        }

        .status-badge {
          flex: 0 0 auto;
          padding: 6px 8px;
          border-radius: 999px;
          color: #150d06;
          background: #ffd166;
          font-size: 11px;
          font-weight: 1000;
        }

        .status-ready {
          background: #79f2dd;
        }

        .status-preparing {
          background: #ffb86b;
        }

        .order-lines {
          display: grid;
          gap: 8px;
          margin: 12px 0;
          color: rgba(255,255,255,0.72);
          font-size: 13px;
        }

        .order-lines div {
          display: flex;
          justify-content: space-between;
          gap: 10px;
        }

        .order-lines strong {
          color: rgba(255,255,255,0.9);
        }

        .order-card-bottom {
          align-items: center;
          padding-top: 10px;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .order-card-bottom > strong {
          color: #ffd166;
          font-size: 18px;
        }

        .order-card-bottom div {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-end;
          gap: 8px;
        }

        .order-action {
          min-height: 32px;
          padding: 0 10px;
          border: 0;
          border-radius: 8px;
          color: #120c05;
          background: #ffd166;
          font-size: 12px;
          font-weight: 1000;
        }

        .order-action.ghost {
          color: rgba(255,255,255,0.72);
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
        }

        .panel-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          margin-bottom: 14px;
        }

        .panel-title h2 {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #fff;
          font-size: 18px;
          font-weight: 900;
        }

        .panel-title span {
          color: rgba(255,255,255,0.46);
          font-size: 13px;
        }

        .dish-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
        }

        .dish-card {
          min-width: 0;
          overflow: hidden;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.07);
          transition: transform 0.2s ease, border-color 0.2s ease, background 0.2s ease;
        }

        .dish-card:hover {
          transform: translateY(-3px);
          border-color: rgba(245,166,35,0.44);
          background: rgba(255,255,255,0.095);
        }

        .dish-media {
          position: relative;
          height: 154px;
          overflow: hidden;
        }

        .dish-media img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
          transition: transform 0.28s ease;
        }

        .dish-card:hover .dish-media img { transform: scale(1.06); }

        .dish-media::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, transparent 40%, rgba(0,0,0,0.72));
        }

        .dish-chip {
          position: absolute;
          right: 10px;
          bottom: 10px;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 6px 8px;
          border-radius: 999px;
          color: #fff;
          background: rgba(0,0,0,0.58);
          border: 1px solid rgba(255,255,255,0.16);
          font-size: 12px;
          font-weight: 800;
        }

        .dish-body { padding: 12px; }

        .dish-kicker {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: rgba(255,255,255,0.48);
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        .dish-rating {
          color: #79f2dd;
          letter-spacing: 0;
        }

        .dish-body h3 {
          min-height: 42px;
          margin: 8px 0 12px;
          color: #fff;
          font-size: 16px;
          line-height: 1.25;
          font-weight: 900;
        }

        .dish-actions {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .dish-actions strong {
          color: #ffd166;
          font-size: 18px;
        }

        .add-btn {
          height: 38px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 0 14px;
          border: 0;
          border-radius: 8px;
          color: #130d05;
          background: linear-gradient(135deg, #ffd166, #ff9f1c);
          font-weight: 900;
          box-shadow: 0 12px 26px rgba(245,166,35,0.22);
        }

        .qty-stepper, .mini-stepper {
          display: inline-flex;
          align-items: center;
          overflow: hidden;
          border-radius: 8px;
          border: 1px solid rgba(255,209,102,0.32);
          background: rgba(255,209,102,0.1);
        }

        .qty-stepper button, .mini-stepper button {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border: 0;
          color: #ffd166;
          background: transparent;
        }

        .qty-stepper span, .mini-stepper span {
          min-width: 28px;
          text-align: center;
          color: #fff;
          font-weight: 900;
        }

        .ticket {
          position: sticky;
          top: 18px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.11);
          background: rgba(16,13,20,0.92);
          box-shadow: 0 24px 90px rgba(0,0,0,0.36);
          overflow: hidden;
        }

        .ticket-head {
          padding: 18px;
          background:
            linear-gradient(135deg, rgba(255,78,26,0.22), transparent 52%),
            rgba(255,255,255,0.05);
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }

        .ticket-title {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .ticket-title h2 {
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
          color: #fff;
          font-size: 20px;
          font-weight: 900;
        }

        .cart-count {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 10px;
          border-radius: 8px;
          color: #150d06;
          background: #79f2dd;
          font-size: 12px;
          font-weight: 900;
        }

        .mode-row {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
          margin-top: 16px;
        }

        .mode-btn {
          height: 38px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.56);
          background: rgba(0,0,0,0.16);
          font-size: 12px;
          font-weight: 900;
        }

        .mode-btn.active {
          color: #fff;
          border-color: rgba(255,209,102,0.5);
          background: rgba(245,166,35,0.16);
        }

        .ticket-body {
          max-height: calc(100vh - 410px);
          min-height: 220px;
          overflow-y: auto;
        }

        .empty-ticket {
          min-height: 252px;
          display: grid;
          place-items: center;
          padding: 26px;
          text-align: center;
          color: rgba(255,255,255,0.44);
        }

        .empty-ticket svg {
          margin-bottom: 12px;
          color: rgba(255,255,255,0.25);
        }

        .empty-ticket strong {
          display: block;
          margin-bottom: 4px;
          color: rgba(255,255,255,0.78);
        }

        .ticket-item {
          display: grid;
          grid-template-columns: 54px 1fr auto 34px;
          gap: 12px;
          align-items: center;
          padding: 14px 16px;
          border-bottom: 1px solid rgba(255,255,255,0.07);
        }

        .ticket-item img {
          width: 54px;
          height: 54px;
          border-radius: 8px;
          object-fit: cover;
        }

        .ticket-info { min-width: 0; }
        .ticket-info p {
          margin: 0;
          color: #fff;
          font-size: 14px;
          font-weight: 900;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .ticket-info span {
          display: block;
          margin-top: 4px;
          color: rgba(255,255,255,0.42);
          font-size: 12px;
        }

        .ticket-controls {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 8px;
        }

        .mini-stepper button {
          width: 26px;
          height: 28px;
        }

        .mini-stepper span {
          min-width: 24px;
          font-size: 12px;
        }

        .ticket-controls strong {
          color: #fff;
          font-size: 14px;
        }

        .icon-danger {
          width: 32px;
          height: 32px;
          display: grid;
          place-items: center;
          border: 0;
          border-radius: 8px;
          color: rgba(255,255,255,0.34);
          background: transparent;
        }

        .icon-danger:hover {
          color: #ff6b6b;
          background: rgba(255,107,107,0.08);
        }

        .ticket-total {
          padding: 16px;
          border-top: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.045);
        }

        .bill-lines {
          display: grid;
          gap: 10px;
          color: rgba(255,255,255,0.56);
          font-size: 13px;
        }

        .bill-lines div, .grand-total {
          display: flex;
          justify-content: space-between;
          gap: 16px;
        }

        .bill-lines strong {
          color: rgba(255,255,255,0.82);
        }

        .grand-total {
          align-items: center;
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px dashed rgba(255,255,255,0.18);
          color: #fff;
          font-size: 15px;
          font-weight: 900;
        }

        .grand-total strong {
          color: #ffd166;
          font-size: 28px;
        }

        .pay-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          margin-top: 14px;
        }

        .pay-method {
          height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,255,255,0.72);
          background: rgba(255,255,255,0.06);
          font-size: 13px;
          font-weight: 900;
        }

        .place-order {
          width: 100%;
          height: 52px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 12px;
          border: 0;
          border-radius: 8px;
          color: #120c05;
          background: linear-gradient(135deg, #ffd166, #ff4e1a);
          font-size: 15px;
          font-weight: 1000;
          box-shadow: 0 18px 40px rgba(255,78,26,0.22);
        }

        .place-order:disabled {
          cursor: not-allowed;
          opacity: 0.55;
          box-shadow: none;
        }

        .success-box {
          margin-top: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px;
          border-radius: 8px;
          color: #98f5b4;
          background: rgba(34,197,94,0.1);
          border: 1px solid rgba(34,197,94,0.24);
          font-size: 13px;
          font-weight: 800;
        }

        @media (max-width: 1180px) {
          .console-grid {
            grid-template-columns: 1fr;
          }

          .ticket {
            position: static;
          }

          .ticket-body {
            max-height: none;
          }
        }

        @media (max-width: 820px) {
          .pos-shell {
            width: min(100% - 20px, 760px);
            padding-top: 10px;
          }

          .topbar {
            height: auto;
            flex-wrap: wrap;
          }

          .brand-block {
            min-width: 0;
            flex: 1;
          }

          .search-box {
            order: 3;
            flex-basis: 100%;
          }

          .cashier-pill {
            display: none;
          }

          .hero-strip {
            grid-template-columns: 1fr;
          }

          .shift-panel {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            border-left: 0;
            border-top: 1px solid rgba(255,255,255,0.08);
          }

          .hero-copy h1 {
            font-size: 30px;
          }

          .control-row {
            grid-template-columns: 1fr;
          }

          .dish-grid, .orders-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .ticket-item {
            grid-template-columns: 48px 1fr 30px;
          }

          .ticket-controls {
            grid-column: 2 / 4;
            flex-direction: row;
            justify-content: space-between;
            align-items: center;
          }
        }

        @media (max-width: 520px) {
          .dish-grid, .orders-grid {
            grid-template-columns: 1fr;
          }

          .shift-panel, .mode-row, .pay-grid {
            grid-template-columns: 1fr;
          }

          .panel-title {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>

      <main className="pos-shell">
        <header className="topbar">
          <div className="brand-block">
            <div className="brand-mark">
              <UtensilsCrossed size={24} />
            </div>
            <div>
              <p className="brand-name">
                pos<span>bistro</span>
              </p>
              <div className="brand-sub">Service Console</div>
            </div>
          </div>

          <label className="search-box">
            <Search size={18} />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search menu items"
            />
          </label>

          <div className="cashier-pill">
            <strong>{user?.name || user?.email || "Cashier"}</strong>
            <span>Live counter</span>
          </div>

          <div className="top-actions">
            <button className="icon-button" aria-label="Notifications">
              <Bell size={19} />
            </button>
            <button className="icon-button" onClick={logout} aria-label="Logout">
              <LogOut size={19} />
            </button>
          </div>
        </header>

        <section className="console-grid">
          <div className="workbench">
            <section className="hero-strip">
              <div className="hero-copy">
                <span className="eyebrow">
                  <Sparkles size={14} />
                  Dinner rush ready
                </span>
                <h1>Fast billing for a packed restaurant floor.</h1>
                <p>
                  Build tickets, switch tables, scan the menu, and push orders
                  without losing the rhythm of service.
                </p>
              </div>
              <div className="shift-panel">
                <div className="metric">
                  <span>Open tickets</span>
                  <strong>{openOrders.length}</strong>
                </div>
                <div className="metric">
                  <span>Current table</span>
                  <strong>{activeTable}</strong>
                </div>
                <div className="metric">
                  <span>Items</span>
                  <strong>{activeTableOrders.length}</strong>
                </div>
                <div className="metric">
                  <span>Ticket value</span>
                  <strong>₹{openTicketValue}</strong>
                </div>
              </div>
            </section>

            <div className="control-row">
              <div className="segmented" aria-label="Categories">
                {categories.map((item) => (
                  <button
                    key={item}
                    className={`segment-btn ${category === item ? "active" : ""}`}
                    onClick={() => setCategory(item)}
                  >
                    {item === "All" && <Grid3X3 size={15} />}
                    {item}
                  </button>
                ))}
              </div>

              <div className="table-strip" aria-label="Tables">
                {tables.map((table) => (
                  <button
                    key={table}
                    className={`table-btn ${activeTable === table ? "active" : ""}`}
                    onClick={() => setActiveTable(table)}
                  >
                    {table}
                  </button>
                ))}
              </div>
            </div>

            <ActiveOrders
              orders={openOrders}
              loading={ordersLoading}
              onRefresh={fetchOrders}
              onStatusChange={updateOrderStatus}
            />

            <section className="menu-panel">
              <div className="panel-title">
                <h2>
                  <ChefHat size={20} />
                  Menu Board
                </h2>
                <span>
                  {filteredItems.length} of {menuItems.length} items
                </span>
              </div>

              <div className="dish-grid">
                {filteredItems.map((item) => (
                  <MenuCard
                    key={getItemId(item)}
                    item={item}
                    qty={getQty(getItemId(item))}
                    onAdd={addToCart}
                    onDecrease={decreaseQty}
                  />
                ))}
              </div>
            </section>
          </div>

          <aside className="ticket">
            <div className="ticket-head">
              <div className="ticket-title">
                <h2>
                  <ReceiptText size={22} />
                  Order Ticket
                </h2>
                <span className="cart-count">
                  <ShoppingCart size={14} />
                  {totalItems}
                </span>
              </div>

              <div className="mode-row">
                {modes.map((orderMode) => (
                  <button
                    key={orderMode}
                    className={`mode-btn ${mode === orderMode ? "active" : ""}`}
                    onClick={() => setMode(orderMode)}
                  >
                    {orderMode}
                  </button>
                ))}
              </div>
            </div>

            <div className="ticket-body">
              {cart.length === 0 ? (
                <div className="empty-ticket">
                  <div>
                    <ShoppingCart size={54} strokeWidth={1.4} />
                    <strong>No items yet</strong>
                    <p>Select dishes to start a ticket for {activeTable}.</p>
                  </div>
                </div>
              ) : (
                cart.map((item) => (
                  <CartItem
                    key={getItemId(item)}
                    item={item}
                    onAdd={addToCart}
                    onDecrease={decreaseQty}
                    onRemove={removeFromCart}
                  />
                ))
              )}
            </div>

            <div className="ticket-total">
              <div className="bill-lines">
                <div>
                  <span>Subtotal</span>
                  <strong>₹{subtotal}</strong>
                </div>
                <div>
                  <span>Service</span>
                  <strong>₹{service}</strong>
                </div>
                <div>
                  <span>GST 5%</span>
                  <strong>₹{tax}</strong>
                </div>
              </div>

              <div className="grand-total">
                <span>Total</span>
                <strong>₹{total}</strong>
              </div>

              <div className="pay-grid">
                <button className="pay-method">
                  <Banknote size={16} />
                  Cash
                </button>
                <button className="pay-method">
                  <CreditCard size={16} />
                  Card
                </button>
              </div>

              <button
                onClick={placeOrder}
                disabled={loading || cart.length === 0}
                className="place-order"
              >
                <IndianRupee size={18} />
                {loading ? "Placing order" : "Place Order"}
              </button>

              {success && (
                <div className="success-box">
                  <CheckCircle size={17} />
                  Order placed successfully for {activeTable}.
                </div>
              )}
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
