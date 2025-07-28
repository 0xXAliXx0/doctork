import { supabase } from './supabase'

export interface Doctor {
  id: number
  name: string
  created_at?: string
}

export async function searchDoctorsByName(name: string) {
  return await supabase
    .from<Doctor>('doctors')
    .select('*')
    .ilike('name', `%${name}%`)
}

export async function insertDoctor(name: string) {
  return await supabase
    .from<Doctor>('doctors')
    .insert([{ name: name.trim() }])
    .select()
}

