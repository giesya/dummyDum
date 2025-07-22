import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginSSO, isLoggedIn } from '../services/auth';
import TelULogo from '../assets/TelU-logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isLoggedIn()) navigate('/');
  }, [navigate]);

  const handleSubmit = e => {
    e.preventDefault();
    if (loginSSO(email, password)) {
      navigate('/');
    } else {
      setError('Gunakan email @student.telkomuniversity.ac.id dan password minimal 6 karakter');
    }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'row', background: '#fafbfc',
    }}>
      {/* Kiri: Gambar dan Sambutan */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(135deg, #fff 60%, #80000010 100%)',
        padding: '0 2vw',
      }}>
        <img src={TelULogo} alt="Telkom University Logo" style={{ width: 400, maxWidth: '90%', height: 'auto', objectFit: 'contain', marginBottom: 32, filter: 'drop-shadow(0 8px 32px #80000022)' }} />
        <h1 style={{ color: '#800000', fontWeight: 800, fontSize: 28, margin: 0, textAlign: 'left', alignSelf: 'flex-start', lineHeight: 1.2 }}>
          Selamat Datang di<br />Urusan Kemahasiswaan<br />Fakultas Informatika
        </h1>
      </div>
      {/* Kanan: Form Login */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#fff',
        boxShadow: '0 0 24px #80000011',
      }}>
        <form onSubmit={handleSubmit} style={{
          background: 'white', padding: '2.2rem 2rem 1.5rem 2rem', borderRadius: '14px', boxShadow: '0 4px 24px 0 #80000022', minWidth: 300, width: '90%', maxWidth: 350, display: 'flex', flexDirection: 'column', gap: 8
        }}>
          <h2 style={{ color: '#800000', fontWeight: 700, margin: 0, fontSize: 20, textAlign: 'left', marginBottom: 4 }}>Urusan Kemahasiswaan Fakultas Informatika</h2>
          <div style={{ color: '#444', fontSize: 13, marginBottom: 16, textAlign: 'left' }}>
            Silakan login dengan akun SSO
          </div>
          {/* Input Email */}
          <div style={{ marginBottom: 10 }}>
            <label htmlFor="email" style={{ fontWeight: 500, color: '#800000' }}>Email SSO</label>
            <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 10, marginTop: 4, borderRadius: 6, border: '1px solid #ccc', fontSize: 15, background: '#fafbfc' }} />
          </div>
          {/* Input Password */}
          <div style={{ marginBottom: 10 }}>
            <label htmlFor="password" style={{ fontWeight: 500, color: '#800000' }}>Password</label>
            <input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: 10, marginTop: 4, borderRadius: 6, border: '1px solid #ccc', fontSize: 15, background: '#fafbfc' }} />
          </div>
          {error && <div style={{ color: 'red', marginBottom: 8, fontSize: 13 }}>{error}</div>}
          <button type="submit" style={{ width: '100%', padding: 12, background: '#800000', color: 'white', border: 'none', borderRadius: 6, fontWeight: 'bold', fontSize: 16, marginTop: 8, boxShadow: '0 2px 8px #80000022', letterSpacing: 0.5 }}>
            Login SSO
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login; 