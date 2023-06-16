import { TableActionModel } from '../components/table/models/table-action.model';


export class ShapeModel extends TableActionModel {

  uuid: string;
  name: string;
  height: number;
  width: number;
  depth: number;
  status: string;
  statusData: boolean;
  created: string;

  constructor() {
    super();
    this.uuid = "";
    this.name = "";
    this.height = 0;
    this.width = 0;
    this.depth = 0;
    this.status = "";
    this.statusData = false;
    this.created = "";
  }

}
