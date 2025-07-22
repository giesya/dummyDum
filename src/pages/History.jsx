import React, { useState } from 'react';
import { getUser } from '../services/auth';

const DOKUMEN_TYPES = [
  'Semua',
  'Proposal',
  'Laporan',
  'Peminjaman Tempat',
  'TAK Kolektif',
  'Penandatanganan Dokumen',
  'Pengaduan/Aspirasi',
];
const STATUS_OPTIONS = ['Semua', 'Menunggu', 'Disetujui', 'Ditolak'];

const dummyData = {
  Proposal: [
    {
      id: 1,
      name: 'Seminar Nasional',
      status: 'Disetujui',
      pengaju: { nama: 'Budi', email: 'budi@student.telkomuniversity.ac.id', afiliasi: 'HIMAIF' },
      dokumen: 'proposal-seminar.pdf',
      komentar: '',
      signedFile: 'proposal-seminar-signed.pdf',
    },
    {
      id: 7,
      name: 'Kompetisi Coding',
      status: 'Ditolak',
      pengaju: { nama: 'gisa', email: 'gisa@student.telkomuniversity.ac.id', afiliasi: 'HMRPL' },
      dokumen: 'kompetisi-coding.pdf',
      komentar: 'Dokumen kurang lengkap',
      signedFile: '',
    },
  ],
  Laporan: [
    {
      id: 2,
      name: 'Laporan Seminar Nasional',
      status: 'Menunggu',
      pengaju: { nama: 'Citra', email: 'citra@student.telkomuniversity.ac.id', afiliasi: 'HMRPL' },
      dokumen: 'laporan-seminar.pdf',
      komentar: '',
      signedFile: '',
    },
  ],
  'Peminjaman Tempat': [
    {
      id: 3,
      name: 'Peminjaman Aula',
      status: 'Menunggu',
      pengaju: { nama: 'Dewi', email: 'dewi@student.telkomuniversity.ac.id', afiliasi: 'Lab' },
      dokumen: 'peminjaman-aula.pdf',
      komentar: '',
      signedFile: '',
    },
  ],
  'TAK Kolektif': [
    {
      id: 4,
      name: 'TAK Pengurus HIMAIF',
      status: 'Menunggu',
      pengaju: { nama: 'Eka', email: 'eka@student.telkomuniversity.ac.id', afiliasi: 'HIMAIF' },
      dokumen: 'tak-himaif.pdf',
      komentar: '',
      signedFile: '',
    },
  ],
  'Penandatanganan Dokumen': [
    {
      id: 5,
      name: 'LPJ Seminar Nasional',
      status: 'Menunggu',
      pengaju: { nama: 'Fajar', email: 'fajar@student.telkomuniversity.ac.id', afiliasi: 'HIMAIF' },
      dokumen: 'lpj-seminar.pdf',
      komentar: '',
      signedFile: '',
    },
  ],
  'Pengaduan/Aspirasi': [
    {
      id: 6,
      name: 'Aspirasi Fasilitas',
      status: 'Menunggu',
      pengaju: { nama: 'Gita', email: 'gita@student.telkomuniversity.ac.id', afiliasi: 'HMRPL' },
      dokumen: 'aspirasi-fasilitas.pdf',
      komentar: '',
      signedFile: '',
    },
  ],
};



function getHistoryData() {
  const data = localStorage.getItem('history_data');
  if (data) return JSON.parse(data);
  return dummyData;
}

function addHistoryItem(jenis, item) {
  const data = getHistoryData();
  if (!data[jenis]) data[jenis] = [];
  data[jenis].push(item);
  localStorage.setItem('history_data', JSON.stringify(data));
}

  function updateHistoryItem(jenis, id, updateObj) {
  const data = getHistoryData();
  if (!data[jenis]) return;
  data[jenis] = data[jenis].map(item =>
    item.id === id ? { ...item, ...updateObj } : item
  );
  localStorage.setItem('history_data', JSON.stringify(data));
}

const History = () => {
  const [jenis, setJenis] = useState('Semua');
  const [status, setStatus] = useState('Semua');
  const [search, setSearch] = useState('');
  const user = getUser();

  // Ambil data dari localStorage
  const data = getHistoryData();
  let userDocs = [];
  if (jenis === 'Semua') {
    // Gabungkan semua dokumen dari semua jenis
    Object.keys(data).forEach(j => {
      userDocs = userDocs.concat(data[j].filter(item => item.pengaju.email === user));
    });
  } else {
    userDocs = data[jenis].filter(item => item.pengaju.email === user);
  }
  if (status !== 'Semua') {
    userDocs = userDocs.filter(item => item.status === status);
  }
  if (search.trim()) {
    const s = search.trim().toLowerCase();
    userDocs = userDocs.filter(item =>
      item.name.toLowerCase().includes(s) ||
      item.pengaju.nama.toLowerCase().includes(s) ||
      item.pengaju.email.toLowerCase().includes(s) ||
      item.pengaju.afiliasi.toLowerCase().includes(s)
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: 1600, margin: '0 auto' }}>
      <h2>Riwayat Pengajuan Saya</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', marginBottom: 18 }}>
        <div>
          <label style={{ fontWeight: 500, marginRight: 10 }}>Jenis dokumen:</label>
          <select value={jenis} onChange={e => setJenis(e.target.value)} style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', minWidth: 180 }}>
            {DOKUMEN_TYPES.map(j => <option key={j} value={j}>{j}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontWeight: 500, marginRight: 10 }}>Status:</label>
          <select value={status} onChange={e => setStatus(e.target.value)} style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', minWidth: 120 }}>
            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cari nama dokumen, afiliasi..."
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          />
        </div>
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <thead style={{ background: '#eee' }}>
          <tr>
            <th style={{ padding: 12, textAlign: 'left' }}>Nama Dokumen</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Afiliasi</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Dokumen</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Status</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Komentar</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Hasil/Unduh</th>
          </tr>
        </thead>
        <tbody>
          {userDocs.length === 0 && (
            <tr><td colSpan={6} style={{ textAlign: 'center', color: '#888', padding: 24 }}>Tidak ada dokumen.</td></tr>
          )}
          {userDocs.map(item => (
            <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: 12 }}>{item.name}</td>
              <td style={{ padding: 12 }}>{item.pengaju.afiliasi}</td>
              <td style={{ padding: 12 }}>
                <a href={'/uploads/' + item.dokumen} target="_blank" rel="noopener noreferrer">{item.dokumen}</a>
              </td>
              <td style={{ padding: 12 }}>{item.status}</td>
              <td style={{ padding: 12, color: item.status === 'Ditolak' ? '#d32f2f' : '#888' }}>{item.komentar || '-'}</td>
              <td style={{ padding: 12 }}>
                {item.status === 'Disetujui' && item.signedFile && (
                  <a href={'/uploads/' + item.signedFile} download style={{ color: '#008000', fontWeight: 'bold' }}>Unduh hasil ttd</a>
                )}
                {item.status === 'Menunggu' && (
                  <span style={{ color: '#888', fontSize: 14 }}>Menunggu persetujuan admin...</span>
                )}
                {item.status === 'Ditolak' && (
                  <span style={{ color: '#d32f2f', fontSize: 14 }}>Ditolak</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
export { addHistoryItem, updateHistoryItem };