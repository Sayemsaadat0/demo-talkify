
'use client'

import { useGetAffiliateCommision } from "@/hooks/useGetAffiliateCommision"
import { Building2, Eye, Users2, Wallet } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  // DialogTrigger,
} from "@/components/ui/dialog"
import { useGetCommissionDetails } from "@/hooks/useGetCommissionDetails"
import { useState } from "react"
import Button from "@/components/ui/button"
import AffiliateCommissionWithdrawSection from "@/components/affiliate-program/AffiliateCommissionWithdrawSection"
import { SkeletonCard, SkeletonTableRow } from "@/components/loader/Skeleton"


const CommisionDetails = ({ id }: { id: number }) => {
  const { data, loading } = useGetCommissionDetails({ id })


  return (
    <div>
      {
        loading ? <div>Loading..</div> : <div className="space-y-6">
          <div className="text-center pb-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Transaction Details
            </h1>
            <p className="text-gray-500 mt-1">ID: #{id}</p>
          </div>
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 rounded-xl shadow-lg"></div>
              <div className="relative backdrop-blur-sm bg-white/80 rounded-xl p-4 border border-white/40">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">$</span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-800">Transaction</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-white/60 rounded-lg p-2 border border-white/50">
                    <span className="text-xs text-gray-500 font-medium">AMOUNT</span>
                    <span className="text-lg font-bold text-emerald-600">${data?.amount}</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/60 rounded-lg p-2 border border-white/50">
                    <span className="text-xs text-gray-500 font-medium">TYPE</span>
                    <span className="text-sm font-semibold text-gray-700 capitalize">{data?.type}</span>
                  </div>
                  <div className="flex justify-between uppercase items-center bg-white/60 rounded-lg p-2 border border-white/50">
                    <span className="text-xs text-gray-500 font-medium">STATUS</span>
                    <div className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${data?.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                      data?.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                      <div className={`w-1.5 h-1.5  rounded-full ${data?.status === 'completed' ? 'bg-emerald-500' :
                        data?.status === 'pending' ? 'bg-amber-500' :
                          'bg-red-500'
                        }`}></div>
                      {data?.status}
                    </div>
                  </div>
                  {data?.notes && (
                    <div className="bg-white/60 rounded-lg p-3 border border-white/50">
                      <p className="text-xs text-gray-500 font-medium mb-1">NOTES</p>
                      <p className="text-xs text-gray-600 leading-relaxed">{data?.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {/* Payment Gateway */}
            {data?.payment_gateway && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100 rounded-xl shadow-lg"></div>
                <div className="relative backdrop-blur-sm bg-white/80 rounded-xl p-4 border border-white/40">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-bold">🏦</span>
                    </div>
                    <h3 className="text-base font-semibold text-gray-800">Payment Gateway</h3>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center bg-white/60 rounded-lg p-2 border border-white/50">
                      <span className="text-xs text-gray-500 font-medium">TYPE</span>
                      <span className="text-xs font-semibold text-gray-700 capitalize">{data?.payment_gateway?.type?.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/60 rounded-lg p-2 border border-white/50">
                      <span className="text-xs text-gray-500 font-medium">BANK</span>
                      <span className="text-xs font-semibold text-gray-700">{data?.payment_gateway?.data?.bank_name}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/60 rounded-lg p-2 border border-white/50">
                      <span className="text-xs text-gray-500 font-medium">HOLDER</span>
                      <span className="text-xs font-semibold text-gray-700">{data?.payment_gateway?.data?.account_holder_name}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/60 rounded-lg p-2 border border-white/50">
                      <span className="text-xs text-gray-500 font-medium">IFSC</span>
                      <span className="text-xs font-mono font-semibold text-gray-700">{data?.payment_gateway?.data?.ifsc_code}</span>
                    </div>
                    <div className="flex justify-between items-center bg-white/60 rounded-lg p-2 border border-white/50">
                      <span className="text-xs text-gray-500 font-medium">ACCOUNT</span>
                      <span className="text-xs font-mono font-semibold text-gray-700">****{data?.payment_gateway?.data?.account_number?.slice(-4)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}


            {/* User Info */}
            <div className={`relative ${!data?.payment_gateway ? 'lg:col-span-2' : ''}`}>
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-rose-100 rounded-xl shadow-lg"></div>
              <div className="relative backdrop-blur-sm bg-white/80 rounded-xl p-4 border border-white/40">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-600 rounded-lg flex items-center justify-center">
                    <span className="text-white text-sm font-bold">👤</span>
                  </div>
                  <h3 className="text-base font-semibold text-gray-800">User Information</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="bg-white/60 rounded-lg p-2 border border-white/50">
                    <p className="text-xs text-gray-500 font-medium mb-0.5">NAME</p>
                    <p className="text-xs font-semibold text-gray-700">{data?.user?.fullname}</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-2 border border-white/50">
                    <p className="text-xs text-gray-500 font-medium mb-0.5">USERNAME</p>
                    <p className="text-xs font-semibold text-gray-700">@{data?.user?.username}</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-2 border border-white/50">
                    <p className="text-xs text-gray-500 font-medium mb-0.5">EMAIL</p>
                    <p className="text-xs font-semibold text-blue-600">{data?.user?.email}</p>
                  </div>
                  <div className="bg-white/60 rounded-lg p-2 border border-white/50">
                    <p className="text-xs text-gray-500 font-medium mb-0.5">PHONE</p>
                    <p className="text-xs font-semibold text-gray-700">{data?.user?.phone_code} {data?.user?.phone}</p>
                  </div>
                  <div className="sm:col-span-2 bg-white/60 rounded-lg p-2 border border-white/50">
                    <p className="text-xs text-gray-500 font-medium mb-0.5">COUNTRY</p>
                    <p className="text-xs font-semibold text-gray-700">{data?.user?.country}</p>
                  </div>
                </div>
              </div>
            </div>


          </div>
        </div>
      }

    </div >
  )
}









// Default Container
const AffiliateCommissions = () => {
  const [typeFIlter, setTypeFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [page, setPage] = useState(1); // ✅ track current page

  const { data, loading, } = useGetAffiliateCommision({
    type: typeFIlter,
    status: statusFilter,
    page, // ✅ pass to hook

  })

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => {
    if (data?.transactions && page < data?.transactions?.last_page) {
      setPage((p) => p + 1);
    }
  };

  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [withdrawOpen, setWithdrawOpen] = useState(false)


  const typeOptions = data?.filter?.type
    ? Object.entries(data.filter.type).map(([key, label]) => ({ value: key, label }))
    : [];
  const statusOptions = data?.filter?.status
    ? Object.entries(data.filter.status).map(([key, label]) => ({ value: key, label }))
    : [];

  const statsData = [
    { id: 1, title: "Current Balance", value: data?.current_balance, icon: Wallet, bgColor: "bg-blue-100" },
    { id: 2, title: "Total Commissions", value: data?.total_commission, icon: Users2, bgColor: "bg-green-100" },
    { id: 3, title: "Total Withdraw", value: data?.total_withdraw, icon: Building2, bgColor: "bg-purple-100" },
    { id: 4, title: "Pending Withdraw", value: data?.pending_withdraw_count, icon: Building2, bgColor: "bg-yellow-100" },

  ];
  return (
    <div className="space-y-10">

      <p className="text-3xl border-b w-fit border-b-gray-300">Affiliate Commissions</p>
      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {loading || !data ? (
          [1, 2, 5].map((key) => <SkeletonCard key={key} />)
        ) : (
          statsData.map(({ id, title, value, icon: Icon, bgColor }) => (
            <div key={id} className={`${bgColor} shadow-md rounded-lg p-6 flex items-center gap-4`}>
              <Icon className="text-blue-500 text-3xl" />
              <div>
                <h3 className="text-gray-700 font-medium">{title}</h3>
                <p className="text-2xl font-semibold">{value}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <div className="flex justify-between items-end ">
        <div className="flex gap-4">
          <div>
            <label htmlFor="typeFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Type
            </label>
            <select
              id="typeFilter"
              value={typeFIlter}
              onChange={(e) => {
                setPage(1); // reset page when filtering
                setTypeFilter(e.target.value);
              }} className="border rounded px-3 py-2"
            >
              <option value="">All Types</option>
              {typeOptions.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="statusFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Status
            </label>
            <select
              id="statusFilter"
              value={statusFilter}
              onChange={(e) => {
                setPage(1);
                setStatusFilter(e.target.value);
              }}
              className="border rounded px-3 py-2"
            >
              <option value="">All Status</option>
              {statusOptions.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="">
          <Dialog open={withdrawOpen} onOpenChange={() => setWithdrawOpen(!withdrawOpen)}>

            <DialogTrigger asChild>
              <Button>Make Withdraw</Button>
            </DialogTrigger>
            <DialogContent className="!p-0">
              <DialogHeader>
                <DialogTitle></DialogTitle>
                <DialogDescription>
                </DialogDescription>
              </DialogHeader>
              <AffiliateCommissionWithdrawSection withdrawOpen={withdrawOpen} setWithdrawOpen={setWithdrawOpen} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <table className="min-w-full bg-white rounded-lg shadow-md border border-gray-200">
        <thead className="bg-gray-50 rounded-t-lg">
          <tr>
            <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200 rounded-tl-lg">ID</th>
            <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Date</th>
            <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Type</th>
            <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Amount</th>
            <th className="text-left px-6 py-3 font-semibold text-gray-600 border-b border-gray-200">Status</th>
            <th className="text-right px-6 py-3 font-semibold  text-gray-600 border-b border-gray-200 rounded-tr-lg">Action</th>
          </tr>
        </thead>
        <tbody>
          {loading || !data ? (
            // Show 5 skeleton rows while loading
            [...Array(6)].map((_, i) => <SkeletonTableRow key={i} />)
          ) : data?.transactions?.data?.length === 0 ? (
            <tr>
              <td colSpan={5} className="text-center py-6 text-gray-500">
                No data available
              </td>
            </tr>
          ) : (
            data?.transactions?.data?.map((row, i) => (
              <tr
                key={row.id}
                className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-6 py-4 border-b border-gray-200">{i + 1}</td>
                <td className="px-6 py-4 border-b border-gray-200">
                  {new Date(row.created_at).toLocaleDateString()}
                </td>

                <td className="px-6 py-4 uppercase border-b border-gray-200">
                  <span className={`px-2 py-1 font-bold text-xs rounded-full  ${row?.type === 'withdraw' && "bg-yellow-200" || row?.type === 'commission' && "bg-purple-200"}`}>{row.type || "N/A"}</span>
                </td>

                <td className="px-6 py-4 border-b border-gray-200">{row.amount}</td>

                <td className="px-6 py-4 uppercase  border-b border-gray-200">
                  <span className={`px-2 py-1 font-bold text-xs rounded-full  ${row?.status === 'pending' && "bg-yellow-200" || row?.status === 'approved' && "bg-green-200" || row?.status === 'rejected' && "bg-red-200" || row?.status === 'paid' && "bg-purple-200"}`}>{row.status || "N/A"}</span>
                </td>

                <td className="px-6 py-4 border-b border-gray-200 text-black font-semibold rounded-md text-end">
                  <button
                    onClick={() => setSelectedId(row.id)}
                    className="text-blue-600 hover:text-blue-800"
                    aria-label="View commission details"
                  >
                    <Eye />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {data?.transactions?.last_page && data.transactions.last_page > 0 && (
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handlePrev}
            disabled={page === 1}
            className={`px-4 py-2 rounded-md border ${page === 1 ? "bg-gray-200 text-gray-500 cursor-not-allowed" : "bg-white hover:bg-gray-100"
              }`}
          >
            Prev
          </button>
          <span className="self-center">
            Page {page} of {data.transactions.last_page}
          </span>
          <button
            onClick={handleNext}
            disabled={page === data.transactions.last_page}
            className={`px-4 py-2 rounded-md border ${page === data.transactions.last_page
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-white hover:bg-gray-100"
              }`}
          >
            Next
          </button>
        </div>
      )}

      <Dialog open={!!selectedId} onOpenChange={(open) => !open && setSelectedId(null)}>
        <DialogContent className="md:min-w-2xl max-h-[80%] overflow-auto">
          <DialogHeader>
            <DialogTitle></DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          {selectedId && <CommisionDetails id={selectedId} />}
        </DialogContent>
      </Dialog>
    </div>
  )
}
export default AffiliateCommissions
