'use client';
import { useState } from 'react';
import VersementTable from './VersementTable';

export default function VersementByLocalite({ rows, localites }) {
  const [selected, setSelected] = useState(localites[0] || '');

  const filtered = rows.filter(r => !selected || r.localite === selected);

  return (
    <div>
      <div className="mb-4 space-x-2">
        {localites.map(loc => (
          <button
            key={loc}
            onClick={() => setSelected(loc)}
            className={`px-2 py-1 border rounded ${selected === loc ? 'bg-blue-500 text-white' : ''}`}
          >
            {loc}
          </button>
        ))}
      </div>
      <VersementTable rows={filtered} />
    </div>
  );
}
