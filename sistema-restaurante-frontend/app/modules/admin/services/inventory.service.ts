import {
  type InventorySupply,
  type InventoryBatch,
  type InventoryKPIs,
  UnitMeasure,
} from '../domain/inventory';

// --- DATOS DUROS (Privados para este archivo) ---
const mockSupplies: InventorySupply[] = [
  {
    id: 'S1',
    name: 'Harina de Trigo',
    category: 'Abarrotes',
    unit: UnitMeasure.KILOGRAMS,
    minStock: 20,
    currentStock: 50,
    lastUpdated: '05-03-2026',
  },
  {
    id: 'S2',
    name: 'Salsa de Tomate',
    category: 'Abarrotes',
    unit: UnitMeasure.LITERS,
    minStock: 10,
    currentStock: 8,
    lastUpdated: '05-03-2026',
  }, // CRÍTICO
  {
    id: 'S3',
    name: 'Carne Molida',
    category: 'Proteínas',
    unit: UnitMeasure.KILOGRAMS,
    minStock: 5,
    currentStock: 0,
    lastUpdated: '05-03-2026',
  }, // SIN STOCK
  {
    id: 'S4',
    name: 'Cebolla',
    category: 'Verduras',
    unit: UnitMeasure.KILOGRAMS,
    minStock: 5,
    currentStock: 12,
    lastUpdated: '05-03-2026',
  },
];

const mockBatches: InventoryBatch[] = [
  {
    id: 'B101',
    inventorySupplyId: 'S1',
    brand: 'Selecta',
    purchaseDate: '2026-05-01',
    expirationDate: new Date('2026-12-01'),
    cost: 15000,
    quantity: 25,
  },
  {
    id: 'B102',
    inventorySupplyId: 'S2',
    brand: 'Pomarola',
    purchaseDate: '2026-05-02',
    expirationDate: new Date('2026-08-15'),
    cost: 8500,
    quantity: 8,
  },
  {
    id: 'B103',
    inventorySupplyId: 'S4',
    brand: 'Feria Local',
    purchaseDate: '2026-05-03',
    expirationDate: new Date('2026-05-15'),
    cost: 4000,
    quantity: 12,
  },
];

// --- EL SERVICIO EXPORTADO ---
export const InventoryService = {
  /**
   * Obtiene todos los datos necesarios para la vista principal del Dashboard de Inventario
   */
  async getDashboardSummary() {
    // Simulamos la latencia de red hacia tu backend en NestJS
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Calculamos los KPIs dinámicamente basándonos en los mocks para que siempre sean reales
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const limit = new Date();
    limit.setDate(limit.getDate() + 7);
    limit.setHours(0, 0, 0, 0);

    const kpis: InventoryKPIs = {
      totalSupplies: mockSupplies.length,
      criticalStock: mockSupplies.filter(
        (s) => s.currentStock > 0 && s.currentStock <= s.minStock,
      ).length,
      outOfStock: mockSupplies.filter((s) => s.currentStock === 0).length,
      nearExpiration: mockBatches.filter((s) => {
        if (!s.expirationDate) return false;

        const expirationDate = new Date(s.expirationDate);
        expirationDate.setHours(0, 0, 0, 0);

        return expirationDate >= today && expirationDate <= limit;
      }).length,
    };

    return {
      kpis,
      supplies: mockSupplies,
      recentBatches: mockBatches
        .sort(
          (a, b) =>
            new Date(b.purchaseDate).getTime() -
            new Date(a.purchaseDate).getTime(),
        )
        .slice(0, 5), // Solo devolvemos los 5 más recientes para la tabla pequeña
    };
  },
};
