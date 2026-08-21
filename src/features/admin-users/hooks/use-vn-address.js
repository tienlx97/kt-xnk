'use client';

import { useQuery } from '@tanstack/react-query';

import { fetchNewAddressData, fetchOldAddressData } from '../api/vn-address.js';

// Static files, never change at runtime — cache forever instead of
// refetching per the app's default staleTime.
const STATIC_QUERY_OPTIONS = { staleTime: Infinity, gcTime: Infinity };

export function useOldAddressQuery() {
  return useQuery({
    queryKey: ['admin-users', 'vn-address-old'],
    queryFn: fetchOldAddressData,
    ...STATIC_QUERY_OPTIONS,
  });
}

export function useNewAddressQuery() {
  return useQuery({
    queryKey: ['admin-users', 'vn-address-new'],
    queryFn: fetchNewAddressData,
    ...STATIC_QUERY_OPTIONS,
  });
}

/**
 * Old-address (Province → District → Ward) cascade for `UserContactFields`,
 * shared by `useCreateUserForm`/`useEditUserForm`. `oldProvince`/
 * `oldDistrict`/`oldWard` on the form are plain display-name strings
 * (that's what the backend field takes — see `register.js`), not codes, so
 * each level is resolved by looking up the previous level's selected *name*
 * in its list to find the code that scopes the next level's options.
 * @param {{ oldProvince: string, oldDistrict: string }} values
 * @param {import('../types/index.js').OldAddressData | undefined} oldData
 */
export function resolveOldAddressLists(values, oldData) {
  const provinces = oldData?.provinces ?? [];
  const provinceCode = provinces.find(
    (province) => province.name === values.oldProvince,
  )?.code;
  const districts = (oldData?.districts ?? []).filter(
    (district) => district.provinceCode === provinceCode,
  );
  const districtCode = districts.find(
    (district) => district.name === values.oldDistrict,
  )?.code;
  const wards = (oldData?.wards ?? []).filter(
    (ward) => ward.districtCode === districtCode,
  );
  return { provinces, districts, wards };
}

/**
 * New-address (Province → Ward) cascade — same idea as
 * {@link resolveOldAddressLists}, one level shallower (districts were
 * abolished in the 2025 merger).
 * @param {{ newProvince: string }} values
 * @param {import('../types/index.js').NewAddressData | undefined} newData
 */
export function resolveNewAddressLists(values, newData) {
  const provinces = newData?.provinces ?? [];
  const provinceCode = provinces.find(
    (province) => province.name === values.newProvince,
  )?.code;
  const wards = (newData?.wards ?? []).filter(
    (ward) => ward.provinceCode === provinceCode,
  );
  return { provinces, wards };
}
