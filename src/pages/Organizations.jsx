import React, { useState, useEffect } from 'react';
import Modal from '../components/Modal';
import { getRole } from '../services/auth';

const initialOrganizations = [
  { id: 1, name: 'HIMAIF', description: 'Himpunan Mahasiswa Informatika' },
  { id: 2, name: 'HIMADS', description: 'Himpunan Mahasiswa Data Science' },
  { id: 3, name: 'HMIT', description: 'Himpunan Mahasiswa Teknologi Informasi' },
  { id: 4, name: 'HMRPL', description: 'Himpunan Mahasiswa Rekayasa Perangkat Lunak' },
  { id: 5, name: 'Independen', description: 'Kegiatan non-himpunan (independen)' },
];

const HIMA_LIST = ['HIMAIF', 'HIMADS', 'HMIT', 'HMRPL', 'Independen'];
function getProkerFromStorage() {
  const data = localStorage.getItem('proker_per_hima');
  return data ? JSON.parse(data) : { HIMAIF: [], HIMADS: [], HMIT: [], HMRPL: [], Independen: [] };
}
function setProkerToStorage(data) {
  localStorage.setItem('proker_per_hima', JSON.stringify(data));
}

const Organizations = () => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '' });
  const [organizations, setOrganizations] = useState(initialOrganizations);
  const [editOrg, setEditOrg] = useState(null);
  const [deleteOrg, setDeleteOrg] = useState(null);
  const role = getRole();
  const [selectedHima, setSelectedHima] = useState(HIMA_LIST[0]);
  const [prokerData, setProkerData] = useState(getProkerFromStorage());
  const [newProker, setNewProker] = useState('');
  const [editingProker, setEditingProker] = useState({ org: null, idx: null, value: '' });
  const [addingProker, setAddingProker] = useState({ org: null, value: '' });

  useEffect(() => { setProkerData(getProkerFromStorage()); }, []);

  // Tambah
  const handleAdd = () => setOpen(true);
  const handleClose = () => { setOpen(false); setForm({ name: '', description: '' }); };
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = e => {
    e.preventDefault();
    setOrganizations(orgs => [
      ...orgs,
      { id: Date.now(), ...form }
    ]);
    handleClose();
  };

  // Edit
  const handleEdit = org => {
    setEditOrg(org);
    setForm({ name: org.name, description: org.description });
    setEditOpen(true);
  };
  const handleEditClose = () => { setEditOpen(false); setEditOrg(null); setForm({ name: '', description: '' }); };
  const handleEditSubmit = e => {
    e.preventDefault();
    setOrganizations(orgs => orgs.map(o => o.id === editOrg.id ? { ...o, ...form } : o));
    handleEditClose();
  };

  // Hapus
  const handleDelete = org => { setDeleteOrg(org); setDeleteOpen(true); };
  const handleDeleteClose = () => { setDeleteOpen(false); setDeleteOrg(null); };
  const handleDeleteConfirm = () => {
    setOrganizations(orgs => orgs.filter(o => o.id !== deleteOrg.id));
    handleDeleteClose();
  };

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

  const handleDeleteProkerIdx = (orgName, idx) => {
    const updated = { ...prokerData };
    updated[orgName].splice(idx, 1);
    setProkerToStorage(updated);
    setProkerData(updated);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <h2>Manajemen Organisasi</h2>
        {role === 'admin' && (
          <button onClick={handleAdd} style={{ background: '#800000', color: 'white', border: 'none', borderRadius: 4, padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }}>+ Tambah Organisasi</button>
        )}
      </div>
      <div style={{ marginTop: 24 }}>
        <table>
          <thead>
            <tr>
              <th>Nama Organisasi</th>
              <th>Deskripsi</th>
              <th>Proker</th>
              {role === 'admin' && <th>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {organizations.map(org => (
              <tr key={org.id}>
                <td>{org.name}</td>
                <td>{org.description}</td>
                <td style={{ minWidth: 180 }}>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                    {(prokerData[org.name] || []).map((proker, idx) => (
                      <li key={proker} style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                        {editingProker.org === org.name && editingProker.idx === idx ? (
                          <>
                            <input value={editingProker.value} onChange={e => setEditingProker(ep => ({ ...ep, value: e.target.value }))} style={{ padding: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} />
                            <button onClick={() => {
                              const updated = { ...prokerData };
                              updated[org.name][idx] = editingProker.value;
                              setProkerToStorage(updated);
                              setProkerData(updated);
                              setEditingProker({ org: null, idx: null, value: '' });
                            }} style={{ background: '#008000', color: 'white', border: 'none', borderRadius: 4, padding: '2px 8px', fontSize: 13 }}>Simpan</button>
                            <button onClick={() => setEditingProker({ org: null, idx: null, value: '' })} style={{ background: '#aaa', color: 'white', border: 'none', borderRadius: 4, padding: '2px 8px', fontSize: 13 }}>Batal</button>
                          </>
                        ) : (
                          <>
                            <span>{proker}</span>
                            {role === 'admin' && (
                              <>
                                <button onClick={() => setEditingProker({ org: org.name, idx, value: proker })} style={{ background: '#FFD700', color: '#800000', border: 'none', borderRadius: 4, padding: '2px 8px', fontSize: 13 }}>Edit</button>
                                <button onClick={() => handleDeleteProkerIdx(org.name, idx)} style={{ background: '#d32f2f', color: 'white', border: 'none', borderRadius: 4, padding: '2px 8px', fontSize: 13 }}>Hapus</button>
                              </>
                            )}
                          </>
                        )}
                      </li>
                    ))}
                  </ul>
                {role === 'admin' && (
                    addingProker.org === org.name ? (
                      <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                        <input value={addingProker.value} onChange={e => setAddingProker(ap => ({ ...ap, value: e.target.value }))} style={{ padding: 4, borderRadius: 4, border: '1px solid #ccc', fontSize: 14 }} />
                        <button onClick={() => {
                          if (!addingProker.value.trim()) return;
                          const updated = { ...prokerData };
                          if (!updated[org.name].includes(addingProker.value.trim())) {
                            updated[org.name].push(addingProker.value.trim());
                            setProkerToStorage(updated);
                            setProkerData(updated);
                          }
                          setAddingProker({ org: null, value: '' });
                        }} style={{ background: '#800000', color: 'white', border: 'none', borderRadius: 4, padding: '2px 8px', fontSize: 13 }}>Tambah</button>
                        <button onClick={() => setAddingProker({ org: null, value: '' })} style={{ background: '#aaa', color: 'white', border: 'none', borderRadius: 4, padding: '2px 8px', fontSize: 13 }}>Batal</button>
                      </div>
                    ) : (
                      <button onClick={() => setAddingProker({ org: org.name, value: '' })} style={{ background: '#800000', color: 'white', border: 'none', borderRadius: 4, padding: '2px 8px', fontSize: 13, marginTop: 4 }}>+ Proker</button>
                    )
                  )}
                </td>
                {role === 'admin' && <td>
                    <button style={{ background: '#FFD700', color: '#800000', border: 'none', borderRadius: 4, padding: '4px 10px', marginRight: 6, fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleEdit(org)}>Edit</button>
                    <button style={{ background: '#d32f2f', color: 'white', border: 'none', borderRadius: 4, padding: '4px 10px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleDelete(org)}>Hapus</button>
                </td>}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Modal Tambah */}
      <Modal open={open} onClose={handleClose} title="Tambah Organisasi">
        <form onSubmit={handleSubmit}>
          <label>Nama Organisasi</label>
          <input name="name" value={form.name} onChange={handleChange} required />
          <label>Deskripsi</label>
          <textarea name="description" value={form.description} onChange={handleChange} required />
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button type="submit">Simpan</button>
            <button type="button" style={{ background: '#aaa', color: '#fff' }} onClick={handleClose}>Batal</button>
          </div>
        </form>
      </Modal>
      {/* Modal Edit */}
      <Modal open={editOpen} onClose={handleEditClose} title="Edit Organisasi">
        <form onSubmit={handleEditSubmit}>
          <label>Nama Organisasi</label>
          <input name="name" value={form.name} onChange={handleChange} required />
          <label>Deskripsi</label>
          <textarea name="description" value={form.description} onChange={handleChange} required />
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button type="submit">Simpan</button>
            <button type="button" style={{ background: '#aaa', color: '#fff' }} onClick={handleEditClose}>Batal</button>
          </div>
        </form>
      </Modal>
      {/* Modal Hapus */}
      <Modal open={deleteOpen} onClose={handleDeleteClose} title="Hapus Organisasi">
        <div style={{ marginBottom: 18 }}>
          Yakin ingin menghapus organisasi <b>{deleteOrg?.name}</b>?
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ background: '#d32f2f' }} onClick={handleDeleteConfirm}>Hapus</button>
          <button type="button" style={{ background: '#aaa', color: '#fff' }} onClick={handleDeleteClose}>Batal</button>
        </div>
      </Modal>
    </div>
  );
};

export default Organizations; 