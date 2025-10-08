import { useEffect, useState } from 'react';

type Snapshot = { tables: string[]; data: Record<string, any[]> };

const API_BASE = (import.meta.env.VITE_API_BASE ?? 'http://localhost:5000');

const SBInspect = () => {
  const [snapshot, setSnapshot] = useState<Snapshot | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      const candidates = [
        `${API_BASE}/inspect/be/dump`,
        `${API_BASE}/inspect/be`,
        `${API_BASE}/sb/inspect/dump`,
        `${API_BASE}/sb/inspect`,
      ];
      const attemptDetails: string[] = [];
      for (const url of candidates) {
        try {
          const r = await fetch(url, { headers: { 'Accept': 'application/json' } });
          const ct = r.headers.get('content-type') || '';
          const raw = await r.text();
          let parsed: any = null;
            if (ct.includes('application/json')) {
              try { parsed = JSON.parse(raw); } catch {/* ignore */}
            } else {
              try { parsed = JSON.parse(raw); } catch {/* ignore */}
            }
          if (!r.ok) {
            const errMsg = (parsed && parsed.error) ? parsed.error : `HTTP ${r.status} ${r.statusText}`;
            attemptDetails.push(`${url} -> ${errMsg}${parsed ? '' : ` (snippet: ${raw.slice(0,80)})`}`);
            continue; // try next
          }
          if (!parsed) {
            attemptDetails.push(`${url} -> Non-JSON (ct=${ct}) snippet: ${raw.slice(0,80)}`);
            continue;
          }
          if (active) {
            setSnapshot(parsed);
            setError(null);
            setLoading(false);
          }
          return; // success
        } catch (err: any) {
          attemptDetails.push(`${url} -> network/error: ${err.message}`);
        }
      }
      if (active) {
        setError(`All endpoints failed:\n${attemptDetails.join('\n')}`);
        setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
  <h1 className="text-2xl font-semibold">Database Snapshot (Read-Only)</h1>
  <div className="text-xs text-muted-foreground">API Base: {API_BASE}</div>
      {loading && <div className="text-sm">Loading…</div>}
  {error && <pre className="text-xs whitespace-pre-wrap text-red-600 border p-3 rounded bg-red-50">{error}</pre>}
      {snapshot && snapshot.tables.length === 0 && (
        <div className="text-sm">No tables found.</div>
      )}
      {snapshot && snapshot.tables.map(t => (
        <div key={t} className="border rounded p-4">
          <h2 className="font-medium mb-2">{t}</h2>
          {Array.isArray(snapshot.data[t]) && snapshot.data[t].length > 0 ? (
            <div className="overflow-auto">
              <table className="text-xs w-full border-collapse">
                <thead>
                  <tr>
                    {Object.keys(snapshot.data[t][0]).map(col => (
                      <th key={col} className="border px-2 py-1 text-left bg-muted font-medium whitespace-nowrap">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {snapshot.data[t].map((row: any, idx: number) => (
                    <tr key={idx} className="odd:bg-muted/30">
                      {Object.keys(snapshot.data[t][0]).map(col => (
                        <td key={col} className="border px-2 py-1 whitespace-nowrap max-w-[260px] overflow-hidden text-ellipsis">{String(row[col])}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-xs text-muted-foreground">(no rows)</div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SBInspect;
