'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createCountry, listCountries } from '../api/countries.js';

const QUERY_KEY = ['logistics-contracts', 'countries'];

export function useCountriesQuery() {
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: listCountries,
  });
}

export function useCreateCountryMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      /** @type {{ values: import('../types/index.js').CountryFormValues }} */ {
        values,
      },
    ) => createCountry(values),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      }
    },
  });
}
