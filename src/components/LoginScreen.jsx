import { useState } from 'react';
import { supabase } from '../supabase/client';

export default function LoginScreen() {
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setLoading(true);
        
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        
        if (error) {
            console.error('Erro no login:', error);
            alert('Erro ao fazer login');
        }
        
        setLoading(false);
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#f5f5f5',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '48px',
                borderRadius: '16px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                textAlign: 'center',
                maxWidth: '400px',
                width: '90%'
            }}>
                {/* Logo/Título */}
                <div style={{
                    fontSize: '32px',
                    fontWeight: 'bold',
                    marginBottom: '12px',
                    color: '#333'
                }}>
                    Bem-vindo
                </div>
                
                <div style={{
                    fontSize: '16px',
                    color: '#666',
                    marginBottom: '40px'
                }}>
                    Faça login para continuar
                </div>

                {/* Botão Google */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '12px',
                        width: '100%',
                        padding: '14px 24px',
                        backgroundColor: 'white',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                        opacity: loading ? 0.6 : 1
                    }}
                    onMouseEnter={(e) => {
                        if (!loading) {
                            e.target.style.backgroundColor = '#f8f8f8';
                            e.target.style.borderColor = '#d0d0d0';
                        }
                    }}
                    onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'white';
                        e.target.style.borderColor = '#e0e0e0';
                    }}
                >
                    {/* Google Icon */}
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
                        <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
                        <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
                        <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
                    </svg>
                    
                    {loading ? 'Carregando...' : 'Continuar com Google'}
                </button>

                {/* Divider */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    margin: '32px 0',
                    color: '#999',
                    fontSize: '14px'
                }}>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }}></div>
                    <span style={{ padding: '0 16px' }}>ou</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: '#e0e0e0' }}></div>
                </div>

                {/* Email Input (opcional) */}
                <input
                    type="email"
                    placeholder="seu@email.com"
                    style={{
                        width: '100%',
                        padding: '14px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '16px',
                        marginBottom: '12px',
                        boxSizing: 'border-box'
                    }}
                />

                {/* Botão Email */}
                <button
                    style={{
                        width: '100%',
                        padding: '14px',
                        backgroundColor: '#333',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '16px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#555'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#333'}
                >
                    Continuar com Email
                </button>

                {/* Footer */}
                <div style={{
                    marginTop: '32px',
                    fontSize: '12px',
                    color: '#999'
                }}>
                    Ao continuar, você concorda com nossos{' '}
                    <a href="#" style={{ color: '#333' }}>Termos de Uso</a>
                </div>
            </div>
        </div>
    );
}
