"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { toast } from 'sonner'
import type { Profile } from '@/lib/supabase/types'

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    async function loadProfile() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setLoading(false)
          return null
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (error) throw error

        setProfile(profile)
      } catch (err) {
        console.error('Error loading profile:', err)
        setError(err instanceof Error ? err : new Error('Failed to load profile'))
        toast.error('Failed to load profile')
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!profile?.id) return

    try {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', profile.id)
        .select()
        .single()

      if (error) throw error

      setProfile(data)
      toast.success('Profile updated successfully')
    } catch (err) {
      console.error('Error updating profile:', err)
      toast.error('Failed to update profile')
      throw err
    }
  }

  return { profile, loading, error, updateProfile }
}