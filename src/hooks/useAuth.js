import { useState, useEffect } from 'react'
import { supabase } from '../supabase/client'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const normalizeUrl = (url) => url?.replace(/\/+$/, '')
  const redirectBase = normalizeUrl(import.meta.env.VITE_SITE_URL || window.location.origin)

  useEffect(() => {
    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Escutar mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    const redirectUrl = `${redirectBase}/dashboard`
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    })
    if (error) console.error('Erro no login:', error)
  }

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return { user, loading, signInWithGoogle, signOut }
}