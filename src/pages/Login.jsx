import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginSSO, isLoggedIn } from '../services/auth';

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
      minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', background: '#f5f5f5',
    }}>
      <form onSubmit={handleSubmit} style={{
        background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', minWidth: 300, width: '90%', maxWidth: 350
      }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Login SSO ORMAWA</h2>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="email">Email SSO</label>
          <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="password">Password</label>
          <input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: 8, marginTop: 4, borderRadius: 4, border: '1px solid #ccc' }} />
        </div>
        {error && <div style={{ color: 'red', marginBottom: 12 }}>{error}</div>}
        <button type="submit" style={{ width: '100%', padding: 10, background: '#800000', color: 'white', border: 'none', borderRadius: 4, fontWeight: 'bold' }}>
          Login SSO
        </button>
      </form>
    </div>
  );
};

export default Login; 