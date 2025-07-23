import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaUsers, FaBuilding, FaSignInAlt, FaChevronDown, FaClipboardList, FaCheckCircle, FaUpload, FaBars, FaTimes, FaSignOutAlt, FaBell, FaCalendarAlt } from 'react-icons/fa';
import { isLoggedIn, logout, getUser, getRole } from '../services/auth';

const mainNav = [
  { to: '/', label: 'Dashboard', icon: <FaHome style={{ marginRight: 6 }} /> },
  // { to: '/history', label: 'Riwayat', icon: <FaClipboardList style={{ marginRight: 6 }} />, mahasiswaOnly: true },
  // { to: '/organizations', label: 'Organisasi', icon: <FaBuilding style={{ marginRight: 6 }} />, adminOnly: true },
  // { to: '/members', label: 'Anggota', icon: <FaUsers style={{ marginRight: 6 }} />, adminOnly: true },
];

const adminManagementNav = [
  { to: '/organizations', label: 'Organisasi', icon: <FaBuilding style={{ marginRight: 6 }} /> },
  { to: '/members', label: 'Anggota', icon: <FaUsers style={{ marginRight: 6 }} /> },
];

const layananNavAdmin = [
  { to: '/activity-submission', label: 'Pengajuan Kegiatan', icon: <FaClipboardList style={{ marginRight: 8 }} /> },
  { to: '/proposal-approval', label: 'Persetujuan Proposal', icon: <FaCheckCircle style={{ marginRight: 8 }} /> },
  { to: '/report-upload', label: 'Upload Laporan', icon: <FaUpload style={{ marginRight: 8 }} /> },
];
const layananNavMahasiswa = [
  { to: '/activity-submission', label: 'Pengajuan Kegiatan', icon: <FaClipboardList style={{ marginRight: 8 }} /> },
  { to: '/report-upload', label: 'Upload Laporan', icon: <FaUpload style={{ marginRight: 8 }} /> },
];

const dummyNotifications = [
  { id: 1, message: 'Pengajuan proposal baru dari HIMA', time: '1 menit lalu' },
  { id: 2, message: 'Kegiatan "Seminar Nasional" disetujui', time: '10 menit lalu' },
  { id: 3, message: 'Laporan kegiatan UKM diterima', time: '1 jam lalu' },
];

// Tambahkan fungsi untuk cek notifikasi dokumen baru untuk admin
function getAdminNotifications() {
  const data = localStorage.getItem('history_data');
  if (!data) return [];
  const parsed = JSON.parse(data);
  let notif = [];
  Object.keys(parsed).forEach(jenis => {
    parsed[jenis].forEach(item => {
      if (item.status === 'Menunggu' && !item.adminNotifRead) {
        notif.push({
          id: item.id,
          jenis,
          name: item.name,
          pengaju: item.pengaju?.nama || '-',
        });
      }
    });
  });
  return notif;
}

