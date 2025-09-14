'use client';
import { 
  Calendar, 
  Bell, 
  Settings, 
  MessageSquare, 
  Building, 
  BookOpen, 
  Users, 
  Eye, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  RefreshCw,
  AlertCircle,
  PieChart,
  LineChart,
  BarChart,
  Monitor
} from 'lucide-react'
import { useGetRecords } from '@/hooks/useGetRecords';
import { useGetChartInboxMovements } from '@/hooks/useGetChartInboxMovements';
import { useGetChartInboxStatement } from '@/hooks/useGetChartInboxStatement';
import { useGetRemainPlan } from '@/hooks/useGetRemainPlan';
import { useGetMonitors } from '@/hooks/useGetMonitors';

const Dashboard = () => {
  const { data: records, loading: recordsLoading, error: recordsError, refetch: refetchRecords } = useGetRecords();
  const { data: chartMovements, loading: chartMovementsLoading, error: chartMovementsError } = useGetChartInboxMovements();
  const { data: chartStatement, loading: chartStatementLoading, error: chartStatementError } = useGetChartInboxStatement();
  const { data: remainPlan, loading: remainPlanLoading, error: remainPlanError } = useGetRemainPlan();
  const { data: monitors, loading: monitorsLoading, error: monitorsError } = useGetMonitors();

  const isLoading = recordsLoading || chartMovementsLoading || chartStatementLoading || remainPlanLoading || monitorsLoading;
  const hasError = recordsError || chartMovementsError || chartStatementError || remainPlanError || monitorsError;

  // if (!usePropertyAccess()) return <PropertyAccessDenied featureName="No Access" />

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center text-gray-600">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-lg font-medium">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4 max-w-md mx-auto text-center">
          <div className="p-4 bg-red-100 rounded-full">
            <AlertCircle className="h-12 w-12 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Error Loading Dashboard</h2>
          <p className="text-gray-600">
            {recordsError || chartMovementsError || chartStatementError || remainPlanError || monitorsError}
          </p>
          <button
            onClick={() => {
              refetchRecords();
            }}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className=" mx-auto space-y-6">
        {/* Header with Actions */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
              <p className="text-gray-600 mt-1">Welcome back! {`Here's what's`} happening with your account today.</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-4 py-2 rounded-xl">
                <Calendar className="h-4 w-4" />
                <span>{new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</span>
              </div>
              <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                <Bell className="h-5 w-5" />
              </button>
              <button className="p-3 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Properties</p>
                <p className="text-3xl font-bold">{records?.totalProperty || '0'}</p>
                <p className="text-xs opacity-75 mt-1">Active properties</p>
              </div>
              <Building className="h-10 w-10 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">{`Today's`} Visitors</p>
                <p className="text-3xl font-bold">{records?.todayVisitors || '0'}</p>
                <p className="text-xs opacity-75 mt-1">Active visitors</p>
              </div>
              <Eye className="h-10 w-10 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Members</p>
                <p className="text-3xl font-bold">{records?.totalMembers || '0'}</p>
                <p className="text-xs opacity-75 mt-1">Team members</p>
              </div>
              <Users className="h-10 w-10 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Knowledge Base</p>
                <p className="text-3xl font-bold">{records?.savedKb || '0'}</p>
                <p className="text-xs opacity-75 mt-1">Articles saved</p>
              </div>
              <BookOpen className="h-10 w-10 opacity-80" />
            </div>
          </div>
        </div>

        {/* Chat Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-xl">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Answered Chats</p>
                <p className="text-2xl font-bold text-gray-900">{records?.answerChat || '0'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-xl">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Unanswered Chats</p>
                <p className="text-2xl font-bold text-gray-900">{records?.unAnsweredChat || '0'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Closed Chats</p>
                <p className="text-2xl font-bold text-gray-900">{records?.closeChat || '0'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-xl">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pending Tickets</p>
                <p className="text-2xl font-bold text-gray-900">{records?.pendingTicket || '0'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inbox Movements Chart */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <LineChart className="h-5 w-5 text-indigo-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Inbox Movements</h3>
              </div>
            </div>
            {chartMovements ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-3 bg-green-50 rounded-xl">
                    <p className="text-sm text-gray-600">Answered</p>
                    <p className="text-xl font-bold text-green-600">
                      {chartMovements.answered.reduce((a, b) => a + b, 0)}
                    </p>
                  </div>
                  <div className="p-3 bg-red-50 rounded-xl">
                    <p className="text-sm text-gray-600">Unanswered</p>
                    <p className="text-xl font-bold text-red-600">
                      {chartMovements.unAnswered.reduce((a, b) => a + b, 0)}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <p className="text-sm text-gray-600">Closed</p>
                    <p className="text-xl font-bold text-blue-600">
                      {chartMovements.closed.reduce((a, b) => a + b, 0)}
                    </p>
                  </div>
                </div>
                <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
                  <p className="text-gray-500">Chart visualization would go here</p>
                </div>
              </div>
            ) : (
              <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
                <p className="text-gray-500">No chart data available</p>
              </div>
            )}
          </div>

          {/* Monthly Statement Chart */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Monthly Statement</h3>
              </div>
            </div>
            {chartStatement ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="p-3 bg-green-50 rounded-xl">
                    <p className="text-sm text-gray-600">Total Answered</p>
                    <p className="text-xl font-bold text-green-600">
                      {chartStatement.answered.reduce((a, b) => a + b, 0)}
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <p className="text-sm text-gray-600">Total Closed</p>
                    <p className="text-xl font-bold text-blue-600">
                      {chartStatement.closed.reduce((a, b) => a + b, 0)}
                    </p>
                  </div>
                </div>
                <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
                  <p className="text-gray-500">Monthly chart visualization would go here</p>
                </div>
              </div>
            ) : (
              <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
                <p className="text-gray-500">No monthly data available</p>
              </div>
            )}
          </div>
        </div>

        {/* Plan Usage & Monitors Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Plan Usage */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <PieChart className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Plan Usage</h3>
              </div>
            </div>
            {remainPlan ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Properties</span>
                    <span className="text-sm font-medium text-gray-900">
                      {remainPlan.remainProperty}/{remainPlan.totalProperty}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${remainPlan.percentProperty}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Members</span>
                    <span className="text-sm font-medium text-gray-900">
                      {remainPlan.remainMembers}/{remainPlan.totalMember}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${remainPlan.percentMember}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Visitors</span>
                    <span className="text-sm font-medium text-gray-900">
                      {remainPlan.remainVisitors}/{remainPlan.totalVisitors}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${remainPlan.percentVisitor}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Knowledge Base</span>
                    <span className="text-sm font-medium text-gray-900">
                      {remainPlan.remainKb}/{remainPlan.totalKb}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${remainPlan.percentKb}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
                <p className="text-gray-500">No plan usage data available</p>
              </div>
            )}
          </div>

          {/* Monitors Table */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Monitor className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Live Monitors</h3>
              </div>
              <span className="text-sm text-gray-500">{monitors?.count || 0} active</span>
            </div>
            {monitors && monitors.chat.length > 0 ? (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {monitors.chat.slice(0, 5).map((chat, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {chat.visitor_name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {chat.message}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      chat.status === 'active' ? 'bg-green-100 text-green-800' :
                      chat.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {chat.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-64 bg-gray-50 rounded-xl flex items-center justify-center">
                <p className="text-gray-500">No active monitors</p>
              </div>
            )}
          </div>
        </div>

        {/* Additional Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-indigo-100 rounded-xl">
                <FileText className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Personal Notes</p>
                <p className="text-2xl font-bold text-gray-900">{records?.savePersonalNote || '0'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-xl">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Saved Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{records?.savedContact || '0'}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-xl">
                <Eye className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Saved Visitors</p>
                <p className="text-2xl font-bold text-gray-900">{records?.savedVisitors || '0'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;