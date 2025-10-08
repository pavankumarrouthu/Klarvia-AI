import { useEffect, useState } from 'react';

interface TableListResp { tables: string[] }

interface RowViewResp { table: string; count: number; rows: any[]; limit: number; error?: string }

const API_BASE = (import.meta.env.VITE_API_BASE ?? 'http://localhost:5000');

const InspectDB = () => {
  const [tables, setTables] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>('');
  const [limit, setLimit] = useState<number>(25);
  const [rows, setRows] = useState<RowViewResp | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editRowId, setEditRowId] = useState<string | null>(null);
  const [editCol, setEditCol] = useState('');
  const [editValue, setEditValue] = useState('');
  const [insertData, setInsertData] = useState<string>(''); // JSON string
  const [msg, setMsg] = useState<string | null>(null);

  const fetchTables = async () => {
    try {
      const r = await fetch(`${API_BASE}/inspect/tables`);
      const data: TableListResp = await r.json();
      setTables(data.tables || []);
    } catch (e: any) {
      setError(e.message);
    }
  };

  const fetchRows = async (table = selected, lim = limit) => {
    if (!table) return;
    setLoading(true); setError(null); setMsg(null);
    try {
      const r = await fetch(`${API_BASE}/inspect/${table}?limit=${lim}`);
      const data: RowViewResp = await r.json();
      if ((data as any).error) setError((data as any).error);
      setRows(data);
    } catch (e: any) {
      setError(e.message);
    } finally { setLoading(false); }
  };

  const doEdit = async () => {
    if (!selected || !editRowId || !editCol) return;
    setMsg(null); setError(null);
    try {
      const r = await fetch(`${API_BASE}/inspect/${selected}/${editRowId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ column: editCol, value: editValue })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Update failed');
      setMsg('Row updated');
      fetchRows();
    } catch (e: any) { setError(e.message); }
  };

  const doDelete = async (id: string) => {
    if (!selected) return;
    if (!confirm('Delete row ' + id + '?')) return;
    setMsg(null); setError(null);
    try {
      const r = await fetch(`${API_BASE}/inspect/${selected}/${id}`, { method: 'DELETE' });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Delete failed');
      setMsg('Row deleted');
      fetchRows();
    } catch (e: any) { setError(e.message); }
  };

  const doInsert = async () => {
    if (!selected) return;
    setMsg(null); setError(null);
    try {
      let parsed: any;
      try { parsed = JSON.parse(insertData || '{}'); } catch { throw new Error('Insert data must be valid JSON'); }
      const r = await fetch(`${API_BASE}/inspect/${selected}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: parsed })
      });
      const data = await r.json();
      if (!r.ok) throw new Error(data.error || 'Insert failed');
      setMsg('Row inserted');
      fetchRows();
    } catch (e: any) { setError(e.message); }
  };

  useEffect(() => { fetchTables(); }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Database Inspector (Dev Only)</h1>
      <div className="flex flex-wrap gap-4 items-end">
        <div>
          <label className="block text-sm font-medium mb-1">Table</label>
          <select
            className="border rounded px-2 py-1"
            value={selected}
            onChange={(e)=>{setSelected(e.target.value); setRows(null); setMsg(null); setError(null);}}
          >
            <option value="">-- select table --</option>
            {tables.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Limit</label>
            <input type="number" className="border rounded px-2 py-1 w-24" value={limit}
              onChange={e=>setLimit(parseInt(e.target.value)||25)} />
        </div>
        <button
          className="bg-primary text-primary-foreground px-4 py-2 rounded hover:bg-primary/90"
          onClick={()=>fetchRows()}
          disabled={!selected || loading}
        >Load Rows</button>
        <button
          className="border px-4 py-2 rounded"
          onClick={()=>{fetchTables(); setMsg('Tables refreshed');}}
        >Refresh Tables</button>
      </div>
      {error && <div className="text-red-600 text-sm">Error: {error}</div>}
      {msg && <div className="text-green-600 text-sm">{msg}</div>}

      {rows && (
        <div className="overflow-auto border rounded p-3">
          <div className="text-sm mb-2">{rows.count} row(s) (showing up to {rows.limit})</div>
          <table className="text-sm w-full border-collapse">
            <thead>
              <tr>
                {rows.rows[0] && Object.keys(rows.rows[0]).map(col => (
                  <th key={col} className="border px-2 py-1 text-left bg-muted font-medium">{col}</th>
                ))}
                <th className="border px-2 py-1 bg-muted">Actions</th>
              </tr>
            </thead>
            <tbody>
              {rows.rows.map(r => (
                <tr key={r.id || JSON.stringify(r)} className="odd:bg-muted/30">
                  {Object.keys(rows.rows[0] || {}).map(col => (
                    <td key={col} className="border px-2 py-1 whitespace-nowrap max-w-[240px] overflow-hidden text-ellipsis">{String(r[col])}</td>
                  ))}
                  <td className="border px-2 py-1 space-x-2">
                    {r.id && (
                      <>
                        <button className="underline text-blue-600" onClick={()=>{setEditRowId(r.id); setEditCol(''); setEditValue('');}}>Edit</button>
                        <button className="underline text-red-600" onClick={()=>doDelete(r.id)}>Del</button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editRowId && (
        <div className="border rounded p-4 space-y-3">
          <h2 className="font-medium">Edit Row {editRowId}</h2>
          <div className="flex flex-wrap gap-4">
            <input placeholder="column" className="border rounded px-2 py-1" value={editCol} onChange={e=>setEditCol(e.target.value)} />
            <input placeholder="value" className="border rounded px-2 py-1" value={editValue} onChange={e=>setEditValue(e.target.value)} />
            <button className="bg-blue-600 text-white px-4 py-1 rounded" onClick={doEdit} disabled={!editCol}>Save</button>
            <button className="border px-4 py-1 rounded" onClick={()=>setEditRowId(null)}>Cancel</button>
          </div>
        </div>
      )}

      {selected && (
        <div className="border rounded p-4 space-y-3">
          <h2 className="font-medium">Insert Row into {selected}</h2>
          <p className="text-xs text-muted-foreground">Enter JSON mapping of column names to values. Example: {`{"email":"a@b.com","password_hash":"x"}`}</p>
          <textarea className="w-full border rounded p-2 font-mono text-xs h-32" value={insertData} onChange={e=>setInsertData(e.target.value)} />
          <button className="bg-green-600 text-white px-4 py-1 rounded" onClick={doInsert}>Insert</button>
        </div>
      )}
    </div>
  );
};

export default InspectDB;
