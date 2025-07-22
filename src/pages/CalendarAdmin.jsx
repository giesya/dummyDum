import React, { useState, useEffect } from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import id from 'date-fns/locale/id';
registerLocale('id', id);
import 'react-datepicker/dist/react-datepicker.css';
import { updateHistoryItem } from './History';
import '../styles/CalendarAdmin.css';

const getAllActivities = () => {
  const data = JSON.parse(localStorage.getItem('history_data')) || {};
  let arr = [];
  [
    'Proposal',
    'Peminjaman Tempat',
    'Penandatanganan Dokumen',
    'TAK Kolektif',
    'Pengaduan/Aspirasi'
  ].forEach(jenis => {
    if (Array.isArray(data[jenis])) {
      arr = arr.concat(data[jenis].map(item => ({ ...item, jenis })));
    }
  });
  return arr;
};

const CalendarAdmin = () => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [activities, setActivities] = useState(getAllActivities());
  const [filtered, setFiltered] = useState([]);
  const [komentar, setKomentar] = useState({});
  const [signedFile, setSignedFile] = useState({});

  useEffect(() => {
    const syncActivities = () => setActivities(getAllActivities());
    window.addEventListener('storage', syncActivities);
    
    if (selectedDate) {
      const dateStr = selectedDate.toISOString().slice(0, 10);
      setFiltered(
        activities.filter(
          act =>
            act.tanggalKegiatan &&
            (typeof act.tanggalKegiatan === 'string'
              ? act.tanggalKegiatan.slice(0, 10)
              : new Date(act.tanggalKegiatan).toISOString().slice(0, 10)
            ) === dateStr
        )
      );
    } else {
      setFiltered([]);
    }

    return () => window.removeEventListener('storage', syncActivities);
  }, [selectedDate, activities]);

  const handleAction = (id, status) => {
    const act = activities.find(a => a.id === id);
    if (!act || !act.jenis) return;
    // Update ke history_data agar sinkron dengan approval dokumen
    updateHistoryItem(
      act.jenis,
      id,
      { status, komentar: komentar[id] || '', signedFile: signedFile[id] || '' }
    );
    // Refresh activities dari history_data
    setActivities(getAllActivities());
  };

  const handleKomentar = (id, value) => {
    setKomentar(k => ({ ...k, [id]: value }));
  };

  const handleSignedFile = (id, file) => {
    setSignedFile(f => ({ ...f, [id]: file ? file.name : '' }));
  };

  const activityDates = activities
    .map(act => act.tanggalKegiatan ? new Date(act.tanggalKegiatan) : null)
    .filter(Boolean);

  const dayClassName = (date) => {
    const hasActivity = activityDates.some(
      (activityDate) =>
        date.getFullYear() === activityDate.getFullYear() &&
        date.getMonth() === activityDate.getMonth() &&
        date.getDate() === activityDate.getDate()
    );
    return hasActivity ? 'react-datepicker__day--highlighted-activity' : null;
  };

  return (
    <div style={{ padding: 32 }} className="calendar-admin-container">
      <h2>Kalender Kegiatan</h2>
      <DatePicker
        selected={selectedDate}
        onChange={date => setSelectedDate(date)}
        dateFormat="dd/MM/yyyy"
        minDate={new Date(2025, 6, 1)}
        maxDate={new Date(2026, 6, 31)}
        inline
        showMonthDropdown
        showYearDropdown
        dropdownMode="select"
        locale="id"
        formatWeekDay={nameOfDay => nameOfDay.substr(0, 3)}
        highlightDates={activityDates}
        dayClassName={dayClassName}
      />
      <div style={{ marginTop: 32 }}>
        <h3>Kegiatan pada {selectedDate ? selectedDate.toLocaleDateString() : '-'}</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24 }}>
            <thead>
            <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Nama Dokumen</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Pengajuan</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Afiliasi</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Dokumen</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Status</th>
                <th style={{ padding: 8, border: '1px solid #ddd' }}>Aksi / Hasil</th>
                
            </tr>
            </thead>
            <tbody>
            {filtered.length === 0 ? (
                <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 16 }}>Tidak ada kegiatan.</td>
                </tr>
            ) : (
                filtered.map((act, idx) => (
                <tr key={act.id || idx}>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{act.name}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{act.pengaju?.nama || '-'}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{act.pengaju?.afiliasi || '-'}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>
                    {act.dokumen ? (
                        <a href={act.dokumen} target="_blank" rel="noopener noreferrer">{act.dokumen}</a>
                    ) : '-'}
                    </td>
                    <td style={{ padding: 8, border: '1px solid #ddd' }}>{act.status}</td>
                    <td style={{ padding: 8, border: '1px solid #ddd', minWidth: 220 }}>
                    {act.status === 'Menunggu' && (
                      <>
                        <button onClick={() => handleAction(act.id, 'Disetujui')} style={{ background: '#008000', color: 'white', border: 'none', borderRadius: 4, padding: '6px 12px', marginRight: 8 }}>Setujui</button>
                        <button onClick={() => handleAction(act.id, 'Ditolak')} style={{ background: '#d32f2f', color: 'white', border: 'none', borderRadius: 4, padding: '6px 12px', marginRight: 8 }}>Tolak</button>
                        <div style={{ marginTop: 8 }}>
                          <textarea
                            placeholder="Komentar jika ada kekurangan"
                            value={komentar[act.id] || ''}
                            onChange={e => handleKomentar(act.id, e.target.value)}
                            style={{ width: '100%', borderRadius: 4, border: '1px solid #ccc', padding: 6, fontSize: 14 }}
                          />
                        </div>
                        <div style={{ marginTop: 8 }}>
                          <label style={{ fontSize: 13, color: '#444' }}>Upload dokumen hasil ttd:</label>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,image/*"
                            onChange={e => handleSignedFile(act.id, e.target.files[0])}
                            style={{ marginTop: 4 }}
                          />
                        </div>
                      </>
                    )}
                    {act.status === 'Disetujui' && (signedFile[act.id] || act.signedFile) && (
                      <div style={{ marginTop: 8, color: '#008000', fontSize: 14 }}>
                        Dokumen hasil ttd: <b>{signedFile[act.id] || act.signedFile}</b>
                      </div>
                    )}
                    {act.status === 'Ditolak' && (komentar[act.id] || act.komentar) && (
                      <div style={{ marginTop: 8, color: '#d32f2f', fontSize: 14 }}>
                        Komentar: {komentar[act.id] || act.komentar}
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
    </div>
  );
};

export default CalendarAdmin;