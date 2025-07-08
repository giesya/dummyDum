import React, { useState, useEffect } from 'react';
import { getRole, getUser } from '../services/auth';
import { updateHistoryItem } from './History';

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

// Tambahkan fungsi untuk mengambil data dari localStorage
function getHistoryData() {
  const data = localStorage.getItem('history_data');
  if (data) return JSON.parse(data);
  return dummyData;
}

const ApprovalAll = () => {
  const [jenis, setJenis] = useState('Semua');
  const [status, setStatus] = useState('Semua');
  const [search, setSearch] = useState('');
  // Ganti inisialisasi data agar ambil dari localStorage
  const [data, setData] = useState(getHistoryData());
  const [signed, setSigned] = useState({});
  const [notif, setNotif] = useState('Ada dokumen baru masuk!');
  const [komentar, setKomentar] = useState({});
  const [signedFile, setSignedFile] = useState({});
  const role = getRole();
  const user = getUser();

  // Tambahkan efek untuk update data jika ada perubahan di localStorage
  useEffect(() => {
    const updateData = () => {
      setData(getHistoryData());
    };
    window.addEventListener('storage', updateData);
    return () => window.removeEventListener('storage', updateData);
  }, []);

  // Untuk mahasiswa, filter hanya dokumen milik user login
  let userDocs = [];
  if (jenis === 'Semua') {
    // Gabungkan semua dokumen dari semua jenis
    Object.keys(data).forEach(j => {
      userDocs = userDocs.concat(data[j].filter(item => role === 'admin' || item.pengaju.email === user));
    });
  } else {
    userDocs = data[jenis].filter(item => role === 'admin' || item.pengaju.email === user);
  }
  // Filter status
  if (status !== 'Semua') {
    userDocs = userDocs.filter(item => item.status === status);
  }
  // Filter search
  if (search.trim()) {
    const s = search.trim().toLowerCase();
    userDocs = userDocs.filter(item =>
      item.name.toLowerCase().includes(s) ||
      item.pengaju.nama.toLowerCase().includes(s) ||
      item.pengaju.email.toLowerCase().includes(s) ||
      item.pengaju.afiliasi.toLowerCase().includes(s)
    );
  }

  if (role !== 'admin' && role !== 'mahasiswa') {
    return <div style={{ padding: '2rem', textAlign: 'center', color: '#d32f2f', fontWeight: 'bold' }}>Akses tidak diizinkan.</div>;
  }

  const handleAction = (id, status) => {
    if (jenis === 'Semua') {
      // Cari jenis dokumen yang mengandung dokumen dengan id tersebut
      let foundJenis = null;
      Object.keys(data).forEach(j => {
        if (data[j].some(item => item.id === id)) {
          foundJenis = j;
        }
      });
      if (foundJenis) {
        setData(prev => ({
          ...prev,
          [foundJenis]: prev[foundJenis].map(p => p.id === id ? { ...p, status, komentar: komentar[id] || '', signedFile: signedFile[id] || '' } : p)
        }));
        updateHistoryItem(foundJenis, id, { status, komentar: komentar[id] || '', signedFile: signedFile[id] || '' });
      }
    } else {
      setData(prev => ({
        ...prev,
        [jenis]: prev[jenis].map(p => p.id === id ? { ...p, status, komentar: komentar[id] || '', signedFile: signedFile[id] || '' } : p)
      }));
      updateHistoryItem(jenis, id, { status, komentar: komentar[id] || '', signedFile: signedFile[id] || '' });
    }
    setNotif('');
  };

  const handleSign = id => {
    setSigned(s => ({ ...s, [id]: { name: user, date: new Date().toLocaleString() } }));
  };

  const handleKomentar = (id, value) => {
    setKomentar(k => ({ ...k, [id]: value }));
  };

  const handleSignedFile = (id, file) => {
    setSignedFile(f => ({ ...f, [id]: file ? file.name : '' }));
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 1000, margin: '0 auto' }}>
      <h2>Approval Dokumen</h2>
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
            placeholder="Cari nama dokumen, pengaju, afiliasi..."
            style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
          />
        </div>
      </div>
      {notif && role === 'admin' && <div style={{ background: '#FFD700', color: '#800000', padding: 10, borderRadius: 6, marginBottom: 18, fontWeight: 'bold' }}>{notif}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <thead style={{ background: '#eee' }}>
          <tr>
            <th style={{ padding: 12, textAlign: 'left' }}>Nama Dokumen</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Pengaju</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Afiliasi</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Dokumen</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Status</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Tanda Tangan</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Aksi / Hasil</th>
          </tr>
        </thead>
        <tbody>
          {userDocs.length === 0 && (
            <tr><td colSpan={7} style={{ textAlign: 'center', color: '#888', padding: 24 }}>Tidak ada dokumen.</td></tr>
          )}
          {userDocs.map(item => (
            <tr key={item.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: 12 }}>{item.name}</td>
              <td style={{ padding: 12 }}>{item.pengaju.nama}<br/><span style={{ fontSize: 13, color: '#888' }}>{item.pengaju.email}</span></td>
              <td style={{ padding: 12 }}>{item.pengaju.afiliasi}</td>
              <td style={{ padding: 12 }}>
                <a href={'/uploads/' + item.dokumen} target="_blank" rel="noopener noreferrer">{item.dokumen}</a>
              </td>
              <td style={{ padding: 12 }}>{item.status}</td>
              <td style={{ padding: 12 }}>
                {item.status === 'Disetujui' && (signed[item.id] || item.signedFile) && (
                  <span style={{ color: '#008000', fontWeight: 'bold' }}>
                    Ditandatangani oleh {signed[item.id]?.name || 'Admin'} <br/> pada {signed[item.id]?.date || '---'}
                  </span>
                )}
              </td>
              <td style={{ padding: 12, minWidth: 220 }}>
                {role === 'admin' ? (
                  <>
                    {item.status === 'Menunggu' && (
                      <>
                        <button onClick={() => handleAction(item.id, 'Disetujui')} style={{ background: '#008000', color: 'white', border: 'none', borderRadius: 4, padding: '6px 12px', marginRight: 8 }}>Setujui</button>
                        <button onClick={() => handleAction(item.id, 'Ditolak')} style={{ background: '#d32f2f', color: 'white', border: 'none', borderRadius: 4, padding: '6px 12px', marginRight: 8 }}>Tolak</button>
                        <div style={{ marginTop: 8 }}>
                          <textarea placeholder="Komentar jika ada kekurangan" value={komentar[item.id] || ''} onChange={e => handleKomentar(item.id, e.target.value)} style={{ width: '100%', borderRadius: 4, border: '1px solid #ccc', padding: 6, fontSize: 14 }} />
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <label style={{ fontSize: 13, color: '#444' }}>Upload dokumen hasil ttd:</label>
                          <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*" onChange={e => handleSignedFile(item.id, e.target.files[0])} style={{ marginTop: 4 }} />
                        </div>
                      </>
                    )}
                    {item.status === 'Disetujui' && (signedFile[item.id] || item.signedFile) && (
                      <div style={{ marginTop: 8, color: '#008000', fontSize: 14 }}>Dokumen hasil ttd: <a href={'/uploads/' + (signedFile[item.id] || item.signedFile)} download style={{ color: '#008000', fontWeight: 'bold' }}>{signedFile[item.id] || item.signedFile}</a></div>
                    )}
                    {item.status === 'Ditolak' && (komentar[item.id] || item.komentar) && (
                      <div style={{ marginTop: 8, color: '#d32f2f', fontSize: 14 }}>Komentar: {komentar[item.id] || item.komentar}</div>
                    )}
                  </>
                ) : (
                  <>
                    {item.status === 'Disetujui' && (item.signedFile || signedFile[item.id]) && (
                      <div style={{ color: '#008000', fontSize: 14 }}>Dokumen hasil ttd: <a href={'/uploads/' + (item.signedFile || signedFile[item.id])} download style={{ color: '#008000', fontWeight: 'bold' }}>{item.signedFile || signedFile[item.id]}</a></div>
                    )}
                    {item.status === 'Ditolak' && (item.komentar || komentar[item.id]) && (
                      <div style={{ color: '#d32f2f', fontSize: 14 }}>Komentar: {item.komentar || komentar[item.id]}</div>
                    )}
                    {item.status === 'Menunggu' && (
                      <span style={{ color: '#888', fontSize: 14 }}>Menunggu persetujuan admin...</span>
                    )}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ApprovalAll; 