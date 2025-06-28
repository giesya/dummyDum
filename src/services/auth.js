// Simulasi auth SSO
const AUTH_KEY = 'ormawa_auth';
const ROLE_KEY = 'ormawa_role';

export function loginSSO(email, password) {
  const cleanEmail = email.trim().toLowerCase();
  if (
    (cleanEmail.endsWith('@student.telkomuniversity.ac.id') || cleanEmail.endsWith('@telkomuniversity.ac.id')) &&
    typeof password === 'string' && password.length >= 6
  ) {
    localStorage.setItem(AUTH_KEY, cleanEmail);
    // Role admin jika email berakhiran @telkomuniversity.ac.id, selain itu mahasiswa
    if (cleanEmail.endsWith('@telkomuniversity.ac.id')) {
      localStorage.setItem(ROLE_KEY, 'admin');
    } else {
      localStorage.setItem(ROLE_KEY, 'mahasiswa');
    }
    return true;
  }
  return false;
}

export function logout() {
  localStorage.removeItem(AUTH_KEY);
  localStorage.removeItem(ROLE_KEY);
}

export function isLoggedIn() {
  return !!localStorage.getItem(AUTH_KEY);
}

export function getUser() {
  return localStorage.getItem(AUTH_KEY);
}

export function getRole() {
  return localStorage.getItem(ROLE_KEY) || 'mahasiswa';
} 