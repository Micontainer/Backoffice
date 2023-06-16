

export class MenuDataModel {
  id: number;
  label: string;
  path: string;
  icon: string;
  state: string;
  code: string;
  order: number;

  constructor() {
    this.id = 0;
    this.label = '';
    this.path = '';
    this.icon = '';
    this.state = '';
    this.code = '';
    this.order = 0;
  }
}
