import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Plus, RefreshCw, Save } from "lucide-react";
import { API_BASE, getAuthHeaders } from "../api";
import { connectRealtime } from "../realtime";

const initialForm = {
  name: "",
  price: "",
  category: "General",
  image: "",
  isAvailable: true,
};

export default function MenuAdmin() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    const res = await axios.get(API_BASE + "/products", {
      headers: getAuthHeaders(),
    });
    setProducts(res.data);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchProducts]);

  useEffect(() => {
    const socket = connectRealtime({
      onProductChanged: () => fetchProducts(),
    });

    return () => socket?.disconnect();
  }, [fetchProducts]);

  const createProduct = async () => {
    if (!form.name || !form.price) return;

    try {
      setLoading(true);
      const res = await axios.post(
        API_BASE + "/products",
        {
          ...form,
          price: Number(form.price),
        },
        { headers: getAuthHeaders() }
      );
      setProducts((prev) => [...prev, res.data]);
      setForm(initialForm);
    } finally {
      setLoading(false);
    }
  };

  const updateProduct = async (id, patch) => {
    const res = await axios.patch(API_BASE + "/products/" + id, patch, {
      headers: getAuthHeaders(),
    });

    setProducts((prev) =>
      prev.map((product) => (product._id === id ? res.data : product))
    );
  };

  return (
    <section className="admin-panel">
      <style>{`
        .admin-panel { display: grid; gap: 16px; }
        .admin-card {
          padding: 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.09);
          background: rgba(255,255,255,0.055);
        }
        .admin-title { display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 14px; }
        .admin-title h2 { margin: 0; color: #fff; font-size: 20px; }
        .admin-grid { display: grid; grid-template-columns: 1.2fr 0.5fr 0.7fr 1.2fr auto; gap: 10px; }
        .admin-input {
          height: 42px; padding: 0 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.12);
          color: #fff; background: rgba(0,0,0,0.22); outline: 0;
        }
        .admin-btn {
          height: 42px; display: inline-flex; align-items: center; justify-content: center; gap: 8px; padding: 0 14px;
          border: 0; border-radius: 8px; color: #150d06; background: #ffd166; font-weight: 1000;
        }
        .product-list { display: grid; gap: 10px; }
        .product-row {
          display: grid; grid-template-columns: 1fr 100px 120px 140px; gap: 10px; align-items: center;
          padding: 12px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.08); background: rgba(0,0,0,0.2);
        }
        .product-row strong { color: #fff; }
        .staff-grid { grid-template-columns: 1fr 1fr 1fr 0.7fr auto; }
        .staff-row { grid-template-columns: 1fr 140px 120px; }
        .settings-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; margin-bottom:12px; }
        .settings-grid .wide { grid-column:1 / -1; }
        .product-row span { color: rgba(255,255,255,0.5); font-size: 12px; }
        .toggle-btn { color: #fff; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); }
        @media (max-width: 900px) { .admin-grid, .product-row { grid-template-columns: 1fr; } }
      `}</style>

      <div className="admin-card">
        <div className="admin-title">
          <h2>Create menu item</h2>
          <button className="admin-btn toggle-btn" onClick={fetchProducts}>
            <RefreshCw size={15} /> Refresh
          </button>
        </div>
        <div className="admin-grid">
          <input className="admin-input" placeholder="Item name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <input className="admin-input" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
          <input className="admin-input" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <input className="admin-input" placeholder="Image URL" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
          <button className="admin-btn" onClick={createProduct} disabled={loading}>
            <Plus size={16} /> Add
          </button>
        </div>
      </div>

      <div className="admin-card">
        <div className="admin-title">
          <h2>Menu</h2>
          <span>{products.length} items</span>
        </div>
        <div className="product-list">
          {products.map((product) => (
            <div className="product-row" key={product._id}>
              <div>
                <strong>{product.name}</strong>
                <span>{product.category}</span>
              </div>
              <input className="admin-input" value={product.price} onChange={(e) => updateProduct(product._id, { price: Number(e.target.value) })} />
              <button className="admin-btn toggle-btn" onClick={() => updateProduct(product._id, { isAvailable: !product.isAvailable })}>
                {product.isAvailable ? "Available" : "Hidden"}
              </button>
              <button className="admin-btn" onClick={() => updateProduct(product._id, product)}>
                <Save size={15} /> Save
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
