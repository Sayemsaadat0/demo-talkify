'use client'
import {
  MessageSquare,
  CheckCircle,
  Clock,
  XCircle,
  Building,
  Archive,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats'

const DashboardStats = () => {
  const { stats, loading, error, refetch } = useDashboardStats()

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    color, 
    subtitle,
    chartData
  }: {
    title: string
    value: number
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    icon: any
    color: string
    subtitle?: string
    chartData?: number[]
  }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className={`p-2.5 rounded-lg ${color} group-hover:scale-110 transition-transform duration-300`}>
              <Icon className="h-5 w-5 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600">{title}</p>
              {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
            </div>
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {loading ? (
              <div className="h-9 w-20 bg-gray-200 rounded animate-pulse"></div>
            ) : (
              value.toLocaleString()
            )}
          </p>
        </div>
      </div>
      
      {/* Mini Chart */}
      {chartData && (
        <div className="flex items-end gap-1 h-12 mt-4">
          {chartData.map((value, index) => (
            <div
              key={index}
              className="flex-1 bg-gradient-to-t from-gray-200 to-gray-100 rounded-sm"
              style={{ height: `${(value / Math.max(...chartData)) * 100}%` }}
            />
          ))}
        </div>
      )}
    </div>
  )

     // eslint-disable-next-line @typescript-eslint/no-explicit-any
     const MetricOverview = ({ title, metrics }: { title: string, metrics: any[] }) => (
     <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
       <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
       <div className="space-y-4">
         {metrics.map((metric, index) => (
           <div key={index} className="flex items-center justify-between">
             <div className="flex items-center gap-3">
               <div className={`w-3 h-3 rounded-full ${metric.color}`}></div>
               <span className="text-sm text-gray-600">{metric.label}</span>
             </div>
             <span className="text-sm font-semibold text-gray-900">{metric.value}</span>
           </div>
         ))}
       </div>
     </div>
   )

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ActivityCard = ({ title, activities }: { title: string, activities: any[] }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3">
            <div className={`w-2 h-2 rounded-full mt-2 ${activity.color}`}></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">{activity.title}</p>
              <p className="text-xs text-gray-500">{activity.time}</p>
            </div>
            <span className="text-xs text-gray-400">{activity.value}</span>
          </div>
        ))}
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-12 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-red-100 rounded-lg">
            <XCircle className="h-5 w-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-red-900">Error Loading Statistics</h3>
            <p className="text-red-700 mt-1">{error}</p>
            <button 
              onClick={refetch}
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
             {/* Main Statistics Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <StatCard
           title="Total Messages"
           value={stats.inbox.total}
           icon={MessageSquare}
           color="bg-gradient-to-br from-blue-500 to-blue-600"
           subtitle="All inbox messages"
           chartData={[65, 78, 90, 85, 92, 88, 95]}
         />
         <StatCard
           title="Answered"
           value={stats.inbox.answered}
           icon={CheckCircle}
           color="bg-gradient-to-br from-green-500 to-green-600"
           subtitle="Successfully resolved"
           chartData={[45, 52, 60, 58, 65, 62, 68]}
         />
         <StatCard
           title="Unanswered"
           value={stats.inbox.unanswered}
           icon={Clock}
           color="bg-gradient-to-br from-yellow-500 to-yellow-600"
           subtitle="Pending responses"
           chartData={[25, 22, 18, 20, 15, 17, 12]}
         />
         <StatCard
           title="Closed"
           value={stats.inbox.closed}
           icon={Archive}
           color="bg-gradient-to-br from-gray-500 to-gray-600"
           subtitle="Archived tickets"
           chartData={[12, 15, 18, 16, 20, 18, 22]}
         />
       </div>

      {/* Detailed Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Knowledge Base Overview */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Knowledge Base Analytics</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="h-4 w-4" />
                <span>Last 30 days</span>
              </div>
            </div>
            
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               <div className="text-center">
                 <div className="text-2xl font-bold text-purple-600">{stats.knowledge.totalArticles}</div>
                 <div className="text-sm text-gray-600">Articles</div>
               </div>
               <div className="text-center">
                 <div className="text-2xl font-bold text-indigo-600">{stats.knowledge.totalCategories}</div>
                 <div className="text-sm text-gray-600">Categories</div>
               </div>
               <div className="text-center">
                 <div className="text-2xl font-bold text-blue-600">{stats.knowledge.totalViews}</div>
                 <div className="text-sm text-gray-600">Views</div>
               </div>
               <div className="text-center">
                 <div className="text-2xl font-bold text-green-600">{stats.knowledge.totalDownloads}</div>
                 <div className="text-sm text-gray-600">Downloads</div>
               </div>
             </div>

            {/* Chart Placeholder */}
            <div className="mt-6 h-32 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Knowledge Base Growth Chart</p>
              </div>
            </div>
          </div>
        </div>

                 {/* Visitor Metrics */}
         <MetricOverview
           title="Visitor Analytics"
           metrics={[
             { label: 'Total Visitors', value: stats.visitors.totalVisitors.toLocaleString(), color: 'bg-green-500' },
             { label: 'Active Visitors', value: stats.visitors.activeVisitors, color: 'bg-blue-500' },
             { label: 'New Visitors', value: stats.visitors.newVisitors, color: 'bg-yellow-500' },
             { label: 'Returning', value: stats.visitors.returningVisitors, color: 'bg-purple-500' }
           ]}
         />
      </div>

      {/* Property Management & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Property Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Property Management</h3>
            <Building className="h-5 w-5 text-orange-500" />
          </div>
          
          <div className="space-y-4">
                         <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
               <div>
                 <p className="text-sm font-medium text-gray-900">Total Properties</p>
                 <p className="text-xs text-gray-500">Active & inactive</p>
               </div>
               <div className="text-right">
                 <p className="text-xl font-bold text-orange-600">{stats.properties.totalProperties}</p>
               </div>
             </div>
             
             <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
               <div>
                 <p className="text-sm font-medium text-gray-900">Active Properties</p>
                 <p className="text-xs text-gray-500">Currently running</p>
               </div>
               <div className="text-right">
                 <p className="text-xl font-bold text-green-600">{stats.properties.activeProperties}</p>
               </div>
             </div>
             
             <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
               <div>
                 <p className="text-sm font-medium text-gray-900">Total Members</p>
                 <p className="text-xs text-gray-500">All team members</p>
               </div>
               <div className="text-right">
                 <p className="text-xl font-bold text-blue-600">{stats.properties.totalMembers}</p>
               </div>
             </div>
          </div>
        </div>

        {/* Recent Activity */}
        <ActivityCard
          title="Recent Activity"
          activities={[
            { title: 'New message received', time: '2 minutes ago', value: '1', color: 'bg-blue-500' },
            { title: 'Knowledge article published', time: '15 minutes ago', value: '1', color: 'bg-green-500' },
            { title: 'Property member joined', time: '1 hour ago', value: '1', color: 'bg-purple-500' },
            { title: 'Support ticket closed', time: '2 hours ago', value: '3', color: 'bg-gray-500' },
            { title: 'New visitor registered', time: '3 hours ago', value: '5', color: 'bg-yellow-500' }
          ]}
        />

        {/* Performance Metrics */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Overview</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Response Rate</span>
                <span className="text-sm font-semibold text-gray-900">89%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '89%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Avg Response Time</span>
                <span className="text-sm font-semibold text-gray-900">2.3h</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Customer Satisfaction</span>
                <span className="text-sm font-semibold text-gray-900">4.8/5</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '96%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">System Uptime</span>
                <span className="text-sm font-semibold text-gray-900">99.9%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '99.9%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardStats
