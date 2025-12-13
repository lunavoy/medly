import React, { useState } from 'react';
import { useAuth } from '../AuthProvider';
import { useNavigate, Link } from 'react-router-dom';

export default function LoginPage() {
  const { signInWithEmail, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signInWithEmail(email, password);
    setLoading(false);
    if (error) return alert(error.message || 'Erro ao entrar');
    navigate('/dashboard');
  };

  const handleGoogle = async () => {
    setLoading(true);
    await signInWithGoogle();
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4">Entrar</h1>
        <button onClick={handleGoogle} disabled={loading} className="w-full mb-4 p-3 border rounded flex items-center justify-center">
          {loading ? 'Redirecionando...' : 'Continuar com Google'}
        </button>
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
          <div className="flex-1 h-px bg-gray-200" />
          ou
          <div className="flex-1 h-px bg-gray-200" />
        </div>
        <form onSubmit={handleEmailLogin}>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" className="w-full p-3 border rounded mb-3" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="senha" type="password" className="w-full p-3 border rounded mb-4" />
          <button type="submit" className="w-full p-3 bg-teal-600 text-white rounded">Entrar</button>
        </form>
        <div className="mt-4 text-sm text-center">
          Não tem conta? <Link to="/register" className="text-teal-600">Cadastre-se</Link>
        </div>
      </div>
    </div>
  );
}
