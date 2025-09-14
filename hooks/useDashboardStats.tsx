import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '@/redux/store'

interface DashboardStats {
  inbox: {
    total: number
    answered: number
    unanswered: number
    closed: number
  }
  knowledge: {
    totalArticles: number
    totalCategories: number
    totalViews: number
    totalDownloads: number
  }
  visitors: {
    totalVisitors: number
    activeVisitors: number
    newVisitors: number
    returningVisitors: number
  }
  properties: {
    totalProperties: number
    activeProperties: number
    totalMembers: number
    activeMembers: number
  }
}

interface UseDashboardStatsReturn {
  stats: DashboardStats
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export const useDashboardStats = (): UseDashboardStatsReturn => {
  const [stats, setStats] = useState<DashboardStats>({
    inbox: { total: 0, answered: 0, unanswered: 0, closed: 0 },
    knowledge: { totalArticles: 0, totalCategories: 0, totalViews: 0, totalDownloads: 0 },
    visitors: { totalVisitors: 0, activeVisitors: 0, newVisitors: 0, returningVisitors: 0 },
    properties: { totalProperties: 0, activeProperties: 0, totalMembers: 0, activeMembers: 0 }
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const token = useSelector((state: RootState) => state.auth.token)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)

      // TODO: Replace these with actual API endpoints
      const endpoints = {
        inbox: '/api/dashboard/inbox-stats',
        knowledge: '/api/dashboard/knowledge-stats',
        visitors: '/api/dashboard/visitor-stats',
        properties: '/api/dashboard/property-stats'
      }

      const headers: HeadersInit = {
        'Content-Type': 'application/json'
      }

      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      // Fetch all statistics in parallel
      const [inboxRes, knowledgeRes, visitorsRes, propertiesRes] = await Promise.allSettled([
        fetch(endpoints.inbox, { headers }),
        fetch(endpoints.knowledge, { headers }),
        fetch(endpoints.visitors, { headers }),
        fetch(endpoints.properties, { headers })
      ])

      // Process responses
      const newStats: DashboardStats = {
        inbox: { total: 0, answered: 0, unanswered: 0, closed: 0 },
        knowledge: { totalArticles: 0, totalCategories: 0, totalViews: 0, totalDownloads: 0 },
        visitors: { totalVisitors: 0, activeVisitors: 0, newVisitors: 0, returningVisitors: 0 },
        properties: { totalProperties: 0, activeProperties: 0, totalMembers: 0, activeMembers: 0 }
      }

      // Handle inbox stats
      if (inboxRes.status === 'fulfilled' && inboxRes.value.ok) {
        const inboxData = await inboxRes.value.json()
        newStats.inbox = inboxData.data || newStats.inbox
      }

      // Handle knowledge stats
      if (knowledgeRes.status === 'fulfilled' && knowledgeRes.value.ok) {
        const knowledgeData = await knowledgeRes.value.json()
        newStats.knowledge = knowledgeData.data || newStats.knowledge
      }

      // Handle visitor stats
      if (visitorsRes.status === 'fulfilled' && visitorsRes.value.ok) {
        const visitorsData = await visitorsRes.value.json()
        newStats.visitors = visitorsData.data || newStats.visitors
      }

      // Handle property stats
      if (propertiesRes.status === 'fulfilled' && propertiesRes.value.ok) {
        const propertiesData = await propertiesRes.value.json()
        newStats.properties = propertiesData.data || newStats.properties
      }

      // For now, use mock data if APIs are not available
      if (!token || inboxRes.status !== 'fulfilled' || !inboxRes.value?.ok) {
        newStats.inbox = {
          total: 156,
          answered: 89,
          unanswered: 45,
          closed: 22
        }
      }

      if (!token || knowledgeRes.status !== 'fulfilled' || !knowledgeRes.value?.ok) {
        newStats.knowledge = {
          totalArticles: 47,
          totalCategories: 8,
          totalViews: 1247,
          totalDownloads: 89
        }
      }

      if (!token || visitorsRes.status !== 'fulfilled' || !visitorsRes.value?.ok) {
        newStats.visitors = {
          totalVisitors: 2341,
          activeVisitors: 156,
          newVisitors: 89,
          returningVisitors: 67
        }
      }

      if (!token || propertiesRes.status !== 'fulfilled' || !propertiesRes.value?.ok) {
        newStats.properties = {
          totalProperties: 12,
          activeProperties: 10,
          totalMembers: 45,
          activeMembers: 38
        }
      }

      setStats(newStats)
    } catch (err) {
      console.error('Error fetching dashboard stats:', err)
      setError('Failed to fetch dashboard statistics')
      
      // Fallback to mock data on error
      setStats({
        inbox: {
          total: 156,
          answered: 89,
          unanswered: 45,
          closed: 22
        },
        knowledge: {
          totalArticles: 47,
          totalCategories: 8,
          totalViews: 1247,
          totalDownloads: 89
        },
        visitors: {
          totalVisitors: 2341,
          activeVisitors: 156,
          newVisitors: 89,
          returningVisitors: 67
        },
        properties: {
          totalProperties: 12,
          activeProperties: 10,
          totalMembers: 45,
          activeMembers: 38
        }
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [token])

  return {
    stats,
    loading,
    error,
    refetch: fetchStats
  }
}
