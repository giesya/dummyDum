import React, { useState, useEffect } from 'react';

const HIMA_LIST = ['HIMAIF', 'HIMADS', 'HMIT', 'HMRPL'];

function getProkerFromStorage() {
  const data = localStorage.getItem('proker_per_hima');
  return data ? JSON.parse(data) : { HIMAIF: [], HIMADS: [], HMIT: [], HMRPL: [] };
}
function setProkerToStorage(data) {
  localStorage.setItem('proker_per_hima', JSON.stringify(data));
}

const ProkerManagement = () => {
  const [selectedHima, setSelectedHima] = useState(HIMA_LIST[0]);
  const [prokerData, setProkerData] = useState(getProkerFromStorage());
  const [newProker, setNewProker] = useState('');

  useEffect(() => {
    setProkerData(getProkerFromStorage());
  }, []);

  const handleAddProker = e => {
    e.preventDefault();
    if (!newProker.trim()) return;
    const updated = { ...prokerData };
    if (!updated[selectedHima].includes(newProker.trim())) {
      updated[selectedHima].push(newProker.trim());
      setProkerToStorage(updated);
      setProkerData(updated);
      setNewProker('');
    }
  };

  const handleDeleteProker = idx => {
    const updated = { ...prokerData };
    updated[selectedHima].splice(idx, 1);
    setProkerToStorage(updated);
    setProkerData(updated);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 600, margin: '0 auto' }}>
      <h2>Manajemen Proker ORMAWA</h2>
      <div style={{ marginBottom: 18 }}>
        <label>Pilih HIMA: </label>
        <select value={selectedHima} onChange={e => setSelectedHima(e.target.value)} style={{ padding: 6, borderRadius: 4, border: '1px solid #ccc' }}>
          {HIMA_LIST.map(hima => <option key={hima} value={hima}>{hima}</option>)}
        </select>
      </div>
      <form onSubmit={handleAddProker} style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        <input
          type="text"
          placeholder="Nama Proker Baru"
          value={newProker}
          onChange={e => setNewProker(e.target.value)}
          style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
        />
        <button type="submit" style={{ padding: '8px 16px', background: '#800000', color: 'white', border: 'none', borderRadius: 4, fontWeight: 'bold' }}>Tambah</button>
      </form>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {prokerData[selectedHima].length === 0 && <li style={{ color: '#888' }}>Belum ada proker</li>}
        {prokerData[selectedHima].map((proker, idx) => (
          <li key={proker} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #eee' }}>
            <span>{proker}</span>
            <button onClick={() => handleDeleteProker(idx)} style={{ background: '#d32f2f', color: 'white', border: 'none', borderRadius: 4, padding: '4px 10px', fontWeight: 'bold', cursor: 'pointer' }}>Hapus</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProkerManagement; 