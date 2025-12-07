import React from 'react';
import { useAuth } from '../AuthProvider';
import { Link } from 'react-router-dom';
import App from '../App';

export default function HomePage() {
  const { user, loading } = useAuth();

  if (loading) return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="p-8 bg-white rounded-lg shadow-lg text-center max-w-md w-full">
          <h2 className="text-2xl font-semibold mb-4">Bem-vindo ao Med.ly</h2>
          <p className="text-gray-600 mb-6">Para acessar sua área, faça login ou cadastre-se.</p>
          <div className="flex gap-3 justify-center">
            <Link to="/login" className="px-4 py-2 bg-teal-600 text-white rounded">Entrar</Link>
            <Link to="/register" className="px-4 py-2 border border-teal-600 text-teal-600 rounded">Cadastrar</Link>
          </div>
        </div>
      </div>
    );
  }

  return <App />;
}
