import React from 'react';

const Dashboard = () => {
  return (
    <div style={{ padding: '2rem', maxWidth: 1600, margin: '0 auto' }}>
      <h1>Urusan Kemahasiswaan Fakultas Informatika</h1>
      <p style={{ fontSize: 17, margin: '18px 0 10px 0' }}>
        Pengajuan proposal, TAK, izin tempat, dan pengaduan lainnya.<br/>
        Template dokumen dapat diakses di:<br/>
        <a href="https://tel-u.ac.id/template-kmh-fif" target="_blank" rel="noopener noreferrer" style={{ color: '#800000', fontWeight: 'bold' }}>
          https://tel-u.ac.id/template-kmh-fif
        </a>
      </p>
      <p style={{ fontSize: 17, margin: '18px 0 10px 0' }}>
        Hasil yang sudah dittd dapat dicek di:<br/>
        <a href="https://tel-u.ac.id/form-kmh-fif-result" target="_blank" rel="noopener noreferrer" style={{ color: '#800000', fontWeight: 'bold' }}>
          https://tel-u.ac.id/form-kmh-fif-result
        </a>
      </p>
    </div>
  );
};

export default Dashboard; 