'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import {
  createShipmentCostItemTemplate,
  listShipmentCostItemTemplates,
} from '../api/shipment-cost-item-templates.js';

const QUERY_KEY = ['logistics-contracts', 'shipment-cost-item-templates'];

/**
 * @param {{ costCategoryId?: string }} [options] Filter to templates of one
 *   cost category; omit to list templates of every category.
 */
export function useShipmentCostItemTemplatesQuery({ costCategoryId } = {}) {
  return useQuery({
    queryKey: [...QUERY_KEY, costCategoryId ?? null],
    queryFn: () => listShipmentCostItemTemplates({ costCategoryId }),
  });
}

export function useCreateShipmentCostItemTemplateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      /** @type {{ values: import('../types/index.js').ShipmentCostItemTemplateFormValues }} */ {
        values,
      },
    ) => createShipmentCostItemTemplate(values),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      }
    },
  });
}
