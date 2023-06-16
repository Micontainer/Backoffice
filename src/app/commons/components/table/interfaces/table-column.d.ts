

export interface TableColumn {
  id: number;
  property: string;
  label: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  filterable?: boolean;
  type?: 'toggle' | 'text' | 'action' | 'check' | 'currency' | 'button';
  dataProperty?: string;
}
