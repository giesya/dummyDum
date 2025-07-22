import React, { useState, useEffect } from 'react';

const HIMA_LIST = ['HIMAIF', 'HIMADS', 'HMIT', 'HMRPL', 'Independen'];

function getOrganizationsFromStorage() {
  const data = localStorage.getItem('organizations');
  return data ? JSON.parse(data) : [];
}

function setOrganizationsToStorage(data) {
  localStorage.setItem('organizations', JSON.stringify(data));
}

const ProkerManagement = () => {
  const [selectedHima, setSelectedHima] = useState(HIMA_LIST[0]);
  const [organizations, setOrganizations] = useState(getOrganizationsFromStorage());

  useEffect(() => {
    setOrganizations(getOrganizationsFromStorage());
  }, []);

  const handleDeleteProker = (prokerId) => {
    const updatedOrganizations = organizations.map(org => {
      if (org.name === selectedHima) {
        return {
          ...org,
          proker: (org.proker || []).filter(p => p.id !== prokerId),
        };
      }
      return org;
    });
    setOrganizationsToStorage(updatedOrganizations);
    setOrganizations(updatedOrganizations);
  };

  const currentOrg = organizations.find(org => org.name === selectedHima);
  const prokers = currentOrg ? currentOrg.proker || [] : [];

  return (
    <div style={{ padding: '2rem', maxWidth: 1600, margin: '0 auto' }}>
      <h2>Manajemen Proker ORMAWA</h2>
      <div style={{ marginBottom: 18 }}>
        <label>Pilih HIMA: </label>
        <select value={selectedHima} onChange={e => setSelectedHima(e.target.value)} style={{ padding: 6, borderRadius: 4, border: '1px solid #ccc' }}>
          {HIMA_LIST.map(hima => <option key={hima} value={hima}>{hima}</option>)}
        </select>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={{ padding: 8, border: '1px solid #ddd' }}>Nama Proker</th>
            <th style={{ padding: 8, border: '1px solid #ddd' }}>Deskripsi</th>
            <th style={{ padding: 8, border: '1px solid #ddd' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {prokers.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center', padding: 16 }}>Belum ada proker.</td>
            </tr>
          ) : (
            prokers.map(proker => (
              <tr key={proker.id}>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{proker.name}</td>
                <td style={{ padding: 8, border: '1px solid #ddd' }}>{proker.description}</td>
                <td style={{ padding: 8, border: '1px solid #ddd', textAlign: 'center' }}>
                  <button onClick={() => handleDeleteProker(proker.id)} style={{ background: '#d32f2f', color: 'white', border: 'none', borderRadius: 4, padding: '4px 10px', fontWeight: 'bold', cursor: 'pointer' }}>Hapus</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProkerManagement; 