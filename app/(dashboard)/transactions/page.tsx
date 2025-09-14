'use client';
import { useState } from 'react';
import { Receipt, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useGetTransactions } from '@/hooks/useGetTransactions';
import { SkeletonTableRow, SkeletonCard } from '@/components/loader/Skeleton';

export default function TransactionsPage() {
  const [searchTransactionId, setSearchTransactionId] = useState('');
  const [searchDate, setSearchDate] = useState('');
  const [page, setPage] = useState(1);

  const { data, loading, error } = useGetTransactions({
    transaction_id: searchTransactionId,
    created_at: searchDate,
    page,
  });

  const handlePrev = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => {
    if (data && page < data.last_page) setPage((p) => p + 1);
  };

  const clearFilters = () => {
    setSearchTransactionId('');
    setSearchDate('');
    setPage(1);
  };

  const hasActiveFilters = searchTransactionId.trim() || searchDate.trim();

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const formatAmount = (amount: string) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(amount));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-100 rounded-lg">
          <Receipt className="h-6 w-6 text-orange-600" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
          <p className="text-gray-600">View and manage all transactions</p>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4 sm:items-end justify-between">

          {/* Transaction ID Search */}
          <div className="flex-1 relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by transaction ID..."
              value={searchTransactionId}
              onChange={(e) => { setPage(1); setSearchTransactionId(e.target.value); }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          {/* Date Filter & Clear Button */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">

            {/* Date Filter */}
            <div className="flex flex-col w-full sm:w-auto">
              <label className="block text-sm font-medium text-gray-700 mb-1">Created Date</label>
              <input
                type="date"
                value={searchDate}
                onChange={(e) => { setPage(1); setSearchDate(e.target.value); }}
                className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors w-full sm:w-auto"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      {/* Transactions Table */}
      <div className="md:bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 hidden sm:table">
            <thead className="bg-gray-50">
              <tr>
                {['SL', 'Transaction ID', 'Amount', 'Charge Remarks', 'Created Time'].map((title) => (
                  <th
                    key={title}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {title}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading
                ? Array.from({ length: 5 }).map((_, index) => <SkeletonTableRow key={index} columns={5} />)
                : data?.data && data.data.length > 0
                  ? data.data.map((transaction, index) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {(page - 1) * (data.per_page || 10) + index + 1}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                        {transaction.transactional_id}
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">
                        <span
                          className={`font-semibold ${parseFloat(transaction.amount) >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}
                        >
                          {formatAmount(transaction.amount)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {transaction.remarks || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 whitespace-nowrap">
                        {formatDate(transaction.created_at)}
                      </td>
                    </tr>
                  ))
                  : (
                    <tr>
                      <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <Receipt className="h-12 w-12 text-gray-400 mb-4" />
                          <p className="text-lg font-medium text-gray-900 mb-2">No transactions found</p>
                          <p className="text-gray-600">
                            {hasActiveFilters
                              ? 'Try adjusting your search criteria or filters'
                              : 'No transactions have been recorded yet'}
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
            </tbody>
          </table>

          {/* Mobile view */}
          <div className="space-y-4 sm:hidden">
            {loading
              ? Array.from({ length: 5 }).map((_, index) => <SkeletonCard key={index} />)
              : data?.data && data.data.length > 0
                ? data.data.map((transaction, index) => (
                  <div
                    key={transaction.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-2"
                  >
                    <div className="flex justify-between text-sm text-gray-500">
                      <span className="font-medium">SL:</span>
                      <span>{(page - 1) * (data.per_page || 10) + index + 1}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span className="font-medium">Transaction ID:</span>
                      <span>{transaction.transactional_id}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span className="font-medium">Amount:</span>
                      <span
                        className={`font-semibold ${parseFloat(transaction.amount) >= 0 ? 'text-green-600' : 'text-red-600'
                          }`}
                      >
                        {formatAmount(transaction.amount)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span className="font-medium">Charge Remarks:</span>
                      <span>{transaction.remarks || '-'}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-500">
                      <span className="font-medium">Created Time:</span>
                      <span>{formatDate(transaction.created_at)}</span>
                    </div>
                  </div>
                ))
                : (
                  <div className="text-center text-gray-500">
                    <Receipt className="h-12 w-12 mx-auto mb-2" />
                    <p className="text-lg font-medium">No transactions found</p>
                  </div>
                )}
          </div>
        </div>

        {/* Pagination */}
        {data && data.last_page > 1 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={handlePrev}
                disabled={page === 1}
                className="px-4 py-2 text-sm font-medium border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={handleNext}
                disabled={page === data.last_page}
                className="px-4 py-2 ml-3 text-sm font-medium border border-gray-300 rounded-md bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>

            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <p className="text-sm text-gray-700">
                Showing <span className="font-medium">{(page - 1) * (data.per_page || 10) + 1}</span> to{' '}
                <span className="font-medium">{Math.min(page * (data.per_page || 10), data.total)}</span> of{' '}
                <span className="font-medium">{data.total}</span> results
              </p>
              <nav className="inline-flex rounded-md shadow-sm -space-x-px">
                <button
                  onClick={handlePrev}
                  disabled={page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={page === data.last_page}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
