'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createCustomer, listCustomers } from '../api/customers.js';

const QUERY_KEY = ['logistics-contracts', 'customers'];

export function useCustomersQuery() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: listCustomers,
  });
}

export function useCreateCustomerMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      /** @type {{ values: import('../types/index.js').CustomerFormValues, extraFieldRows: import('../types/index.js').ExtraFieldRow[] }} */ {
        values,
        extraFieldRows,
      },
    ) => createCustomer(values, extraFieldRows),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      }
    },
  });
}
