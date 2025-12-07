import { useState, useEffect } from 'react'
import { supabase } from '../config/supabase'

export function useDatabase(table) {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  // Buscar dados
  const fetchData = async () => {
    setLoading(true)
    const { data: result, error } = await supabase
      .from(table)
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Erro ao buscar:', error)
    } else {
      setData(result || [])
    }
    setLoading(false)
  }

  // Criar
  const create = async (item) => {
    const { data: result, error } = await supabase
      .from(table)
      .insert(item)
      .select()
    
    if (!error) {
      setData([result[0], ...data])
    }
    return { data: result, error }
  }

  // Atualizar
  const update = async (id, updates) => {
    const { error } = await supabase
      .from(table)
      .update(updates)
      .eq('id', id)
    
    if (!error) {
      setData(data.map(item => 
        item.id === id ? { ...item, ...updates } : item
      ))
    }
    return { error }
  }

  // Deletar
  const remove = async (id) => {
    const { error } = await supabase
      .from(table)
      .delete()
      .eq('id', id)
    
    if (!error) {
      setData(data.filter(item => item.id !== id))
    }
    return { error }
  }

  useEffect(() => {
    fetchData()
  }, [table])

  return { data, loading, create, update, remove, refresh: fetchData }
}