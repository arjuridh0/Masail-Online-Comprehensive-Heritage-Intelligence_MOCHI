import { createClient } from '@/lib/supabase/server'
import type { PeranPengguna, StatusLembaga } from '@/lib/types/database'

export interface SesiPengguna {
  id: string
  email: string
  nama: string
  peran: PeranPengguna
  lembaga?: {
    id: string
    nama: string
    slug: string
    status: StatusLembaga
    alasan_status?: string | null
    nspp?: string | null
    kota?: string | null
  } | null
}

/**
 * Mengambil sesi pengguna aktif di server berserta profil peran dan lembaga yang dikelola.
 */
export async function getSesiPengguna(): Promise<SesiPengguna | null> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return null
    }

    // 1. Ambil data profil peran
    const { data: profil } = await supabase
      .from('profil')
      .select('nama, peran')
      .eq('id', user.id)
      .maybeSingle()

    const peran = (profil?.peran || 'lembaga') as PeranPengguna
    const nama = profil?.nama || user.email?.split('@')[0] || 'Pengguna'

    // 2. Ambil relasi lembaga yang dikelola
    const { data: pengelolaData } = await supabase
      .from('pengelola')
      .select(`
        lembaga:lembaga_id (
          id,
          nama,
          slug,
          status,
          alasan_status,
          nspp,
          kota
        )
      `)
      .eq('user_id', user.id)
      .maybeSingle()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const lembaga = (pengelolaData?.lembaga as any) || null

    return {
      id: user.id,
      email: user.email || '',
      nama,
      peran,
      lembaga,
    }
  } catch (err) {
    if ((err as { digest?: string })?.digest === 'DYNAMIC_SERVER_USAGE') {
      throw err
    }
    console.error('Error getSesiPengguna:', err)
    return null
  }
}