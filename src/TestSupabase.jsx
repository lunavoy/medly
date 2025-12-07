import { useState } from 'react'

export default function TestSupabase() {
  const [resultado, setResultado] = useState('')
  const [carregando, setCarregando] = useState(false)

  // SUBSTITUA AQUI com suas credenciais do Supabase
  const SUPABASE_URL = 'https://supabase.com/dashboard/project/ygbozjqyuiwknqnrspfz'
  const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnYm96anF5dWl3a25xbnJzcGZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk4Nzc2NTgsImV4cCI6MjA3NTQ1MzY1OH0.-jD8GGJ8G8XaY0fhFKlo0KV5WpKjW0rW6_AUMu-qhpw'

  const testarConexao = async () => {
    setCarregando(true)
    setResultado('🔍 Testando conexão...\n')

    try {
      // Importar Supabase
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

      setResultado(prev => prev + '✅ Supabase carregado!\n')

      // Tentar buscar dados
      setResultado(prev => prev + '🔍 Buscando dados da tabela "tasks"...\n')
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .limit(5)

      if (error) {
        setResultado(prev => prev + `❌ ERRO: ${error.message}\n`)
        setResultado(prev => prev + '\n💡 DIAGNÓSTICO:\n')
        
        if (error.message.includes('relation') || error.message.includes('does not exist')) {
          setResultado(prev => prev + '→ A tabela "tasks" não existe no Supabase.\n')
          setResultado(prev => prev + '→ Vá no Supabase e crie a tabela!\n')
        } else if (error.message.includes('Invalid API key')) {
          setResultado(prev => prev + '→ A chave da API está errada.\n')
          setResultado(prev => prev + '→ Copie novamente de: Settings → API\n')
        } else {
          setResultado(prev => prev + `→ Erro desconhecido: ${error.message}\n`)
        }
      } else {
        setResultado(prev => prev + `✅ SUCESSO! Conexão funcionando!\n`)
        setResultado(prev => prev + `📊 Encontrados ${data.length} registros\n`)
        setResultado(prev => prev + `\nDados:\n${JSON.stringify(data, null, 2)}\n`)
      }

    } catch (erro) {
      setResultado(prev => prev + `❌ ERRO FATAL: ${erro.message}\n`)
    }

    setCarregando(false)
  }

  const testarCriacao = async () => {
    setCarregando(true)
    setResultado('🔍 Tentando CRIAR um registro...\n')

    try {
      const { createClient } = await import('@supabase/supabase-js')
      const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

      const novoItem = {
        title: `Teste ${new Date().toLocaleTimeString()}`,
        description: 'Criado pelo testador',
        completed: false
      }

      const { data, error } = await supabase
        .from('tasks')
        .insert(novoItem)
        .select()

      if (error) {
        setResultado(prev => prev + `❌ ERRO ao criar: ${error.message}\n`)
      } else {
        setResultado(prev => prev + `✅ CRIADO COM SUCESSO!\n`)
        setResultado(prev => prev + `ID: ${data[0].id}\n`)
        setResultado(prev => prev + `\n✨ Vá no Supabase → Table Editor → tasks\n`)
        setResultado(prev => prev + `Você vai ver o novo registro lá!\n`)
      }

    } catch (erro) {
      setResultado(prev => prev + `❌ ERRO: ${erro.message}\n`)
    }

    setCarregando(false)
  }

  return (
    <div style={{ padding: '30px', fontFamily: 'monospace', maxWidth: '900px', margin: '0 auto' }}>
      <h1>🧪 Testador Supabase</h1>
      
      <div style={{ 
        backgroundColor: '#f0f0f0', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <strong>Configuração Atual:</strong>
        <div>URL: <code>{SUPABASE_URL}</code></div>
        <div>Key: <code>{SUPABASE_KEY.substring(0, 20)}...</code></div>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={testarConexao}
          disabled={carregando}
          style={{
            padding: '12px 24px',
            marginRight: '10px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: carregando ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {carregando ? '⏳ Testando...' : '1️⃣ Testar Conexão'}
        </button>

        <button 
          onClick={testarCriacao}
          disabled={carregando}
          style={{
            padding: '12px 24px',
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: carregando ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          2️⃣ Testar Criar Registro
        </button>
      </div>

      <div style={{
        backgroundColor: '#1e1e1e',
        color: '#00ff00',
        padding: '20px',
        borderRadius: '8px',
        minHeight: '300px',
        whiteSpace: 'pre-wrap',
        fontFamily: 'Courier New, monospace'
      }}>
        {resultado || 'Clique no botão para começar o teste...'}
      </div>

      <div style={{
        marginTop: '20px',
        padding: '15px',
        backgroundColor: '#fff3cd',
        borderRadius: '8px'
      }}>
        <strong>⚠️ IMPORTANTE:</strong>
        <ol>
          <li>Substitua SUPABASE_URL e SUPABASE_KEY no código acima</li>
          <li>Pegue as credenciais em: Supabase → Settings → API</li>
          <li>Este arquivo é só para teste, não afeta seu app</li>
        </ol>
      </div>
    </div>
  )
}