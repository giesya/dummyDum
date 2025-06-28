import React, { useState } from 'react';
import { getRole, getUser } from '../services/auth';

const initialReports = [
  {
    id: 1,
    name: 'Laporan Seminar Nasional',
    status: 'Menunggu',
    pengaju: {
      nama: 'Budi',
      email: 'budi@student.telkomuniversity.ac.id',
      afiliasi: 'HIMAIF',
    },
    dokumen: 'laporan-seminar.pdf',
    komentar: '',
    signedFile: '',
  },
  {
    id: 2,
    name: 'Laporan Lomba Futsal',
    status: 'Menunggu',
    pengaju: {
      nama: 'Citra',
      email: 'citra@student.telkomuniversity.ac.id',
      afiliasi: 'HMRPL',
    },
    dokumen: 'laporan-futsal.pdf',
    komentar: '',
    signedFile: '',
  },
];

const ReportUpload = () => {
  const [reports, setReports] = useState(initialReports);
  const [signed, setSigned] = useState({});
  const [notif, setNotif] = useState('Ada laporan baru masuk!');
  const [komentar, setKomentar] = useState({});
  const [signedFile, setSignedFile] = useState({});
  const role = getRole();
  const user = getUser();

  if (role !== 'admin') {
    // Mahasiswa hanya bisa upload laporan
    return (
      <div style={{ padding: '2rem', maxWidth: 500, margin: '0 auto' }}>
        <h2>Upload Laporan Kegiatan</h2>
        <form style={{ background: 'white', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="reportFile">File Laporan</label>
            <input id="reportFile" type="file" required style={{ width: '100%', marginTop: 4 }} />
          </div>
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="reportDesc">Deskripsi</label>
            <textarea id="reportDesc" required rows={3} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }} />
          </div>
          <button type="submit" style={{ width: '100%', padding: 10, background: '#800000', color: 'white', border: 'none', borderRadius: 4, fontWeight: 'bold' }}>
            Upload Laporan
          </button>
        </form>
      </div>
    );
  }

  // Admin: approval laporan
  const handleAction = (id, status) => {
    setReports(reports.map(r => r.id === id ? { ...r, status, komentar: komentar[id] || '', signedFile: signedFile[id] || '' } : r));
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
    <div style={{ padding: '2rem', maxWidth: 900, margin: '0 auto' }}>
      <h2>Approval Laporan Kegiatan</h2>
      {notif && <div style={{ background: '#FFD700', color: '#800000', padding: 10, borderRadius: 6, marginBottom: 18, fontWeight: 'bold' }}>{notif}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <thead style={{ background: '#eee' }}>
          <tr>
            <th style={{ padding: 12, textAlign: 'left' }}>Nama Laporan</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Pengaju</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Afiliasi</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Dokumen</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Status</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Tanda Tangan</th>
            <th style={{ padding: 12, textAlign: 'left' }}>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {reports.map(report => (
            <tr key={report.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
              <td style={{ padding: 12 }}>{report.name}</td>
              <td style={{ padding: 12 }}>{report.pengaju.nama}<br/><span style={{ fontSize: 13, color: '#888' }}>{report.pengaju.email}</span></td>
              <td style={{ padding: 12 }}>{report.pengaju.afiliasi}</td>
              <td style={{ padding: 12 }}>
                <a href={'/uploads/' + report.dokumen} target="_blank" rel="noopener noreferrer">{report.dokumen}</a>
              </td>
              <td style={{ padding: 12 }}>{report.status}</td>
              <td style={{ padding: 12 }}>
                {report.status === 'Disetujui' && !signed[report.id] && (
                  <button onClick={() => handleSign(report.id)} style={{ background: '#800000', color: 'white', border: 'none', borderRadius: 4, padding: '6px 12px' }}>Bubuhkan Tanda Tangan</button>
                )}
                {signed[report.id] && (
                  <span style={{ color: '#008000', fontWeight: 'bold' }}>
                    Ditandatangani oleh {signed[report.id].name} <br/> pada {signed[report.id].date}
                  </span>
                )}
              </td>
              <td style={{ padding: 12, minWidth: 220 }}>
                {report.status === 'Menunggu' && (
                  <>
                    <button onClick={() => handleAction(report.id, 'Disetujui')} style={{ background: '#008000', color: 'white', border: 'none', borderRadius: 4, padding: '6px 12px', marginRight: 8 }}>Setujui</button>
                    <button onClick={() => handleAction(report.id, 'Ditolak')} style={{ background: '#d32f2f', color: 'white', border: 'none', borderRadius: 4, padding: '6px 12px', marginRight: 8 }}>Tolak</button>
                    <div style={{ marginTop: 8 }}>
                      <textarea placeholder="Komentar jika ada kekurangan" value={komentar[report.id] || ''} onChange={e => handleKomentar(report.id, e.target.value)} style={{ width: '100%', borderRadius: 4, border: '1px solid #ccc', padding: 6, fontSize: 14 }} />
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <label style={{ fontSize: 13, color: '#444' }}>Upload dokumen hasil ttd:</label>
                      <input type="file" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*" onChange={e => handleSignedFile(report.id, e.target.files[0])} style={{ marginTop: 4 }} />
                    </div>
                  </>
                )}
                {report.status === 'Disetujui' && signedFile[report.id] && (
                  <div style={{ marginTop: 8, color: '#008000', fontSize: 14 }}>Dokumen hasil ttd: <b>{signedFile[report.id]}</b></div>
                )}
                {report.status === 'Ditolak' && komentar[report.id] && (
                  <div style={{ marginTop: 8, color: '#d32f2f', fontSize: 14 }}>Komentar: {komentar[report.id]}</div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ReportUpload; 