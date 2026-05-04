export enum UnitMeasure {
  GRAMS = 'GR',
  KILOGRAMS = 'KG',
  LITERS = 'L',
  UNITS = 'UN',
}

export interface InventorySupply {
  id: string;
  name: string;
  category: string;
  unit: UnitMeasure;
  minStock: number;
  currentStock: number;
  lastUpdated: string;
}

export interface InventoryBatch {
  id: string;
  inventorySupplyId: string;
  brand: string;
  purchaseDate: string;
  expirationDate: Date | null;
  cost: number;
  quantity: number;
}

export interface InventoryKPIs {
  totalSupplies: number;
  criticalStock: number;
  outOfStock: number;
  nearExpiration: number;
}
