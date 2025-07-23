import React, { useEffect, useState } from 'react';
import proposalAdm from '../assets/proposal-adm.png';
import peminjamanAdm from '../assets/peminjaman-adm.png';
import TAKKolektifAdm from '../assets/TAKKolektif-adm.png';
import ttdAdm from '../assets/ttd-adm.png';
import pengaduanAdm from '../assets/pengaduan-adm.png';

const cardData = [
  {
    title: 'Proposal Kegiatan/Dana',
    img: proposalAdm,
    key: 'Proposal',
    bg: '#f5f5f5',
  },
  {
    title: 'Peminjaman Tempat',
    img: peminjamanAdm,
    key: 'Peminjaman Tempat',
    bg: '#f5f5f5',
  },
  {
    title: 'TAK Kolektif',
    img: TAKKolektifAdm,
    key: 'TAK Kolektif',
    bg: '#f5f5f5',
  },
  {
    title: 'Penandatanganan',
    img: ttdAdm,
    key: 'Penandatanganan Dokumen',
    bg: '#f5f5f5',
  },
  {
    title: 'Pengaduan/Aspirasi',
    img: pengaduanAdm,
    key: 'Pengaduan/Aspirasi',
    bg: '#f5f5f5',
  },
];

const Dashboard = () => {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    // Ambil data dari localStorage
    const data = JSON.parse(localStorage.getItem('history_data') || '{}');
    const newCounts = {};
    cardData.forEach(card => {
      newCounts[card.key] = Array.isArray(data[card.key]) ? data[card.key].filter(item => item.status === 'Menunggu').length : 0;
    });
    setCounts(newCounts);
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: 1600, margin: '0 auto' }}>
      <h2 style={{ color: '#800000', fontWeight: 800, marginBottom: 32 }}>Dashboard Admin</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, justifyContent: 'center', marginBottom: 40 }}>
        {cardData.map(card => (
          <div key={card.key} style={{ background: card.bg, borderRadius: 16, boxShadow: '0 2px 12px #80000011', padding: 32, minWidth: 220, maxWidth: 260, flex: '1 1 220px', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative' }}>
            <img src={card.img} alt={card.title} style={{ width: 80, height: 80, objectFit: 'contain', marginBottom: 18 }} />
            <div style={{ fontSize: 18, fontWeight: 700, color: '#800000', textAlign: 'center', marginBottom: 10 }}>{card.title}</div>
            <div style={{ fontSize: 38, fontWeight: 800, color: '#d32f2f', marginBottom: 0 }}>{counts[card.key] ?? 0}</div>
            <div style={{ fontSize: 14, color: '#888', marginTop: 2 }}>Menunggu Persetujuan</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard; 