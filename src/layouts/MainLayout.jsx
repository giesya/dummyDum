import React from 'react';
import Navbar from '../components/Navbar';
import { useLocation } from 'react-router-dom';
import { FaInstagram, FaLinkedin, FaMapMarkerAlt } from 'react-icons/fa';

const MainLayout = ({ children }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {!isLoginPage && (
        <header style={{ background: '#800000', color: 'white', padding: 0 }}>
          <Navbar />
        </header>
      )}
      <main style={{ flex: 1 }}>{children}</main>
      {!isLoginPage && (
        <footer style={{ background: '#eee', textAlign: 'center', padding: '1.5rem 1rem 1rem 1rem', marginTop: 24 }}>
          <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#800000', fontWeight: 'bold', fontSize: 15 }}>
              <FaMapMarkerAlt />
              Jl. Telekomunikasi No.1, Bandung, Jawa Barat 40257
            </div>
            <div style={{ display: 'flex', gap: 18, marginTop: 4 }}>
              <a href="https://instagram.com/telkomuniversity" target="_blank" rel="noopener noreferrer" style={{ color: '#800000', fontSize: 22 }}><FaInstagram /></a>
              <a href="https://linkedin.com/school/telkom-university" target="_blank" rel="noopener noreferrer" style={{ color: '#800000', fontSize: 22 }}><FaLinkedin /></a>
            </div>
            <div style={{ fontSize: 13, color: '#888', marginTop: 6 }}>
              &copy; {new Date().getFullYear()} KP ORMAWA Telkom University
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default MainLayout; 