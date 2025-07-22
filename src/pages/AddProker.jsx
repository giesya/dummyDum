import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AddProker = () => {
  const { orgId } = useParams();
  const navigate = useNavigate();
  const [prokerName, setProkerName] = useState('');
  const [prokerDescription, setProkerDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!prokerName.trim() || !prokerDescription.trim()) {
      alert('Nama dan deskripsi proker tidak boleh kosong.');
      return;
    }

    const organizations = JSON.parse(localStorage.getItem('organizations')) || [];
    const updatedOrganizations = organizations.map(org => {
      if (org.name === orgId) {
        const newProker = {
          id: `${org.name}-${Date.now()}`,
          name: prokerName,
          description: prokerDescription,
        };
        return {
          ...org,
          proker: [...(org.proker || []), newProker],
        };
      }
      return org;
    });

    localStorage.setItem('organizations', JSON.stringify(updatedOrganizations));
    alert('Proker berhasil ditambahkan!');
    navigate('/organizations');
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Tambah Proker untuk {orgId}</h2>
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label>Nama Proker</label>
          <input
            type="text"
            value={prokerName}
            onChange={(e) => setProkerName(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label>Deskripsi Proker</label>
          <textarea
            value={prokerDescription}
            onChange={(e) => setProkerDescription(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', marginTop: '0.5rem', minHeight: '100px' }}
          />
        </div>
        <button type="submit" style={{ padding: '0.5rem 1rem', background: '#4CAF50', color: 'white', border: 'none', cursor: 'pointer' }}>
          Tambah
        </button>
      </form>
    </div>
  );
};

export default AddProker;