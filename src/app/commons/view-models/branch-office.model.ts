import { TableActionModel } from '../components/table/models/table-action.model';


export class BranchOfficeModel extends TableActionModel {
  pk: string;
  name: string;
  status: string;
  statusData: boolean;
  created: string;
  baseValue: number;

  get switchId(): string {
    return `status-${this.pk}`;
  }

  get createdLabel(): string {
    return `Creada ${this.created}`;
  }

  constructor() {
    super();
    this.pk = "";
    this.name = "";
    this.status = "";
    this.statusData = false;
    this.created = "";
    this.baseValue = 0;
  }
}
