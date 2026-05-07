export interface PagedResponseDto<T> {
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
}
