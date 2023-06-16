import { TableColumn } from './table-column';


export interface TableOptions {
  columns: TableColumn[];
  collection: any[];
  length: 10 | 25 | 50 | 100;
  syncIntervalMillis?: number;
}
