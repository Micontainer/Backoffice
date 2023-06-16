

export interface ResourceDTO {
  category: string;
  createdAt: number;
  updatedAt: number;
  slug: string;
  status: string;
  uid: string;
  coefficient: number;
  description: string;
  storagesSize?: number[];
  whatsapp?: string;
  phone?: string;
  email?: string;
  country?: string;
  province?: string;
  city?: string;
  latitude?: number;
  postalCode?: string;
  placeId?: string;
  fullAddress?: string;
  longitude?: number;
  secondaryText?: string;
  mainText?: string;
  hourFrom?: string;
  hourTo?: string;
  dimensionsM2?: number;
  depth?: number;
  width?: number;
  height?: number;
  price?: number;
  areaCoefficient?: number;
  value?: number;
  coefficients?: [];
  areaCoefficientUID?: string;
  attachmentUID?: string;
  image?: any;
  relations?: any;
}

export interface AccountDTO {
  category: string;
  createdAt: number;
  updatedAt: number;
  uid: string;
  slug: string;
  status: string;
  route?: string;
  name?: string;
  guid?: string;
  mimeType?: string;
  address?: string;
  document?: string;
  businessName?: string;
  type?: string;
  phone?: string;
  email?: string;
  registryToken?: string;
  password?: string;
  defaultRole?: string;
  ariaRole?: string;
}

export interface RecordDTO {
  uid: string;
  description: string;
  comments: string;
  dueDate: number;
  referenceCode: string;
  storageWidth: number;
  branchOfficeBaseValue: number;
  storage: string;
  storageUid: string;
  bookedFromTime: string;
  bookedFromDate: string;
  building: string;
  createdAt: number;
  branchOfficeUid: string;
  price: number;
  userEmail: string;
  levelUid: string;
  slug: string;
  timestamp: number;
  updatedAt: number;
  levelCoefficient: number;
  level: string;
  buildingCoefficient: number;
  bookedFrom: number;
  storageHeight: number;
  storageDepth: number;
  branchOffice: string;
  buildingUid: string;
  storageDimensionM2: number;
  storageCoefficient: number;
  status: string;
  attachment: {
    guid: string;
  };
}