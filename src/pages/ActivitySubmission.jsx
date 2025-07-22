import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import { addHistoryItem } from './History';
import { getUser } from '../services/auth';
import { useNavigate } from 'react-router-dom';
import './../styles/ActivitySubmission.css';

const AFILIASI_OPTIONS = [
  'HIMAIF',
  'HIMADS',
  'HMIT',
  'HMRPL',
  'Lab',
  'Independen',
];
const JABATAN_HIMA = [
  'Kahim',
  'Wakahim',
  'Sekre',
  'Bendahara',
  'Anggota',
];
const JABATAN_LAB = [
  'Aslab',
  'Asprak',
  'Anggota',
];
const KEPERLUAN_OPTIONS = [
  'Proposal kegiatan/dana',
  'Peminjaman Tempat',
  'TAK Kolektif',
  'Pengaduan / Aspirasi',
  'Penandatanganan dokumen lainnya (LPJ, Proker, dll)',
];
const TIPE_PROPOSAL_OPTIONS = [
  'Kegiatan',
  'Bantuan Kompetisi',
];
const TIPE_AKTIVITAS_OPTIONS = [
  'Pengurus organisasi',
  'Kepanitiaan organisasi',
  'Asisten Dosen / Asisten Lab',
];
const DURASI_KEPANITIAAN_OPTIONS = [
  '10 s.d. 12 bulan',
  '7 s.d. 9 bulan',
  '4 s.d. 6 bulan',
  '1 s.d. 3 bulan',
];

const FILE_ACCEPT = '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,image/*,video/*,audio/*';
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const TEMA_PENGADUAN_OPTIONS = [
  'Laporan Pelanggaran Etika',
  'Aspirasi Umum',
  'Organisasi Kemahasiswaan',
  'Konseling',
  'Lainnya',
];
const FILE_PENGADUAN_ACCEPT = '.doc,.docx,.xls,.xlsx,.ppt,.pptx,.pdf,.zip,.rar,image/*,video/*,audio/*';

const PROKER_OPTIONS = [
  'Penerimaan Anggota Baru',
  'Seminar Nasional',
  'Lomba Futsal',
  'Pelatihan Softskill',
  'Bakti Sosial',
];

const INDEPENDEN_KEGIATAN_OPTIONS = ['Kompetisi', 'Lomba', 'Pelatihan', 'Seminar', 'Lainnya'];

function getProkerFromStorage() {
  const data = localStorage.getItem('organizations');
  return data ? JSON.parse(data) : [];
}

function getMinMaxDate(tahunAjaran) {
  if (tahunAjaran === '2023/2024') {
    return {
      min: new Date(2023, 0, 1),
      max: new Date(2024, 11, 31),
    };
  }
  if (tahunAjaran === '2024/2025') {
    return {
      min: new Date(2024, 0, 1),
      max: new Date(2025, 11, 8),
    };
  }
  return { min: null, max: null };
}

