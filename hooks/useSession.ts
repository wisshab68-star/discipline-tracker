'use client'

import { useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useSessionStore } from '@/store/sessionStore'
import type { Session, Trade } from '@/lib/types'

export function useSession(userId: string | undefined) {
  const supabase = createClient()
  const {
    currentSession,
    trades,
    setCurrentSession,
    setTrades,
    setScores,
    setAlerts,
  } = useSessionStore()

  const fetchActiveSession = useCallback(async () => {
    if (!userId) return null

    const { data, error } = await supabase
      .from('sessions')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'active')
      .order('started_at', { ascending: false })
      .limit(1)
      .single()

    if (error || !data) return null
    setCurrentSession(data as Session)
    return data as Session
  }, [userId, supabase, setCurrentSession])

  const fetchSessionTrades = useCallback(async (sessionId: string) => {
    const { data } = await supabase
      .from('trades')
      .select('*')
      .eq('session_id', sessionId)
      .order('opened_at', { ascending: true })

    if (data) setTrades(data as Trade[])
  }, [supabase, setTrades])

  const fetchSessionScores = useCallback(async (sessionId: string) => {
    const { data } = await supabase
      .from('discipline_scores')
      .select('*')
      .eq('session_id', sessionId)
      .order('computed_at', { ascending: false })

    if (data) setScores(data)
  }, [supabase, setScores])

  const startSession = useCallback(async (broker?: string) => {
    if (!userId) return null

    const { data, error } = await supabase
      .from('sessions')
      .insert({
        user_id: userId,
        broker: broker ?? null,
        status: 'active',
      })
      .select()
      .single()

    if (error) throw error
    setCurrentSession(data as Session)
    setTrades([])
    setScores([])
    setAlerts([])
    return data as Session
  }, [userId, supabase, setCurrentSession, setTrades, setScores, setAlerts])

  const endSession = useCallback(async () => {
    // endSession would need currentSession from store
  }, [])

  useEffect(() => {
    if (!userId) return

    fetchActiveSession().then((session) => {
      if (session) {
        fetchSessionTrades(session.session_id)
        fetchSessionScores(session.session_id)
      }
    })
  }, [userId, fetchActiveSession, fetchSessionTrades, fetchSessionScores])

  return {
    currentSession,
    trades,
    fetchActiveSession,
    fetchSessionTrades,
    startSession,
    endSession,
  }
}
