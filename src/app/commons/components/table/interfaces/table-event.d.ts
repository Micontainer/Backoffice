import { TableAction } from './table-action';


export interface TableEvent {
  type: 'click' | 'changed' | 'sync';
  source: any;
  action: TableAction;
}
