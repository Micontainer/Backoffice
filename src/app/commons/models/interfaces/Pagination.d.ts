

export interface Pagination<T> {
  total: number;
  size: number;
  content: T[];
}
