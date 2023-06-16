import { TableAction } from '../interfaces/table-action';


export abstract class TableActionModel {
  actions: TableAction[];

  constructor() {
    this.actions = new Array<TableAction>();
  }

  setActions(collection: TableAction[]): void {
    this.actions = collection;
  }
}
