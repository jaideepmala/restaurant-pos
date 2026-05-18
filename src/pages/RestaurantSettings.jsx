import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Save } from "lucide-react";
import { API_BASE, getAuthHeaders } from "../api";

export default function RestaurantSettings() {
  const [form, setForm] = useState(null);
  const fetchSettings = useCallback(async () => {
    const res = await axios.get(API_BASE + "/restaurant/me", { headers: getAuthHeaders() });
    setForm({ ...res.data, tablesText: (res.data.tables || []).join(", ") });
  }, []);
  useEffect(()=>{ fetchSettings(); }, [fetchSettings]);

  const save = async () => {
    const payload = {
      name: form.name,
      logoUrl: form.logoUrl,
      currency: form.currency,
      taxRate: Number(form.taxRate),
      serviceCharge: Number(form.serviceCharge),
      tables: form.tablesText.split(",").map((x)=>x.trim()).filter(Boolean),
    };
    const res = await axios.patch(API_BASE + "/restaurant/settings", payload, { headers: getAuthHeaders() });
    setForm({ ...res.data, tablesText: (res.data.tables || []).join(", ") });
  };

  if (!form) return <div className="admin-card">Loading settings…</div>;
  return <section className="admin-panel">
    <style>{`
      .admin-panel { display:grid; gap:16px; }
      .admin-card { padding:16px; border-radius:8px; border:1px solid rgba(255,255,255,0.09); background:rgba(255,255,255,0.055); }
      .admin-title { display:flex; align-items:center; justify-content:space-between; gap:12px; margin-bottom:14px; }
      .admin-title h2 { margin:0; color:#fff; font-size:20px; }
      .admin-input { height:42px; padding:0 12px; border-radius:8px; border:1px solid rgba(255,255,255,0.12); color:#fff; background:rgba(0,0,0,0.22); }
      .admin-btn { height:42px; display:inline-flex; align-items:center; justify-content:center; gap:8px; padding:0 14px; border:0; border-radius:8px; color:#150d06; background:#ffd166; font-weight:1000; }
      .settings-grid { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:10px; margin-bottom:12px; }
      .settings-grid .wide { grid-column:1 / -1; }
      @media (max-width:900px) { .settings-grid { grid-template-columns:1fr; } }
    `}</style>
    <div className="admin-card">
      <div className="admin-title"><h2>Restaurant settings</h2></div>
      <div className="settings-grid">
        <input className="admin-input" value={form.name || ""} onChange={(e)=>setForm({...form,name:e.target.value})} placeholder="Restaurant name"/>
        <input className="admin-input" value={form.logoUrl || ""} onChange={(e)=>setForm({...form,logoUrl:e.target.value})} placeholder="Logo URL"/>
        <input className="admin-input" value={form.currency || "INR"} onChange={(e)=>setForm({...form,currency:e.target.value})} placeholder="Currency"/>
        <input className="admin-input" value={form.taxRate ?? 0} onChange={(e)=>setForm({...form,taxRate:e.target.value})} placeholder="Tax rate (0.05)"/>
        <input className="admin-input" value={form.serviceCharge ?? 0} onChange={(e)=>setForm({...form,serviceCharge:e.target.value})} placeholder="Service charge"/>
        <input className="admin-input wide" value={form.tablesText} onChange={(e)=>setForm({...form,tablesText:e.target.value})} placeholder="Tables, comma separated"/>
      </div>
      <button className="admin-btn" onClick={save}><Save size={15}/> Save settings</button>
    </div>
  </section>;
}
