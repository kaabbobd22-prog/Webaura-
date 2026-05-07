import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../lib/api';
import Button from '../../components/Button';

export default function AdminLoginPage() {
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('ChangeMe123!');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const submit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/login', { email, password });
      localStorage.setItem('wm_admin_token', response.data.token);
      navigate(location.state?.from || '/admin/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-lg items-center px-6 py-16">
      <form onSubmit={submit} className="card-shell w-full p-8">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Admin login</p>
        <h1 className="mt-4 text-4xl font-bold text-white">Welcome back</h1>
        <p className="mt-3 text-slate-300">Sign in to manage products, orders, custom requests, and storefront settings.</p>
        <div className="mt-8 space-y-5">
          <div>
            <label className="label">Email</label>
            <input className="field" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-rose-300">{error}</p>}
          <Button className="w-full" type="submit">Login</Button>
        </div>
      </form>
    </div>
  );
}
