import { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { ChefHat, Clock3, LogOut, RefreshCw, UtensilsCrossed } from "lucide-react";
import { API_BASE, getAuthHeaders } from "../api";
import { connectRealtime } from "../realtime";

const OPEN_STATUSES = ["PLACED", "ACCEPTED", "PREPARING", "READY"];
const STATUS_FLOW = ["PLACED", "ACCEPTED", "PREPARING", "READY"];

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

export default function Kitchen({ user, logout }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const openOrders = useMemo(
    () => orders.filter((order) => OPEN_STATUSES.includes(order.status)),
    [orders]
  );

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_BASE + "/orders", {
        headers: getAuthHeaders(),
      });
      setOrders(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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
    });

    return () => socket?.disconnect();
  }, []);

  const updateStatus = async (orderId, status) => {
    const res = await axios.patch(
      API_BASE + "/orders/" + orderId + "/status",
      { status },
      { headers: getAuthHeaders() }
    );

    setOrders((prev) =>
      prev.map((order) => (order._id === orderId ? res.data : order))
    );
  };

  return (
    <div className="kitchen-root">
      <style>{`
        body { margin: 0; background: #09070d; }
        #root { width: 100%; max-width: none; margin: 0; border: 0; display: block; text-align: left; }
        * { box-sizing: border-box; }
        .kitchen-root {
          min-height: 100vh;
          padding: 18px;
          color: #fff;
          font-family: 'DM Sans', system-ui, sans-serif;
          background:
            linear-gradient(135deg, rgba(245,166,35,0.12), transparent 30%),
            linear-gradient(225deg, rgba(0,229,204,0.12), transparent 28%),
            #09070d;
        }
        .kitchen-shell { width: min(1380px, 100%); margin: 0 auto; }
        .kitchen-top {
          display: flex; align-items: center; justify-content: space-between; gap: 16px;
          padding: 14px; border: 1px solid rgba(255,255,255,0.1); border-radius: 8px;
          background: rgba(255,255,255,0.055);
        }
        .kitchen-brand { display: flex; align-items: center; gap: 12px; }
        .kitchen-mark {
          width: 48px; height: 48px; display: grid; place-items: center; border-radius: 8px;
          color: #160d05; background: linear-gradient(135deg, #ffd166, #ff4e1a);
        }
        .kitchen-brand h1 { margin: 0; font-size: 22px; line-height: 1; }
        .kitchen-brand span { display: block; margin-top: 4px; color: rgba(255,255,255,0.45); font-size: 12px; }
        .kitchen-actions { display: flex; gap: 8px; }
        .kitchen-btn {
          height: 42px; display: inline-flex; align-items: center; gap: 8px; padding: 0 14px;
          border-radius: 8px; border: 1px solid rgba(255,255,255,0.12);
          color: rgba(255,255,255,0.8); background: rgba(255,255,255,0.07); font-weight: 900;
        }
        .kitchen-hero {
          display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin: 16px 0;
        }
        .kitchen-metric {
          padding: 18px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.09); background: rgba(255,255,255,0.055);
        }
        .kitchen-metric span { color: rgba(255,255,255,0.45); font-size: 12px; font-weight: 900; letter-spacing: 1.5px; text-transform: uppercase; }
        .kitchen-metric strong { display: block; margin-top: 8px; color: #ffd166; font-size: 34px; line-height: 1; }
        .kitchen-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
        .kitchen-card {
          border-radius: 8px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.06); overflow: hidden;
        }
        .kitchen-card-head {
          display: flex; justify-content: space-between; gap: 12px; padding: 14px; border-bottom: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,78,26,0.1);
        }
        .kitchen-card-head strong { font-size: 20px; }
        .status-pill { padding: 7px 9px; border-radius: 999px; color: #150d06; background: #ffd166; font-size: 12px; font-weight: 1000; }
        .kitchen-lines { display: grid; gap: 10px; padding: 14px; }
        .kitchen-line { display: flex; justify-content: space-between; gap: 10px; color: rgba(255,255,255,0.82); }
        .kitchen-card-foot { display: flex; justify-content: space-between; gap: 10px; align-items: center; padding: 14px; border-top: 1px solid rgba(255,255,255,0.08); }
        .kitchen-primary { min-height: 40px; padding: 0 14px; border: 0; border-radius: 8px; color: #150d06; background: #ffd166; font-weight: 1000; }
        .kitchen-empty { padding: 42px; border-radius: 8px; border: 1px dashed rgba(255,255,255,0.15); color: rgba(255,255,255,0.5); text-align: center; }
        @media (max-width: 980px) { .kitchen-grid, .kitchen-hero { grid-template-columns: 1fr; } }
      `}</style>

      <main className="kitchen-shell">
        <header className="kitchen-top">
          <div className="kitchen-brand">
            <div className="kitchen-mark"><ChefHat size={25} /></div>
            <div>
              <h1>Kitchen Board</h1>
              <span>{user?.name || user?.email} · realtime orders</span>
            </div>
          </div>
          <div className="kitchen-actions">
            <button className="kitchen-btn" onClick={fetchOrders}>
              <RefreshCw size={16} /> {loading ? "Refreshing" : "Refresh"}
            </button>
            <button className="kitchen-btn" onClick={logout}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </header>

        <section className="kitchen-hero">
          <div className="kitchen-metric"><span>Open</span><strong>{openOrders.length}</strong></div>
          <div className="kitchen-metric"><span>Preparing</span><strong>{openOrders.filter((o) => o.status === "PREPARING").length}</strong></div>
          <div className="kitchen-metric"><span>Ready</span><strong>{openOrders.filter((o) => o.status === "READY").length}</strong></div>
        </section>

        {openOrders.length === 0 ? (
          <div className="kitchen-empty">No live tickets right now.</div>
        ) : (
          <section className="kitchen-grid">
            {openOrders.map((order) => {
              const nextStatus = nextStatusFor(order.status);

              return (
                <article className="kitchen-card" key={order._id}>
                  <div className="kitchen-card-head">
                    <div>
                      <strong>{order.tableName || "Counter"}</strong>
                      <div>{order.orderType?.replace("_", " ") || "DINE IN"}</div>
                    </div>
                    <span className="status-pill">{formatStatus(order.status)}</span>
                  </div>
                  <div className="kitchen-lines">
                    {order.items?.map((item, index) => (
                      <div className="kitchen-line" key={index}>
                        <span>{item.quantity} x {item.name}</span>
                        <Clock3 size={16} />
                      </div>
                    ))}
                  </div>
                  <div className="kitchen-card-foot">
                    <strong>₹{order.totalAmount}</strong>
                    {nextStatus ? (
                      <button className="kitchen-primary" onClick={() => updateStatus(order._id, nextStatus)}>
                        Mark {formatStatus(nextStatus)}
                      </button>
                    ) : (
                      <button className="kitchen-primary" onClick={() => updateStatus(order._id, "SERVED")}>
                        Close
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </main>
    </div>
  );
}