// Fungsi notifikasi mahasiswa
function getHistoryNotifications(user) {
  const data = localStorage.getItem('history_data');
  if (!data) return [];
  const parsed = JSON.parse(data);
  let notif = [];
  Object.keys(parsed).forEach(jenis => {
    parsed[jenis].forEach(item => {
      if (item.pengaju.email === user && (item.status === 'Disetujui' || item.status === 'Ditolak') && !item.notifRead) {
        notif.push({
          id: item.id,
          jenis,
          name: item.name,
          status: item.status,
        });
      }
    });
  });
  return notif;
}

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownManajemen, setDropdownManajemen] = useState(false);
  const [dropdownLayanan, setDropdownLayanan] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [mobileDropdown, setMobileDropdown] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState(dummyNotifications);
  const [userDropdown, setUserDropdown] = useState(false);
  const loggedIn = isLoggedIn();
  const user = getUser();
  const role = getRole();

  const layananNav = role === 'admin' ? layananNavAdmin : layananNavMahasiswa;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // CSS responsif inline
  const navStyle = {
    background: '#800000', color: 'white', padding: '0.5rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16,
    position: 'relative',
  };
  const desktopMenuStyle = {
    display: 'flex', gap: 16, alignItems: 'center',
  };
  const hamburgerStyle = {
    display: 'none', fontSize: 28, cursor: 'pointer', color: 'white',
  };
  const mobilePanelStyle = {
    position: 'fixed', top: 0, left: 0, width: '75vw', maxWidth: 320, height: '100vh', background: '#800000', color: 'white', zIndex: 100, padding: '2rem 1.5rem 1.5rem 1.5rem', boxShadow: '2px 0 12px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', gap: 18, transition: 'transform 0.2s', transform: mobileMenu ? 'translateX(0)' : 'translateX(-100%)',
  };
  const mobileOverlayStyle = {
    position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.2)', zIndex: 99, display: mobileMenu ? 'block' : 'none',
  };

  // Media query JS (untuk hide/show menu)
  const isMobile = window.innerWidth <= 900;

  useEffect(() => {
    if (role === 'mahasiswa') {
      const userNotifs = getHistoryNotifications(user);
      setNotifications(userNotifs.length > 0 ? userNotifs.map(n => ({ id: n.id, message: `Status ${n.jenis} "${n.name}": ${n.status}`, time: 'Baru saja' })) : []);
    } else if (role === 'admin') {
      const adminNotifs = getAdminNotifications();
      setNotifications(adminNotifs.length > 0 ? adminNotifs.map(n => ({ id: n.id, message: `Pengajuan baru: ${n.jenis} "${n.name}" oleh ${n.pengaju}`, time: 'Baru saja' })) : []);
    }
  }, [role, user, notifOpen]);

  // Jika admin klik bell, tandai notif sudah dibaca
  const handleNotifClick = () => {
    setNotifOpen(n => !n);
    if (!notifOpen && role === 'mahasiswa') {
      const data = localStorage.getItem('history_data');
      if (data) {
        const parsed = JSON.parse(data);
        Object.keys(parsed).forEach(jenis => {
          parsed[jenis] = parsed[jenis].map(item =>
            item.pengaju.email === user && (item.status === 'Disetujui' || item.status === 'Ditolak')
              ? { ...item, notifRead: true }
              : item
          );
        });
        localStorage.setItem('history_data', JSON.stringify(parsed));
      }
      setNotifications([]);
    }
    if (!notifOpen && role === 'admin') {
      const data = localStorage.getItem('history_data');
      if (data) {
        const parsed = JSON.parse(data);
        Object.keys(parsed).forEach(jenis => {
          parsed[jenis] = parsed[jenis].map(item =>
            item.status === 'Menunggu' ? { ...item, adminNotifRead: true } : item
          );
        });
        localStorage.setItem('history_data', JSON.stringify(parsed));
      }
      setNotifications([]);
    }
  };

  return (
    <nav style={navStyle}>
      {/* Hamburger untuk mobile */}
      <div style={{ ...hamburgerStyle, display: isMobile ? 'block' : 'none' }} onClick={() => setMobileMenu(true)}>
        <FaBars />
      </div>
      {/* Menu desktop */}
      <div style={{ ...desktopMenuStyle, display: isMobile ? 'none' : 'flex' }}>
        {mainNav.filter(item => (!item.adminOnly || role === 'admin') && (!item.mahasiswaOnly || role === 'mahasiswa')).map(item => (
          <Link
            key={item.to}
            to={item.to}
            style={{
              color: location.pathname === item.to ? '#FFD700' : 'white',
              textDecoration: 'none',
              fontWeight: 'bold',
              padding: '8px 12px',
              borderRadius: 4,
              background: location.pathname === item.to ? 'rgba(255,255,255,0.1)' : 'transparent',
              transition: 'background 0.2s',
              display: 'flex', alignItems: 'center',
              fontFamily: 'Poppins, Arial, sans-serif',
            }}
          >
            {item.icon}{item.label}
          </Link>
        ))}
        {role === 'admin' && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setDropdownManajemen(d => !d);
                setDropdownLayanan(false);
              }}
              style={{
                background: (dropdownManajemen || location.pathname === '/organizations' || location.pathname === '/members') ? '#FFD700' : 'transparent',
                color: (dropdownManajemen || location.pathname === '/organizations' || location.pathname === '/members') ? '#800000' : 'white',
                border: 'none', borderRadius: 4, padding: '8px 12px', fontWeight: (dropdownManajemen || location.pathname === '/organizations' || location.pathname === '/members') ? 'bold' : 'bold', cursor: 'pointer', minWidth: 90, display: 'flex', alignItems: 'center', gap: 6,
                fontFamily: 'Poppins, Arial, sans-serif',
                boxShadow: 'none',
                fontSize: 18,
              }}
            >
              <FaBuilding style={{ marginRight: 6 }} /> Manajemen
              <FaChevronDown style={{ marginLeft: 6, transition: 'transform 0.2s', transform: dropdownManajemen ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>
            {dropdownManajemen && (
              <div
                style={{
                  position: 'absolute', top: '110%', left: 0, background: 'white', color: '#800000', borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', minWidth: 200, zIndex: 10,
                  fontFamily: 'Poppins, Arial, sans-serif',
                }}
                onMouseLeave={() => setDropdownManajemen(false)}
              >
                {adminManagementNav.map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    style={{
                      display: 'flex', alignItems: 'center', padding: '10px 16px', color: '#800000', textDecoration: 'none', borderBottom: '1px solid #eee', fontWeight: location.pathname === item.to ? 'bold' : 'normal',
                      background: location.pathname === item.to ? '#f5f5f5' : 'white',
                      fontFamily: 'Poppins, Arial, sans-serif',
                    }}
                    onClick={() => setDropdownManajemen(false)}
                  >
                    {item.icon}{item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
        {role === 'admin' && (
          <Link
            to="/calendar-admin"
            style={{
              color: location.pathname === '/calendar-admin' ? '#FFD700' : 'white',
              textDecoration: 'none',
              fontWeight: 'bold',
              padding: '8px 12px',
              borderRadius: 4,
              background: location.pathname === '/calendar-admin' ? 'rgba(255,255,255,0.1)' : 'transparent',
              transition: 'background 0.2s',
              display: 'flex', alignItems: 'center',
              fontFamily: 'Poppins, Arial, sans-serif',
            }}
          >
            <FaCalendarAlt style={{ marginRight: 6 }} />Kalender
          </Link>
        )}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setDropdownLayanan(d => !d);
              setDropdownManajemen(false);
            }}
            style={{
              background: (dropdownLayanan || layananNav.some(item => location.pathname === item.to)) ? '#FFD700' : 'transparent',
              color: (dropdownLayanan || layananNav.some(item => location.pathname === item.to)) ? '#800000' : 'white',
              border: 'none', borderRadius: 4, padding: '8px 12px', fontWeight: (dropdownLayanan || layananNav.some(item => location.pathname === item.to)) ? 'bold' : 'bold', cursor: 'pointer', minWidth: 90, display: 'flex', alignItems: 'center', gap: 6,
              fontFamily: 'Poppins, Arial, sans-serif',
              boxShadow: 'none',
              fontSize: 18,
            }}
          >
            <FaClipboardList style={{ marginRight: 6 }} />
            Layanan
            <FaChevronDown style={{ marginLeft: 6, transition: 'transform 0.2s', transform: dropdownLayanan ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </button>
          {dropdownLayanan && (
            <div
              style={{
                position: 'absolute', top: '110%', left: 0, background: 'white', color: '#800000', borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', minWidth: 200, zIndex: 10,
                fontFamily: 'Poppins, Arial, sans-serif',
              }}
              onMouseLeave={() => setDropdownLayanan(false)}
            >
              {layananNav.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  style={{
                    display: 'flex', alignItems: 'center', padding: '10px 16px', color: '#800000', textDecoration: 'none', borderBottom: '1px solid #eee', fontWeight: location.pathname === item.to ? 'bold' : 'normal',
                    background: location.pathname === item.to ? '#f5f5f5' : 'white',
                    fontFamily: 'Poppins, Arial, sans-serif',
                  }}
                  onClick={() => setDropdownLayanan(false)}
                >
                  {item.icon}{item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Login/Logout desktop */}
      {loggedIn ? (
        <div style={{ display: isMobile ? 'none' : 'flex', alignItems: 'center', gap: 16, position: 'relative', marginRight: 24 }}>
          {/* Notifikasi Bell */}
          <div style={{ position: 'relative', marginRight: 2 }}>
            <button
              onClick={handleNotifClick}
              style={{ background: 'none', border: 'none', cursor: 'pointer', position: 'relative', padding: 0 }}
              aria-label="Notifikasi"
            >
              <FaBell size={22} color="white" />
              {notifications.length > 0 && (
                <span style={{ position: 'absolute', top: -4, right: -4, background: '#d32f2f', color: 'white', borderRadius: '50%', fontSize: 11, padding: '2px 6px', fontWeight: 'bold' }}>{notifications.length}</span>
              )}
            </button>
            {notifOpen && (
              <div style={{ position: 'absolute', right: 0, top: '120%', background: 'white', color: '#800000', borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.12)', minWidth: 260, zIndex: 20 }}>
                <div style={{ fontWeight: 'bold', padding: '10px 16px', borderBottom: '1px solid #eee', background: '#f5f5f5', borderTopLeftRadius: 6, borderTopRightRadius: 6 }}>Notifikasi</div>
                {notifications.length === 0 ? (
                  <div style={{ padding: '16px', color: '#888', textAlign: 'center' }}>Tidak ada notifikasi baru</div>
                ) : (
                  notifications.map(notif => (
                    <div key={notif.id} style={{ padding: '10px 16px', borderBottom: '1px solid #f0f0f0', fontSize: 14 }}>
                      <div style={{ fontWeight: 500 }}>{notif.message}</div>
                      <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>{notif.time}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
          {/* Badge Role */}
          <button
            onClick={() => { setUserDropdown(d => !d); setDropdownManajemen(false); }}
            style={{
              background: role === 'admin' ? '#d32f2f' : '#888',
              color: 'white', borderRadius: 6, padding: '6px 18px', fontSize: 14, fontWeight: 'bold', border: 'none', cursor: 'pointer', minWidth: 80, boxShadow: 'none', display: 'flex', alignItems: 'center', gap: 8
            }}
          >
            {role === 'admin' ? 'Admin' : 'Mahasiswa'}
            <FaChevronDown style={{ marginLeft: 6, transition: 'transform 0.2s', transform: userDropdown ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </button>
          {userDropdown && (
            <div style={{ position: 'absolute', right: 0, top: '110%', background: 'white', color: '#800000', borderRadius: 8, boxShadow: '0 2px 12px rgba(0,0,0,0.13)', minWidth: 220, zIndex: 30, padding: 18, fontFamily: 'Poppins, Arial, sans-serif' }}>
              <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 8, color: '#222', wordBreak: 'break-all' }}>{user}</div>
              <button onClick={handleLogout} style={{ background: '#d32f2f', color: 'white', border: 'none', borderRadius: 6, padding: '10px 0', fontWeight: 'bold', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: 16, marginTop: 8, cursor: 'pointer' }}>
                <FaSignOutAlt style={{ marginRight: 6 }} /> Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <Link
          to="/login"
          style={{
            color: location.pathname === '/login' ? '#FFD700' : 'white',
            textDecoration: 'none', fontWeight: 'bold', padding: '8px 12px', borderRadius: 4,
            background: location.pathname === '/login' ? 'rgba(255,255,255,0.1)' : 'transparent', transition: 'background 0.2s', display: isMobile ? 'none' : 'flex', alignItems: 'center',
          }}
        >
          <FaSignInAlt style={{ marginRight: 6 }} /> Login
        </Link>
      )}
      {/* Overlay mobile */}
      <div style={mobileOverlayStyle} onClick={() => setMobileMenu(false)} />
      {/* Panel mobile menu */}
      <div style={mobilePanelStyle}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <span style={{ fontWeight: 'bold', fontSize: 20 }}>Menu</span>
          <FaTimes style={{ fontSize: 28, cursor: 'pointer' }} onClick={() => setMobileMenu(false)} />
        </div>
        {mainNav.filter(item => (!item.adminOnly || role === 'admin') && (!item.mahasiswaOnly || role === 'mahasiswa')).map(item => (
          <Link
            key={item.to}
            to={item.to}
            style={{
              color: location.pathname === item.to ? '#FFD700' : 'white',
              textDecoration: 'none', fontWeight: 'bold', padding: '10px 0', borderRadius: 4, display: 'flex', alignItems: 'center', fontSize: 18,
              background: location.pathname === item.to ? 'rgba(255,255,255,0.1)' : 'transparent',
            }}
            onClick={() => setMobileMenu(false)}
          >
            {item.icon}{item.label}
          </Link>
        ))}
        {/* Tambahkan dropdown Manajemen di mobile untuk admin */}
        {role === 'admin' && (
          <div>
            <button
              onClick={() => setMobileDropdown(d => d === 'manajemen' ? '' : 'manajemen')}
              style={{
                background: (mobileDropdown === 'manajemen' || location.pathname === '/organizations' || location.pathname === '/members') ? '#FFD700' : 'rgba(255,255,255,0.1)',
                color: (mobileDropdown === 'manajemen' || location.pathname === '/organizations' || location.pathname === '/members') ? '#800000' : 'white',
                border: 'none', borderRadius: 4, padding: '10px 0', fontWeight: 'bold', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, marginTop: 8
              }}
            >
              <FaBuilding style={{ marginRight: 6 }} /> Manajemen <FaChevronDown style={{ marginLeft: 6, transition: 'transform 0.2s', transform: mobileDropdown === 'manajemen' ? 'rotate(180deg)' : 'rotate(0deg)' }} />
            </button>
            {mobileDropdown === 'manajemen' && (
              <div style={{ marginTop: 4, background: 'white', borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
                {adminManagementNav.map(item => (
                  <Link
                    key={item.to}
                    to={item.to}
                    style={{
                      display: 'flex', alignItems: 'center', padding: '10px 16px', color: '#800000', textDecoration: 'none', borderBottom: '1px solid #eee', fontWeight: location.pathname === item.to ? 'bold' : 'normal', background: location.pathname === item.to ? '#f5f5f5' : 'white', fontSize: 17
                    }}
                    onClick={() => { setMobileMenu(false); setMobileDropdown(''); }}
                  >
                    {item.icon}{item.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        )}
        {/* Kalender di mobile */}
        {role === 'admin' && (
          <Link
            to="/calendar-admin"
            style={{
              color: location.pathname === '/calendar-admin' ? '#FFD700' : 'white',
              textDecoration: 'none', fontWeight: 'bold', padding: '10px 0', borderRadius: 4, display: 'flex', alignItems: 'center', fontSize: 18,
              background: location.pathname === '/calendar-admin' ? 'rgba(255,255,255,0.1)' : 'transparent',
            }}
            onClick={() => setMobileMenu(false)}
          >
            <FaCalendarAlt style={{ marginRight: 6 }} />Kalender
          </Link>
        )}
        {/* Layanan di mobile */}
        <div>
          <button
            onClick={() => setMobileDropdown(d => d === 'layanan' ? '' : 'layanan')}
            style={{
              background: mobileDropdown === 'layanan' ? '#FFD700' : 'rgba(255,255,255,0.1)',
              color: mobileDropdown === 'layanan' ? '#800000' : 'white',
              border: 'none', borderRadius: 4, padding: '10px 0', fontWeight: 'bold', cursor: 'pointer', width: '100%', display: 'flex', alignItems: 'center', gap: 8, fontSize: 18, marginTop: 8
            }}
          >
            <FaClipboardList style={{ marginRight: 6 }} />
            Layanan
            <FaChevronDown style={{ marginLeft: 6, transition: 'transform 0.2s', transform: mobileDropdown === 'layanan' ? 'rotate(180deg)' : 'rotate(0deg)' }} />
          </button>
          {mobileDropdown === 'layanan' && (
            <div style={{ marginTop: 4, background: 'white', borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.08)', overflow: 'hidden' }}>
              {layananNav.map(item => (
                <Link
                  key={item.to}
                  to={item.to}
                  style={{
                    display: 'flex', alignItems: 'center', padding: '10px 16px', color: '#800000', textDecoration: 'none', borderBottom: '1px solid #eee', fontWeight: location.pathname === item.to ? 'bold' : 'normal', background: location.pathname === item.to ? '#f5f5f5' : 'white', fontSize: 17
                  }}
                  onClick={() => { setMobileMenu(false); setMobileDropdown(''); }}
                >
                  {item.icon}{item.label}
                </Link>
              ))}
            </div>
          )}
        </div>
        {loggedIn ? (
          <>
            <span style={{ fontSize: 15, margin: '10px 0 8px 0', color: '#FFD700' }}>{user}</span>
            <span style={{
              background: role === 'admin' ? '#d32f2f' : '#888',
              color: 'white', borderRadius: 6, padding: '2px 10px', fontSize: 13, fontWeight: 'bold', margin: '0 0 10px 0', display: 'inline-block'
            }}>{role === 'admin' ? 'Admin' : 'Mahasiswa'}</span>
            <button onClick={() => { handleLogout(); setMobileMenu(false); }} style={{ background: '#d32f2f', color: 'white', border: 'none', borderRadius: 4, padding: '10px 0', fontWeight: 'bold', display: 'flex', alignItems: 'center', fontSize: 18, marginTop: 16, width: '100%' }}>
              <FaSignOutAlt style={{ marginRight: 8 }} /> Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            style={{
              color: location.pathname === '/login' ? '#FFD700' : 'white', textDecoration: 'none', fontWeight: 'bold', padding: '10px 0', borderRadius: 4, display: 'flex', alignItems: 'center', fontSize: 18, marginTop: 16,
              background: location.pathname === '/login' ? 'rgba(255,255,255,0.1)' : 'transparent',
            }}
            onClick={() => setMobileMenu(false)}
          >
            <FaSignInAlt style={{ marginRight: 8 }} /> Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar; 