'use client';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { MARCHANT_TRANSACTION_API } from '@/api/api';
import { useDebounce } from './useDebounce';

export interface Transaction {
  id: string
  transactional_id: string
  transactional_type: string
  trx_id: string
  trx_type: string
  amount: string
  amount_in_base: string
  charge: string
  remarks: string
  user_id: string
  updated_at: string
  created_at: string
}
/* 
id
transactional_id
transactional_type
trx_id
trx_type
amount
amount_in_base
charge
remarks
user_id
updated_at
created_at
*/

export interface TransactionsPagination {
  current_page: number;
  data: Transaction[];
  per_page: number;
  total: number;
  last_page: number;
}

export interface TransactionsResponse {
  status: boolean;
  message: string;
  data: TransactionsPagination;
}

interface UseGetTransactionsProps {
  transaction_id?: string;
  created_at?: string;
  page?: number;
}

export const useGetTransactions = ({
  transaction_id,
  created_at,
  page = 1,
}: UseGetTransactionsProps = {}) => {
  const [data, setData] = useState<TransactionsPagination | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const debouncedTransactionId = useDebounce(transaction_id || '', 300);
  const debouncedCreatedAt = useDebounce(created_at || '', 300);
  const token = useSelector((state: RootState) => state.auth.token);

  const fetchData = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    const params = new URLSearchParams();
    if (debouncedTransactionId.trim()) params.set('transaction_id', debouncedTransactionId.trim());
    if (debouncedCreatedAt.trim()) params.set('created_at', debouncedCreatedAt.trim());
    params.set('page', String(page));

    const url = `${MARCHANT_TRANSACTION_API}${params.toString() ? `?${params.toString()}` : ''}`;

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json: TransactionsResponse = await res.json();

      if (json.status) {
        setData(json.data);
      } else {
        setError(json.message || 'Failed to fetch transactions');
        setData(undefined);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError('Failed to fetch transactions');
      setData(undefined);
    } finally {
      setLoading(false);
    }
  }, [token, debouncedTransactionId, debouncedCreatedAt, page]);

  // initial fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // refetch function
  const refetch = useCallback(async (delay = 2000) => {
    setLoading(true);
    if (delay > 0) await new Promise((res) => setTimeout(res, delay));
    await fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch };
};
