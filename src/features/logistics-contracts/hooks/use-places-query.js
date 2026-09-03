'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createPlace, listPlaces } from '../api/places.js';

const QUERY_KEY = ['logistics-contracts', 'places'];

/**
 * @param {{ countryId?: string, enabled?: boolean }} [options] Filter to
 *   places of one country; omit `countryId` to list places of every
 *   country. `enabled` (default `true`) lets a caller that only wants a
 *   country-scoped list — never the unfiltered one — skip fetching until
 *   `countryId` is known, mirroring `useBranchesQuery(companyId)`.
 */
export function usePlacesQuery({ countryId, enabled = true } = {}) {
  return useQuery({
    queryKey: [...QUERY_KEY, countryId ?? null],
    queryFn: () => listPlaces({ countryId }),
    enabled,
  });
}

export function useCreatePlaceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      /** @type {{ values: import('../types/index.js').PlaceFormValues }} */ {
        values,
      },
    ) => createPlace(values),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      }
    },
  });
}
