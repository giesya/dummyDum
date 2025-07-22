import React, { useState } from 'react';
import Modal from '../components/Modal';
import { getRole, getUser } from '../services/auth';
import { FaSearch } from 'react-icons/fa';

const initialMembers = [
  { id: 1, name: 'Andi', organization: 'HIMAIF', email: 'andi@student.telkomuniversity.ac.id', role: 'anggota' },
  { id: 2, name: 'Budi', organization: 'HIMADS', email: 'budi@student.telkomuniversity.ac.id', role: 'anggota' },
  { id: 3, name: 'Citra', organization: 'HMRPL', email: 'citra@student.telkomuniversity.ac.id', role: 'anggota' },
  { id: 4, name: 'Gisa', organization: 'HMIT', email: 'gisasyahla@student.telkomuniversity.ac.id', role: 'anggota' }
];

const Members = () => {
  const [open, setOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [form, setForm] = useState({ name: '', organization: '', email: '' });
  const [members, setMembers] = useState(initialMembers);
  const [editMember, setEditMember] = useState(null);
  const [deleteMember, setDeleteMember] = useState(null);
  const [search, setSearch] = useState('');
  const role = getRole();
  const user = getUser();

  // Ambil organisasi user (dari anggota yang email-nya sama dengan user login)
  const userOrg = role === 'admin' ? null : (members.find(m => m.email === user)?.organization || '');

  // Tambah
  const handleAdd = () => setOpen(true);
  const handleClose = () => { setOpen(false); setForm({ name: '', organization: '', email: '' }); };
  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleSubmit = e => {
    e.preventDefault();
    setMembers(m => [
      ...m,
      { id: Date.now(), ...form }
    ]);
    handleClose();
  };

  // Edit
  const handleEdit = member => {
    setEditMember(member);
    setForm({ name: member.name, organization: member.organization, email: member.email });
    setEditOpen(true);
  };
  const handleEditClose = () => { setEditOpen(false); setEditMember(null); setForm({ name: '', organization: '', email: '' }); };
  const handleEditSubmit = e => {
    e.preventDefault();
    setMembers(m => m.map(mem => mem.id === editMember.id ? { ...mem, ...form } : mem));
    handleEditClose();
  };

  // Hapus
  const handleDelete = member => { setDeleteMember(member); setDeleteOpen(true); };
  const handleDeleteClose = () => { setDeleteOpen(false); setDeleteMember(null); };
  const handleDeleteConfirm = () => {
    setMembers(m => m.filter(mem => mem.id !== deleteMember.id));
    handleDeleteClose();
  };

  // Cek apakah user boleh edit/hapus anggota tertentu
  const canEditDelete = member => {
    if (role === 'admin') return true;
    return member.organization === userOrg;
  };

  const handleSetAdminHima = member => {
    setMembers(members => members.map(mem =>
      mem.id === member.id
        ? { ...mem, role: mem.role === 'admin_hima' ? 'anggota' : 'admin_hima' }
        : mem
    ));
  };

  // Filter members by search
  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  );

  // Group filtered members by organization
  let groupedMembers = filteredMembers.reduce((acc, member) => {
    if (!acc[member.organization]) acc[member.organization] = [];
    acc[member.organization].push(member);
    return acc;
  }, {});
  // For admin, only show HIMAIF, HIMADS, HMIT, HMRPL
  if (role === 'admin') {
    const allowedOrgs = ['HIMAIF', 'HIMADS', 'HMIT', 'HMRPL'];
    groupedMembers = Object.fromEntries(
      Object.entries(groupedMembers).filter(([org]) => allowedOrgs.includes(org))
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 1600, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 8 }}>
        <h2>Manajemen Anggota</h2>
        <button onClick={handleAdd} style={{ background: '#800000', color: 'white', border: 'none', borderRadius: 4, padding: '8px 16px', fontWeight: 'bold', cursor: 'pointer' }}>+ Tambah Anggota</button>
      </div>
      <div style={{ margin: '18px 0 0 0', maxWidth: 350, position: 'relative' }}>
        <FaSearch style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#888', fontSize: 16 }} />
        <input
          type="text"
          placeholder="Cari nama atau email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', padding: '8px 8px 8px 34px', borderRadius: 4, border: '1px solid #ccc' }}
        />
      </div>
      <div style={{ marginTop: 24 }}>
        {Object.keys(groupedMembers).length === 0 && <div style={{ color: '#888', textAlign: 'center' }}>Belum ada anggota</div>}
        {Object.entries(groupedMembers).map(([org, orgMembers]) => (
          <div key={org} style={{ marginBottom: 36 }}>
            <h3 style={{ color: '#800000', marginBottom: 10 }}>{org}</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <thead style={{ background: '#eee' }}>
            <tr>
              <th style={{ padding: 12, textAlign: 'left' }}>Nama</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Email</th>
              <th style={{ padding: 12, textAlign: 'left' }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
                {orgMembers.map(member => (
              <tr key={member.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: 12 }}>{member.name}</td>
                <td style={{ padding: 12 }}>{member.email}</td>
                <td style={{ padding: 12 }}>
                  {canEditDelete(member) && (
                    <>
                      <button style={{ background: '#FFD700', color: '#800000', border: 'none', borderRadius: 4, padding: '4px 10px', marginRight: 6, fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleEdit(member)}>Edit</button>
                      <button style={{ background: '#d32f2f', color: 'white', border: 'none', borderRadius: 4, padding: '4px 10px', fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleDelete(member)}>Hapus</button>
                      {role === 'admin' && ['HIMAIF','HIMADS','HMIT','HMRPL'].includes(member.organization) && (
                        <button style={{ background: member.role === 'admin_hima' ? '#aaa' : '#008000', color: 'white', border: 'none', borderRadius: 4, padding: '4px 10px', fontWeight: 'bold', cursor: 'pointer', marginLeft: 6 }} onClick={() => handleSetAdminHima(member)}>
                          {member.role === 'admin_hima' ? 'Cabut Admin HIMA' : 'Jadikan Admin HIMA'}
                        </button>
                      )}
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
          </div>
        ))}
      </div>
      <Modal open={open} onClose={handleClose} title="Tambah Anggota">
        <form onSubmit={handleSubmit}>
          <label>Nama</label>
          <input name="name" value={form.name} onChange={handleChange} required />
          <label>Organisasi</label>
          {role === 'admin' ? (
            <select name="organization" value={form.organization} onChange={handleChange} required>
              <option value="">Pilih organisasi</option>
              <option value="HIMAIF">HIMAIF</option>
              <option value="HIMADS">HIMADS</option>
              <option value="HMIT">HMIT</option>
              <option value="HMRPL">HMRPL</option>
            </select>
          ) : (
            <input name="organization" value={form.organization} onChange={handleChange} required />
          )}
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button type="submit">Simpan</button>
            <button type="button" style={{ background: '#aaa', color: '#fff' }} onClick={handleClose}>Batal</button>
          </div>
        </form>
      </Modal>
      <Modal open={editOpen} onClose={handleEditClose} title="Edit Anggota">
        <form onSubmit={handleEditSubmit}>
          <label>Nama</label>
          <input name="name" value={form.name} onChange={handleChange} required />
          <label>Organisasi</label>
          {role === 'admin' ? (
            <select name="organization" value={form.organization} onChange={handleChange} required>
              <option value="">Pilih organisasi</option>
              <option value="HIMAIF">HIMAIF</option>
              <option value="HIMADS">HIMADS</option>
              <option value="HMIT">HMIT</option>
              <option value="HMRPL">HMRPL</option>
            </select>
          ) : (
            <input name="organization" value={form.organization} onChange={handleChange} required />
          )}
          <label>Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required />
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <button type="submit">Simpan</button>
            <button type="button" style={{ background: '#aaa', color: '#fff' }} onClick={handleEditClose}>Batal</button>
          </div>
        </form>
      </Modal>
      <Modal open={deleteOpen} onClose={handleDeleteClose} title="Hapus Anggota">
        <div style={{ marginBottom: 18 }}>
          Yakin ingin menghapus anggota <b>{deleteMember?.name}</b>?
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button style={{ background: '#d32f2f' }} onClick={handleDeleteConfirm}>Hapus</button>
          <button type="button" style={{ background: '#aaa', color: '#fff' }} onClick={handleDeleteClose}>Batal</button>
        </div>
      </Modal>
    </div>
  );
};

export default Members; 