const ActivitySubmission = () => {
  const [activityName, setActivityName] = useState('');
  const [activityDate, setActivityDate] = useState(null);
  const [activityDesc, setActivityDesc] = useState('');
  const [afiliasi, setAfiliasi] = useState('');
  const [jabatan, setJabatan] = useState('');
  const [keperluan, setKeperluan] = useState('');
  const [tipeProposal, setTipeProposal] = useState('');
  const [namaKompetisi, setNamaKompetisi] = useState('');
  const [besaranDana, setBesaranDana] = useState('');
  const [proposalFile, setProposalFile] = useState(null);
  const [ruangan, setRuangan] = useState('');
  const [prokerTerkait, setProkerTerkait] = useState('');
  const [lembarPeminjaman, setLembarPeminjaman] = useState(null);
  const [lembarPeminjamanError, setLembarPeminjamanError] = useState('');
  const [tipeAktivitas, setTipeAktivitas] = useState('');
  const [durasiKepanitiaan, setDurasiKepanitiaan] = useState('');
  const [periodeTak, setPeriodeTak] = useState(null);
  const [tahunAjaran, setTahunAjaran] = useState('');
  const [tanggalMulaiTak, setTanggalMulaiTak] = useState(null);
  const [tanggalSelesaiTak, setTanggalSelesaiTak] = useState(null);
  const [suratTak, setSuratTak] = useState(null);
  const [suratTakError, setSuratTakError] = useState('');
  const [dataMahasiswa, setDataMahasiswa] = useState(null);
  const [dataMahasiswaError, setDataMahasiswaError] = useState('');
  const [temaPengaduan, setTemaPengaduan] = useState('');
  const [ceritaAduan, setCeritaAduan] = useState('');
  const [filePengaduan, setFilePengaduan] = useState(null);
  const [filePengaduanError, setFilePengaduanError] = useState('');
  const [namaDokumen, setNamaDokumen] = useState('');
  const [fileDokumen, setFileDokumen] = useState(null);
  const [fileDokumenError, setFileDokumenError] = useState('');
  const [proker, setProker] = useState('');
  const [kegiatanIndependen, setKegiatanIndependen] = useState('');
  const [prokerList, setProkerList] = useState([]);
  const navigate = useNavigate();
  const { min, max } = getMinMaxDate(tahunAjaran);
  const [tanggalKegiatan, setTanggalKegiatan] = useState(null);
  const [selectedDates, setSelectedDates] = useState([]);

  const handleAddDate = () => {
    if (tanggalKegiatan && !selectedDates.find(d => d.getTime() === tanggalKegiatan.getTime())) {
      setSelectedDates([...selectedDates, tanggalKegiatan].sort((a, b) => a - b));
      setTanggalKegiatan(null);
    }
  };

  const handleRemoveDate = (dateToRemove) => {
    setSelectedDates(selectedDates.filter(d => d.getTime() !== dateToRemove.getTime()));
  };
  

  useEffect(() => {
    if (afiliasi && afiliasi !== 'Independen') {
      const organizations = getProkerFromStorage();
      const org = organizations.find(o => o.name === afiliasi);
      setProkerList(org ? org.proker || [] : []);
    } else {
      setProkerList([]);
    }
  }, [afiliasi]);

  const TAHUN_AJARAN_OPTIONS = [
  { label: '2023/2024', value: '2023/2024' },
  { label: '2024/2025', value: '2024/2025' },
  ];

  const handleSubmit = e => {
    e.preventDefault();
    const user = getUser();

    const handleSubmission = (dates) => {
      dates.forEach((date, index) => {
        let jenis = '';
        let item = {};

        if (keperluan === 'Proposal kegiatan/dana') {
          jenis = 'Proposal';
          item = {
            id: Date.now() + index,
            name: namaKompetisi || activityName || 'Proposal Baru',
            tanggalKegiatan: date.toISOString(),
            status: 'Menunggu',
            pengaju: { nama: user.split('@')[0], email: user, afiliasi },
            afiliasi,
            dokumen: proposalFile ? proposalFile.name : '',
            komentar: '',
            signedFile: '',
          };
        } else if (keperluan === 'Peminjaman Tempat') {
          jenis = 'Peminjaman Tempat';
          item = {
            id: Date.now() + index,
            name: ruangan || 'Peminjaman Tempat',
            tanggalKegiatan: date.toISOString(),
            status: 'Menunggu',
            pengaju: { nama: user.split('@')[0], email: user, afiliasi },
            afiliasi,
            dokumen: lembarPeminjaman ? lembarPeminjaman.name : '',
            komentar: '',
            signedFile: '',
          };
        } else if (keperluan === 'Penandatanganan dokumen lainnya (LPJ, Proker, dll)') {
          jenis = 'Penandatanganan Dokumen';
          item = {
            id: Date.now() + index,
            name: namaDokumen || 'Penandatanganan Dokumen',
            tanggalKegiatan: date.toISOString(),
            status: 'Menunggu',
            pengaju: { nama: user.split('@')[0], email: user, afiliasi },
            afiliasi,
            dokumen: fileDokumen ? fileDokumen.name : '',
            komentar: '',
            signedFile: '',
          };
        } else {
          // Handle other cases that don't use multi-date selection
          if (index > 0) return; // Process only once for non-multi-date types
          if (keperluan === 'TAK Kolektif') {
            jenis = 'TAK Kolektif';
            item = {
              id: Date.now(),
              name: tipeAktivitas || 'TAK Kolektif',
              tanggalKegiatan: tanggalMulaiTak ? tanggalMulaiTak.toISOString() : null,
              status: 'Menunggu',
              pengaju: { nama: user.split('@')[0], email: user, afiliasi },
              afiliasi,
              dokumen: suratTak ? suratTak.name : '',
              komentar: '',
              signedFile: '',
            };
          } else if (keperluan === 'Pengaduan / Aspirasi') {
            jenis = 'Pengaduan/Aspirasi';
            item = {
              id: Date.now(),
              name: temaPengaduan || 'Pengaduan',
              tanggalKegiatan: tanggalKegiatan ? tanggalKegiatan.toISOString() : null,
              status: 'Menunggu',
              pengaju: { nama: user.split('@')[0], email: user, afiliasi },
              afiliasi,
              dokumen: filePengaduan ? filePengaduan.name : '',
              komentar: '',
              signedFile: '',
            };
          }
        }

        if (jenis && item.id) {
          addHistoryItem(jenis, item);
        }
      });

      toast.success('Pengajuan kegiatan berhasil!');
      // Reset form fields
      setActivityName('');
      setActivityDate(null);
      setSelectedDates([]);
      setActivityDesc('');
      setAfiliasi('');
      setJabatan('');
      setKeperluan('');
      setTipeProposal('');
      setNamaKompetisi('');
      setBesaranDana('');
      setProposalFile(null);
      setRuangan('');
      setProkerTerkait('');
      setLembarPeminjaman(null);
      setLembarPeminjamanError('');
      setTipeAktivitas('');
      setDurasiKepanitiaan('');
      setTanggalMulaiTak(null);
      setTanggalSelesaiTak(null);
      setSuratTak(null);
      setSuratTakError('');
      setDataMahasiswa(null);
      setDataMahasiswaError('');
      setTemaPengaduan('');
      setCeritaAduan('');
      setFilePengaduan(null);
      setFilePengaduanError('');
      setNamaDokumen('');
      setFileDokumen(null);
      setFileDokumenError('');
      setProker('');
      setKegiatanIndependen('');
      setTanggalKegiatan(null);

      setTimeout(() => { navigate('/history'); }, 800);
    };

    const datesToSubmit = selectedDates.length > 0 ? selectedDates : (tanggalKegiatan ? [tanggalKegiatan] : []);
    if (datesToSubmit.length > 0) {
      handleSubmission(datesToSubmit);
    } else {
      // Handle cases where date is not required or single date is handled differently
      handleSubmission([new Date()]); // Fallback for items without a specific date
    }
  };

  return (
    <div className="activity-submission-container">
      <h2>Pengajuan Kegiatan</h2>
      <form onSubmit={handleSubmit} className="activity-submission-form">
        <div className="form-row">
          <div className="form-col">
            <label htmlFor="afiliasi">Afiliasi</label>
            <select id="afiliasi" required value={afiliasi} onChange={e => setAfiliasi(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }}>
              <option value="">Pilih afiliasi</option>
              {AFILIASI_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
          {afiliasi && afiliasi !== 'Independen' && (
            <div className="form-col">
              <label htmlFor="jabatan">Role/Jabatan</label>
              <select id="jabatan" required value={jabatan} onChange={e => setJabatan(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }}>
                <option value="">Pilih jabatan</option>
                {(afiliasi === 'Lab' ? JABATAN_LAB : JABATAN_HIMA).map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          )}
        </div>
        <div className="form-row">
          <div className="form-col">
            <label htmlFor="keperluan">Keperluan</label>
            <select id="keperluan" required value={keperluan} onChange={e => setKeperluan(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }}>
              <option value="">Pilih keperluan</option>
              {KEPERLUAN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        </div>
        {keperluan === 'Proposal kegiatan/dana' && (
          <>
            <div className="form-row">
              <div className="form-col">
                {afiliasi && afiliasi !== 'Independen' ? (
                  <div>
                    <label htmlFor="proker">Proker Terkait</label>
                    <select id="proker" required value={proker} onChange={e => setProker(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }}>
                      <option value="">Pilih proker</option>
                      {prokerList.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>
                ) : afiliasi === 'Independen' && (
                  <div>
                    <label htmlFor="kegiatanIndependen">Untuk kegiatan apa</label>
                    <input id="kegiatanIndependen" type="text" required value={kegiatanIndependen} onChange={e => setKegiatanIndependen(e.target.value)} placeholder="Kompetisi, Lomba, dsb" style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }} />
                  </div>
                )}
              </div>
              <div className="form-col">
                <label htmlFor="tipeProposal">Tipe Proposal</label>
                <select id="tipeProposal" required value={tipeProposal} onChange={e => setTipeProposal(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }}>
                  <option value="">Pilih tipe proposal</option>
                  {TIPE_PROPOSAL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-col">
                <label htmlFor="namaKompetisi">Nama kegiatan/kompetisi</label>
                <input id="namaKompetisi" type="text" required value={namaKompetisi} onChange={e => setNamaKompetisi(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }} />
              </div>
              <div className="form-col">
                <label htmlFor="besaranDana">Besaran dana yang diajukan (dalam Rupiah)</label>
                <input id="besaranDana" type="number" min="0" required value={besaranDana} onChange={e => setBesaranDana(e.target.value.replace(/[^0-9]/g, ''))} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-col">
                <label htmlFor="tanggalKegiatanProposal">Tanggal Kegiatan</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <DatePicker
                    id="tanggalKegiatanProposal"
                    selected={tanggalKegiatan}
                    onChange={date => setTanggalKegiatan(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    className="form-control"
                    autoComplete="off"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                  <button type="button" onClick={handleAddDate} style={{ padding: '8px 12px', background: '#008000', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                    Tambah
                  </button>
                </div>
                {selectedDates.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <strong>Tanggal yang dipilih:</strong>
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '5px' }}>
                      {selectedDates.map(date => (
                        <li key={date.getTime()} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px', borderBottom: '1px solid #eee' }}>
                          <span>{date.toLocaleDateString('id-ID')}</span>
                          <button type="button" onClick={() => handleRemoveDate(date)} style={{ background: '#d32f2f', color: 'white', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}>
                            Hapus
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="form-col">
                <label htmlFor="proposalFile">Berkas proposal</label>
                <input id="proposalFile" type="file" required onChange={e => setProposalFile(e.target.files[0])} style={{ width: '100%', marginTop: 4 }} />
                <div style={{ fontSize: 13, color: '#888', marginTop: 6 }}>
                  Yang diupload adalah yang sudah lengkap semua tanda tangan kecuali KaUr Kemahasiswaan dan Dekan.<br/>
                  Berkas fisik tetap diserahkan ke Kemahasiswaan (LAAK FIF, TULT lt 1)
                </div>
                {proposalFile && <div style={{ fontSize: 13, color: '#800000', marginTop: 4 }}>File: {proposalFile.name}</div>}
              </div>
            </div>
          </>
        )}
        {keperluan === 'Peminjaman Tempat' && (
          <>
            <div className="form-row">
              <div className="form-col">
                <label htmlFor="ruangan">Ruangan yang dipinjam</label>
                <textarea id="ruangan" required rows={2} value={ruangan} onChange={e => setRuangan(e.target.value)} placeholder="Jika banyak, pisahkan dengan [enter]" style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }} />
              </div>
              <div className="form-col">
                {afiliasi && afiliasi !== 'Independen' && (
                  <div>
                    <label htmlFor="proker">Proker Terkait</label>
                    <select id="proker" required value={proker} onChange={e => setProker(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }}>
                      <option value="">Pilih proker</option>
                      {prokerList.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>
                )}
              </div>
            </div>
            <div className="form-row">
              <div className="form-col">
                <label htmlFor="tanggalKegiatanPeminjaman">Tanggal Kegiatan</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <DatePicker
                    id="tanggalKegiatanPeminjaman"
                    selected={tanggalKegiatan}
                    onChange={date => setTanggalKegiatan(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    className="form-control"
                    autoComplete="off"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                  <button type="button" onClick={handleAddDate} style={{ padding: '8px 12px', background: '#008000', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                    Tambah
                  </button>
                </div>
                {selectedDates.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <strong>Tanggal yang dipilih:</strong>
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '5px' }}>
                      {selectedDates.map(date => (
                        <li key={date.getTime()} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px', borderBottom: '1px solid #eee' }}>
                          <span>{date.toLocaleDateString('id-ID')}</span>
                          <button type="button" onClick={() => handleRemoveDate(date)} style={{ background: '#d32f2f', color: 'white', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}>
                            Hapus
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="form-col">
                <label htmlFor="lembarPeminjaman">Lembar Peminjaman</label>
                <input id="lembarPeminjaman" type="file" required accept={FILE_ACCEPT} onChange={e => {
                  const file = e.target.files[0];
                  if (file && file.size > MAX_FILE_SIZE) {
                    setLembarPeminjamanError('Ukuran file maksimal 10MB');
                    setLembarPeminjaman(null);
                  } else {
                    setLembarPeminjamanError('');
                    setLembarPeminjaman(file);
                  }
                }} style={{ width: '100%', marginTop: 4 }} />
                <div style={{ fontSize: 13, color: '#888', marginTop: 6 }}>
                  Harus sudah ditanda tangan semua pihak kecuali KaUr Kemahasiswaan dan Logistik<br/>
                  File number limit: 1, Single file size limit: 10MB<br/>
                  Allowed file types: Word, Excel, PPT, PDF, Image, Video, Audio
                </div>
                {lembarPeminjaman && <div style={{ fontSize: 13, color: '#800000', marginTop: 4 }}>File: {lembarPeminjaman.name}</div>}
                {lembarPeminjamanError && <div style={{ color: 'red', fontSize: 13, marginTop: 4 }}>{lembarPeminjamanError}</div>}
              </div>
            </div>
          </>
        )}
        {keperluan === 'TAK Kolektif' && (
          <>
            <div className="form-row">
              <div className="form-col">
                <label htmlFor="tipeAktivitas">Tipe aktivitas <span style={{ color: '#888', fontSize: 12 }}>(kepanitiaan yang terhitung hanya yang di bawah Ormawa)</span></label>
                <select id="tipeAktivitas" required value={tipeAktivitas} onChange={e => setTipeAktivitas(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }}>
                  <option value="">Pilih tipe aktivitas</option>
                  {TIPE_AKTIVITAS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              {tipeAktivitas === 'Kepanitiaan organisasi' && (
                <div className="form-col">
                  <label htmlFor="durasiKepanitiaan">Durasi kegiatan</label>
                  <select id="durasiKepanitiaan" required value={durasiKepanitiaan} onChange={e => setDurasiKepanitiaan(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }}>
                    <option value="">Pilih durasi</option>
                    {DURASI_KEPANITIAAN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </div>
              )}
            </div>
            <div className="form-row">
              <div className="form-col">
                <label style={{ fontWeight: 'bold', fontSize: 16 }}>Tanggal Kegiatan</label>
                <div style={{ marginTop: 8 }}>
                  <label htmlFor="tahunAjaran" style={{ display: 'block', marginBottom: 4 }}>Tahun Ajaran</label>
                  <select
                    id="tahunAjaran"
                    value={tahunAjaran}
                    onChange={e => {
                      setTahunAjaran(e.target.value);
                      setTanggalMulaiTak(null);
                      setTanggalSelesaiTak(null);
                    }}
                    style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc', marginBottom: 12 }}
                    required
                  >
                    <option value="">Pilih tahun akademik</option>
                    {TAHUN_AJARAN_OPTIONS.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
                <div style={{ marginTop: 8 }}>
                  <label htmlFor="tanggalMulaiTak" style={{ display: 'block', marginBottom: 4 }}>Tanggal Mulai</label>
                  <DatePicker
                    id="tanggalMulaiTak"
                    selected={tanggalMulaiTak}
                    onChange={date => setTanggalMulaiTak(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    required
                    className="form-control"
                    minDate={min}
                    maxDate={max}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    disabled={!tahunAjaran}
                  />
                </div>
                <div style={{ marginTop: 12 }}>
                  <label htmlFor="tanggalSelesaiTak" style={{ display: 'block', marginBottom: 4 }}>Tanggal Selesai</label>
                  <DatePicker
                    id="tanggalSelesaiTak"
                    selected={tanggalSelesaiTak}
                    onChange={date => setTanggalSelesaiTak(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    required
                    className="form-control"
                    minDate={tanggalMulaiTak || min}
                    maxDate={max}
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    disabled={!tahunAjaran}
                  />
                </div>
              </div>
              <div className="form-col">
                <div style={{ marginBottom: 16 }}>
                  <label htmlFor="suratTak">Surat Pengajuan TAK</label>
                  <input id="suratTak" type="file" required accept="application/pdf" onChange={e => {
                    const file = e.target.files[0];
                    if (file && file.size > MAX_FILE_SIZE) {
                      setSuratTakError('Ukuran file maksimal 10MB');
                      setSuratTak(null);
                    } else {
                      setSuratTakError('');
                      setSuratTak(file);
                    }
                  }} style={{ width: '100%', marginTop: 4 }} />
                  <div style={{ fontSize: 13, color: '#888', marginTop: 6 }}>
                    Yang diupload adalah yang sudah lengkap semua tanda tangan kecuali KaUr Kemahasiswaan dan Dekan<br/>
                    File number limit: 1, Single file size limit: 10MB<br/>
                    Allowed file types: PDF
                  </div>
                  {suratTak && <div style={{ fontSize: 13, color: '#800000', marginTop: 4 }}>File: {suratTak.name}</div>}
                  {suratTakError && <div style={{ color: 'red', fontSize: 13, marginTop: 4 }}>{suratTakError}</div>}
                </div>
                <div>
                  <label htmlFor="dataMahasiswa">Data Nama Mahasiswa yang diajukan</label>
                  <input id="dataMahasiswa" type="file" required accept=".xls,.xlsx" onChange={e => {
                    const file = e.target.files[0];
                    if (file && file.size > MAX_FILE_SIZE) {
                      setDataMahasiswaError('Ukuran file maksimal 10MB');
                      setDataMahasiswa(null);
                    } else {
                      setDataMahasiswaError('');
                      setDataMahasiswa(file);
                    }
                  }} style={{ width: '100%', marginTop: 4 }} />
                  <div style={{ fontSize: 13, color: '#888', marginTop: 6 }}>
                    File number limit: 1, Single file size limit: 10MB<br/>
                    Allowed file types: Excel
                  </div>
                  {dataMahasiswa && <div style={{ fontSize: 13, color: '#800000', marginTop: 4 }}>File: {dataMahasiswa.name}</div>}
                  {dataMahasiswaError && <div style={{ color: 'red', fontSize: 13, marginTop: 4 }}>{dataMahasiswaError}</div>}
                </div>
              </div>
            </div>
          </>
        )}
        {keperluan === 'Pengaduan / Aspirasi' && (
          <>
            <div className="form-row">
              <div className="form-col">
                <label htmlFor="temaPengaduan">Tema Pengaduan</label>
                <select id="temaPengaduan" required value={temaPengaduan} onChange={e => setTemaPengaduan(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }}>
                  <option value="">Pilih tema pengaduan</option>
                  {TEMA_PENGADUAN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
              <div className="form-col">
                <label htmlFor="filePengaduan">Unggah file apapun yang terkait dengan aduanmu</label>
                <input id="filePengaduan" type="file" required accept={FILE_PENGADUAN_ACCEPT} onChange={e => {
                  const file = e.target.files[0];
                  if (file && file.size > MAX_FILE_SIZE) {
                    setFilePengaduanError('Ukuran file maksimal 10MB');
                    setFilePengaduan(null);
                  } else {
                    setFilePengaduanError('');
                    setFilePengaduan(file);
                  }
                }} style={{ width: '100%', marginTop: 4 }} />
                <div style={{ fontSize: 13, color: '#888', marginTop: 6 }}>
                  Kalau banyak bisa di-zip/rar<br/>
                  File number limit: 1, Single file size limit: 10MB<br/>
                  Allowed file types: Word, Excel, PPT, PDF, Image, Video, Audio, zip, rar
                </div>
                {filePengaduan && <div style={{ fontSize: 13, color: '#800000', marginTop: 4 }}>File: {filePengaduan.name}</div>}
                {filePengaduanError && <div style={{ color: 'red', fontSize: 13, marginTop: 4 }}>{filePengaduanError}</div>}
              </div>
            </div>
            <div className="form-row">
              <div className="form-col">
                <label htmlFor="ceritaAduan">Ceritakan aduanmu</label>
                <textarea id="ceritaAduan" required rows={3} value={ceritaAduan} onChange={e => setCeritaAduan(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }} />
              </div>
            </div>
          </>
        )}
        {keperluan === 'Penandatanganan dokumen lainnya (LPJ, Proker, dll)' && (
          <>
            <div className="form-row">
              <div className="form-col">
                {afiliasi && afiliasi !== 'Independen' ? (
                  <div>
                    <label htmlFor="proker">Proker Terkait</label>
                    <select id="proker" required value={proker} onChange={e => setProker(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }}>
                      <option value="">Pilih proker</option>
                      {prokerList.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                    </select>
                  </div>
                ) : afiliasi === 'Independen' && (
                  <div>
                    <label htmlFor="kegiatanIndependen">Untuk kegiatan apa</label>
                    <input id="kegiatanIndependen" type="text" required value={kegiatanIndependen} onChange={e => setKegiatanIndependen(e.target.value)} placeholder="Kompetisi, Lomba, dsb" style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }} />
                  </div>
                )}
              </div>
              <div className="form-col">
                <label htmlFor="namaDokumen">Nama Dokumen</label>
                <input id="namaDokumen" type="text" required value={namaDokumen} onChange={e => setNamaDokumen(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }} />
              </div>
            </div>
            <div className="form-row">
              <div className="form-col">
                <label htmlFor="tanggalKegiatanDokumen">Tanggal Kegiatan</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <DatePicker
                    id="tanggalKegiatanDokumen"
                    selected={tanggalKegiatan}
                    onChange={date => setTanggalKegiatan(date)}
                    dateFormat="dd/MM/yyyy"
                    placeholderText="dd/mm/yyyy"
                    className="form-control"
                    autoComplete="off"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                  />
                  <button type="button" onClick={handleAddDate} style={{ padding: '8px 12px', background: '#008000', color: 'white', border: 'none', borderRadius: 4, cursor: 'pointer' }}>
                    Tambah
                  </button>
                </div>
                {selectedDates.length > 0 && (
                  <div style={{ marginTop: '10px' }}>
                    <strong>Tanggal yang dipilih:</strong>
                    <ul style={{ listStyle: 'none', padding: 0, marginTop: '5px' }}>
                      {selectedDates.map(date => (
                        <li key={date.getTime()} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '4px', borderBottom: '1px solid #eee' }}>
                          <span>{date.toLocaleDateString('id-ID')}</span>
                          <button type="button" onClick={() => handleRemoveDate(date)} style={{ background: '#d32f2f', color: 'white', border: 'none', borderRadius: 4, padding: '2px 8px', cursor: 'pointer' }}>
                            Hapus
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="form-col">
                <label htmlFor="fileDokumen">Dokumen</label>
                <input id="fileDokumen" type="file" required accept={FILE_ACCEPT} onChange={e => {
                  const file = e.target.files[0];
                  if (file && file.size > MAX_FILE_SIZE) {
                    setFileDokumenError('Ukuran file maksimal 10MB');
                    setFileDokumen(null);
                  } else {
                    setFileDokumenError('');
                    setFileDokumen(file);
                  }
                }} style={{ width: '100%', marginTop: 4 }} />
                <div style={{ fontSize: 13, color: '#888', marginTop: 6 }}>
                  Yang diupload adalah yang sudah lengkap semua tanda tangan kecuali KaUr Kemahasiswaan dan Dekan.<br/>
                  File number limit: 1, Single file size limit: 10MB<br/>
                  Allowed file types: Word, Excel, PPT, PDF, Image, Video, Audio
                </div>
                {fileDokumen && <div style={{ fontSize: 13, color: '#800000', marginTop: 4 }}>File: {fileDokumen.name}</div>}
                {fileDokumenError && <div style={{ color: 'red', fontSize: 13, marginTop: 4 }}>{fileDokumenError}</div>}
              </div>
            </div>
          </>
        )}
        <button type="submit" style={{ width: '100%', padding: 10, background: '#800000', color: 'white', border: 'none', borderRadius: 4, fontWeight: 'bold' }}>
          Ajukan Kegiatan
        </button>
      </form>
    </div>
  );
};

export default ActivitySubmission; 