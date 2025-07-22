import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  // Filter out 'Independen' for admin only
  const filteredOrganizations = role === 'admin' ? organizations.filter(org => org.name !== 'Independen') : organizations;
  const filteredHimaList = role === 'admin' ? HIMA_LIST.filter(hima => hima !== 'Independen') : HIMA_LIST;
  const [selectedHima, setSelectedHima] = useState(filteredHimaList[0]);
  const [prokerData, setProkerData] = useState(getProkerFromStorage());
  const [newProker, setNewProker] = useState('');
  const [editingProker, setEditingProker] = useState({ org: null, idx: null, value: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const storedOrganizations = JSON.parse(localStorage.getItem('organizations'));
    if (storedOrganizations) {
      setOrganizations(storedOrganizations);
    } else {
      localStorage.setItem('organizations', JSON.stringify(initialOrganizations));
    }
  }, []);

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
    <div style={{ padding: '2rem', maxWidth: 1600, margin: '0 auto' }}>
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
              <th style={{ padding: 8 }}>Nama Organisasi</th>
              <th style={{ padding: 8 }}>Deskripsi</th>
              <th style={{ padding: 8 }}>Proker</th>
              {role === 'admin' && <th style={{ padding: 8 }}>Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {filteredOrganizations.map(org => (
              <tr key={org.id}>
                <td style={{ padding: 8 }}>{org.name}</td>
                <td style={{ padding: 8 }}>{org.description}</td>
                <td style={{ padding: 8, minWidth: 180 }}>
                  {role === 'admin' && (
                    <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                      <button onClick={() => navigate(`/add-proker/${org.name}`)} style={{ background: '#800000', color: 'white', border: 'none', borderRadius: 4, padding: '2px 8px', fontSize: 13 }}>
                        Tambah Proker
                      </button>
                      <button onClick={() => navigate('/proker-management')} style={{ background: '#008000', color: 'white', border: 'none', borderRadius: 4, padding: '2px 8px', fontSize: 13 }}>
                        Lihat Proker
                      </button>
                    </div>
                  )}
                </td>
                {role === 'admin' && <td style={{ padding: 8 }}>
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