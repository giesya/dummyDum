import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { toast } from 'react-toastify';
import { addHistoryItem } from './History';
import { getUser } from '../services/auth';
import { useNavigate } from 'react-router-dom';

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

const PROKER_PER_HIMA = {
  HIMAIF: ['Penerimaan Anggota Baru IF', 'Seminar Nasional IF', 'Lomba Futsal IF'],
  HIMADS: ['Pelatihan Data Science', 'Workshop Python', 'Kompetisi HIMADS'],
  HMIT: ['Pelatihan IT', 'Lomba Coding', 'Seminar IT'],
  HMRPL: ['RPL Fair', 'Pelatihan UI/UX', 'Lomba RPL'],
};
const INDEPENDEN_KEGIATAN_OPTIONS = ['Kompetisi', 'Lomba', 'Pelatihan', 'Seminar', 'Lainnya'];

function getProkerFromStorage() {
  const data = localStorage.getItem('proker_per_hima');
  return data ? JSON.parse(data) : { HIMAIF: [], HIMADS: [], HMIT: [], HMRPL: [] };
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
  const [periodeTak, setPeriodeTak] = useState('');
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

  useEffect(() => {
    if (afiliasi && afiliasi !== 'Independen') {
      const prokerData = getProkerFromStorage();
      setProkerList(prokerData[afiliasi] || []);
    } else {
      setProkerList([]);
    }
  }, [afiliasi]);

  const handleSubmit = e => {
    e.preventDefault();
    toast.success('Pengajuan kegiatan berhasil!');
    setActivityName('');
    setActivityDate(null);
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
    setPeriodeTak('');
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

    // Tambahkan ke riwayat
    const user = getUser();
    let jenis = '';
    let item = {};
    if (keperluan === 'Proposal kegiatan/dana') {
      jenis = 'Proposal';
      item = {
        id: Date.now(),
        name: namaKompetisi || activityName || 'Proposal Baru',
        status: 'Menunggu',
        pengaju: { nama: user.split('@')[0], email: user, afiliasi },
        dokumen: proposalFile ? proposalFile.name : '',
        komentar: '',
        signedFile: '',
      };
    } else if (keperluan === 'Laporan') {
      jenis = 'Laporan';
      item = {
        id: Date.now(),
        name: activityName || 'Laporan Baru',
        status: 'Menunggu',
        pengaju: { nama: user.split('@')[0], email: user, afiliasi },
        dokumen: proposalFile ? proposalFile.name : '',
        komentar: '',
        signedFile: '',
      };
    } else if (keperluan === 'Peminjaman Tempat') {
      jenis = 'Peminjaman Tempat';
      item = {
        id: Date.now(),
        name: ruangan || 'Peminjaman Tempat',
        status: 'Menunggu',
        pengaju: { nama: user.split('@')[0], email: user, afiliasi },
        dokumen: lembarPeminjaman ? lembarPeminjaman.name : '',
        komentar: '',
        signedFile: '',
      };
    } else if (keperluan === 'TAK Kolektif') {
      jenis = 'TAK Kolektif';
      item = {
        id: Date.now(),
        name: tipeAktivitas || 'TAK Kolektif',
        status: 'Menunggu',
        pengaju: { nama: user.split('@')[0], email: user, afiliasi },
        dokumen: suratTak ? suratTak.name : '',
        komentar: '',
        signedFile: '',
      };
    } else if (keperluan === 'Penandatanganan dokumen lainnya (LPJ, Proker, dll)') {
      jenis = 'Penandatanganan Dokumen';
      item = {
        id: Date.now(),
        name: namaDokumen || 'Penandatanganan Dokumen',
        status: 'Menunggu',
        pengaju: { nama: user.split('@')[0], email: user, afiliasi },
        dokumen: fileDokumen ? fileDokumen.name : '',
        komentar: '',
        signedFile: '',
      };
    } else if (keperluan === 'Pengaduan / Aspirasi') {
      jenis = 'Pengaduan/Aspirasi';
      item = {
        id: Date.now(),
        name: temaPengaduan || 'Pengaduan',
        status: 'Menunggu',
        pengaju: { nama: user.split('@')[0], email: user, afiliasi },
        dokumen: filePengaduan ? filePengaduan.name : '',
        komentar: '',
        signedFile: '',
      };
    }
    if (jenis && item) addHistoryItem(jenis, item);
    setTimeout(() => { navigate('/history'); }, 800);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: 500, margin: '0 auto' }}>
      <h2>Pengajuan Kegiatan</h2>
      <form onSubmit={handleSubmit} style={{ background: 'white', padding: 24, borderRadius: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="afiliasi">Afiliasi</label>
          <select id="afiliasi" required value={afiliasi} onChange={e => setAfiliasi(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }}>
            <option value="">Pilih afiliasi</option>
            {AFILIASI_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        {afiliasi && afiliasi !== 'Independen' && (
          <div style={{ marginBottom: 16 }}>
            <label htmlFor="jabatan">Role/Jabatan</label>
            <select id="jabatan" required value={jabatan} onChange={e => setJabatan(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }}>
              <option value="">Pilih jabatan</option>
              {(afiliasi === 'Lab' ? JABATAN_LAB : JABATAN_HIMA).map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        )}
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="keperluan">Keperluan</label>
          <select id="keperluan" required value={keperluan} onChange={e => setKeperluan(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }}>
            <option value="">Pilih keperluan</option>
            {KEPERLUAN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
          </select>
        </div>
        {keperluan === 'Proposal kegiatan/dana' && (
          <>
            {afiliasi && afiliasi !== 'Independen' ? (
              <div style={{ marginBottom: 16 }}>
                <label htmlFor="proker">Proker Terkait</label>
                <select id="proker" required value={proker} onChange={e => setProker(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }}>
                  <option value="">Pilih proker</option>
                  {prokerList.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            ) : afiliasi === 'Independen' && (
              <div style={{ marginBottom: 16 }}>
                <label htmlFor="kegiatanIndependen">Untuk kegiatan apa</label>
                <input id="kegiatanIndependen" type="text" required value={kegiatanIndependen} onChange={e => setKegiatanIndependen(e.target.value)} placeholder="Kompetisi, Lomba, dsb" style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }} />
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="tipeProposal">Tipe Proposal</label>
              <select id="tipeProposal" required value={tipeProposal} onChange={e => setTipeProposal(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }}>
                <option value="">Pilih tipe proposal</option>
                {TIPE_PROPOSAL_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="namaKompetisi">Nama kegiatan/kompetisi</label>
              <input id="namaKompetisi" type="text" required value={namaKompetisi} onChange={e => setNamaKompetisi(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="besaranDana">Besaran dana yang diajukan (dalam Rupiah)</label>
              <input id="besaranDana" type="number" min="0" required value={besaranDana} onChange={e => setBesaranDana(e.target.value.replace(/[^0-9]/g, ''))} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="proposalFile">Berkas proposal</label>
              <input id="proposalFile" type="file" required onChange={e => setProposalFile(e.target.files[0])} style={{ width: '100%', marginTop: 4 }} />
              <div style={{ fontSize: 13, color: '#888', marginTop: 6 }}>
                Yang diupload adalah yang sudah lengkap semua tanda tangan kecuali KaUr Kemahasiswaan dan Dekan.<br/>
                Berkas fisik tetap diserahkan ke Kemahasiswaan (LAAK FIF, TULT lt 1)
              </div>
              {proposalFile && <div style={{ fontSize: 13, color: '#800000', marginTop: 4 }}>File: {proposalFile.name}</div>}
            </div>
          </>
        )}
        {keperluan === 'Peminjaman Tempat' && (
          <>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="ruangan">Ruangan yang dipinjam</label>
              <textarea id="ruangan" required rows={2} value={ruangan} onChange={e => setRuangan(e.target.value)} placeholder="Jika banyak, pisahkan dengan [enter]" style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }} />
            </div>
            {afiliasi && afiliasi !== 'Independen' && (
              <div style={{ marginBottom: 16 }}>
                <label htmlFor="proker">Proker Terkait</label>
                <select id="proker" required value={proker} onChange={e => setProker(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }}>
                  <option value="">Pilih proker</option>
                  {prokerList.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
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
          </>
        )}
        {keperluan === 'TAK Kolektif' && (
          <>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="tipeAktivitas">Tipe aktivitas <span style={{ color: '#888', fontSize: 12 }}>(kepanitiaan yang terhitung hanya yang di bawah Ormawa)</span></label>
              <select id="tipeAktivitas" required value={tipeAktivitas} onChange={e => setTipeAktivitas(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }}>
                <option value="">Pilih tipe aktivitas</option>
                {TIPE_AKTIVITAS_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            {tipeAktivitas === 'Kepanitiaan organisasi' && (
              <div style={{ marginBottom: 16 }}>
                <label htmlFor="durasiKepanitiaan">Durasi kegiatan</label>
                <select id="durasiKepanitiaan" required value={durasiKepanitiaan} onChange={e => setDurasiKepanitiaan(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }}>
                  <option value="">Pilih durasi</option>
                  {DURASI_KEPANITIAAN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="periodeTak">Tanggal / Periode</label>
              <input id="periodeTak" type="text" required value={periodeTak} onChange={e => setPeriodeTak(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }} />
            </div>
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
            <div style={{ marginBottom: 16 }}>
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
          </>
        )}
        {keperluan === 'Pengaduan / Aspirasi' && (
          <>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="temaPengaduan">Tema Pengaduan</label>
              <select id="temaPengaduan" required value={temaPengaduan} onChange={e => setTemaPengaduan(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }}>
                <option value="">Pilih tema pengaduan</option>
                {TEMA_PENGADUAN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="ceritaAduan">Ceritakan aduanmu</label>
              <textarea id="ceritaAduan" required rows={3} value={ceritaAduan} onChange={e => setCeritaAduan(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
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
          </>
        )}
        {keperluan === 'Penandatanganan dokumen lainnya (LPJ, Proker, dll)' && (
          <>
            {afiliasi && afiliasi !== 'Independen' ? (
              <div style={{ marginBottom: 16 }}>
                <label htmlFor="proker">Proker Terkait</label>
                <select id="proker" required value={proker} onChange={e => setProker(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }}>
                  <option value="">Pilih proker</option>
                  {prokerList.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            ) : afiliasi === 'Independen' && (
              <div style={{ marginBottom: 16 }}>
                <label htmlFor="kegiatanIndependen">Untuk kegiatan apa</label>
                <input id="kegiatanIndependen" type="text" required value={kegiatanIndependen} onChange={e => setKegiatanIndependen(e.target.value)} placeholder="Kompetisi, Lomba, dsb" style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }} />
              </div>
            )}
            <div style={{ marginBottom: 16 }}>
              <label htmlFor="namaDokumen">Nama Dokumen</label>
              <input id="namaDokumen" type="text" required value={namaDokumen} onChange={e => setNamaDokumen(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }} />
            </div>
            <div style={{ marginBottom: 16 }}>
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