import { TableActionModel } from '../components/table/models/table-action.model';


export class StorageModel extends TableActionModel {
  uuid: string;
  description: string;
  maxCapacity: number;
  type: string;
  status: string;
  statusData: boolean;
  created: string;
  branchOfficeUUID: string;
  branchOfficeName: string;

  get capacityLabel(): string {
    return `Capacidad ${this.maxCapacity}mts3`;
  }

  get typeLabel(): string {
    return `Tamaño ${StorageSizeTranslation[this.type]}`;
  }

  constructor() {
    super();
    this.uuid = "";
    this.type = "";
    this.description = "";
    this.maxCapacity = 0;
    this.status = "";
    this.statusData = false;
    this.created = "";
    this.branchOfficeUUID = "";
    this.branchOfficeName = "";
  }
}

const StorageSizeTranslation: StorageSizeType = {
  small: 'Pequeño',
  medium: 'Mediano',
  large: 'Grande',
  special: 'Especial',
};

interface StorageSizeType {
  [name: string]: string;
}
