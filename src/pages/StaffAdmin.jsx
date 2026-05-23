import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Plus, RefreshCw } from "lucide-react";
import { API_BASE, getAuthHeaders } from "../api";

const emptyForm = { name: "", email: "", password: "", role: "cashier" };

export default function StaffAdmin() {
  const [staff, setStaff] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const fetchStaff = useCallback(async () => {
    const res = await axios.get(API_BASE + "/staff", { headers: getAuthHeaders() });
    setStaff(res.data);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStaff();
    }, 0);
    return () => clearTimeout(timer);
  }, [fetchStaff]);

  const createStaff = async () => {
    if (!form.name || !form.email || !form.password) return;
    setLoading(true);
    try {
      const res = await axios.post(API_BASE + "/staff", form, { headers: getAuthHeaders() });
      setStaff((prev) => [...prev, res.data]);
      setForm(emptyForm);
    } finally {
      setLoading(false);
    }
  };

  const updateStaff = async (id, patch) => {
    const res = await axios.patch(API_BASE + "/staff/" + id, patch, { headers: getAuthHeaders() });
    setStaff((prev) => prev.map((user) => (user._id === id || user.id === id ? res.data : user)));
  };

  return <section className="admin-panel">
    <style>{`
      .admin-panel { display:grid; gap:16px; }
      .admin-card { padding:16px; border-radius:8px; border:1px solid rgba(255,255,255,0.09); background:rgba(255,255,255,0.055); }
      .admin-title { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:14px; }
      .admin-title h2 { margin:0; color:#fff; font-size:20px; }
      .admin-grid { display:grid; gap:10px; }
      .staff-grid { grid-template-columns:1fr 1fr 1fr .7fr auto; }
      .admin-input { height:42px; padding:0 12px; border-radius:8px; border:1px solid rgba(255,255,255,0.12); color:#fff; background:rgba(0,0,0,0.22); }
      .admin-btn { height:42px; display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:0 14px; border:0; border-radius:8px; color:#150d06; background:#ffd166; font-weight:1000; }
      .toggle-btn { color:#fff; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); }
      .product-list { display:grid; gap:10px; }
      .product-row { display:grid; gap:10px; align-items:center; padding:12px; border-radius:8px; border:1px solid rgba(255,255,255,0.08); background:rgba(0,0,0,0.2); }
      .staff-row { grid-template-columns:1fr 140px 120px; }
      .product-row strong { color:#fff; }
      .product-row span { display:block; color:rgba(255,255,255,0.5); font-size:12px; }
      @media (max-width:900px) { .staff-grid, .staff-row { grid-template-columns:1fr; } }
    `}</style>
    <div className="admin-card">
      <div className="admin-title"><h2>Create staff user</h2><button className="admin-btn toggle-btn" onClick={fetchStaff}><RefreshCw size={15}/> Refresh</button></div>
      <div className="admin-grid staff-grid">
        <input className="admin-input" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})}/>
        <input className="admin-input" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}/>
        <input className="admin-input" placeholder="Password" value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})}/>
        <select className="admin-input" value={form.role} onChange={(e)=>setForm({...form,role:e.target.value})}><option value="cashier">Cashier</option><option value="kitchen">Kitchen</option><option value="admin">Admin</option></select>
        <button className="admin-btn" onClick={createStaff} disabled={loading}><Plus size={16}/> Add</button>
      </div>
    </div>
    <div className="admin-card">
      <div className="admin-title"><h2>Staff</h2><span>{staff.length} users</span></div>
      <div className="product-list">
        {staff.map((user)=><div className="product-row staff-row" key={user._id || user.id}>
          <div><strong>{user.name}</strong><span>{user.email}</span></div>
          <select className="admin-input" value={user.role} onChange={(e)=>updateStaff(user._id || user.id,{role:e.target.value})}><option value="admin">Admin</option><option value="cashier">Cashier</option><option value="kitchen">Kitchen</option></select>
          <button className="admin-btn toggle-btn" onClick={()=>updateStaff(user._id || user.id,{isActive:!user.isActive})}>{user.isActive ? "Active" : "Disabled"}</button>
        </div>)}
      </div>
    </div>
  </section>;
}
