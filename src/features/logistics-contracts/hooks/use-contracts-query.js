'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createContract, listContracts, updateContract } from '../api/contracts.js';

const QUERY_KEY = ['logistics-contracts', 'contracts'];

/** @param {{ page: number, pageSize: number }} params */
export function useContractsQuery({ page, pageSize }) {
  return useQuery({
    queryKey: [...QUERY_KEY, page, pageSize],
    queryFn: () => listContracts({ page, pageSize }),
  });
}

export function useCreateContractMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      /** @type {{ values: import('../types/index.js').ContractFormValues, extra: Parameters<typeof createContract>[1] }} */ {
        values,
        extra,
      },
    ) => createContract(values, extra),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      }
    },
  });
}

export function useUpdateContractMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      /** @type {{ contractId: string, values: import('../types/index.js').ContractFormValues, extra: Parameters<typeof updateContract>[2] }} */ {
        contractId,
        values,
        extra,
      },
    ) => updateContract(contractId, values, extra),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      }
    },
  });
}
