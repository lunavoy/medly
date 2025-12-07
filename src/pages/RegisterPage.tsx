import React, { useState } from 'react';
import { useAuth } from '../AuthProvider';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const { signUpWithEmail } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await signUpWithEmail(email, password, { full_name: name });
    setLoading(false);
    if (error) return alert(error.message || 'Erro ao cadastrar');
    alert('Verifique seu email para confirmar o cadastro.');
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-semibold mb-4">Criar Conta</h1>
        <form onSubmit={handleRegister}>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nome" className="w-full p-3 border rounded mb-3" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email" className="w-full p-3 border rounded mb-3" />
          <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="senha" type="password" className="w-full p-3 border rounded mb-4" />
          <button type="submit" className="w-full p-3 bg-teal-600 text-white rounded">Cadastrar</button>
        </form>
        <div className="mt-4 text-sm text-center">
          Já tem conta? <Link to="/login" className="text-teal-600">Entrar</Link>
        </div>
      </div>
    </div>
  );
}
