'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createShipmentCostCategory,
  listShipmentCostCategories,
} from '../api/shipment-cost-categories.js';

const QUERY_KEY = ['logistics-contracts', 'shipment-cost-categories'];

export function useShipmentCostCategoriesQuery() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: () => listShipmentCostCategories(),
  });
}

export function useCreateShipmentCostCategoryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      /** @type {{ values: import('../types/index.js').ShipmentCostCategoryFormValues }} */ {
        values,
      },
    ) => createShipmentCostCategory(values),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      }
    },
  });
}
