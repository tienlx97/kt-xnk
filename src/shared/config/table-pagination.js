/** @param {{ pageIndex: number, pageSize: number, totalCount: number, totalPages: number } | undefined} pagination
 * @param {number} visibleCount
 */
export function tablePagination(pagination, visibleCount) {
  const totalPages = Math.max(1, pagination?.totalPages ?? 1);
  const currentPage = Math.max(
    1,
    Math.min(pagination?.pageIndex ?? 1, totalPages),
  );
  const pageStart = (currentPage - 1) * (pagination?.pageSize ?? visibleCount);
  const totalCount = pagination?.totalCount ?? visibleCount;
  const rangeStart = visibleCount === 0 || totalCount === 0 ? 0 : pageStart + 1;
  const rangeEnd =
    rangeStart === 0 ? 0 : Math.min(pageStart + visibleCount, totalCount);
  return { currentPage, totalPages, rangeStart, rangeEnd };
}
