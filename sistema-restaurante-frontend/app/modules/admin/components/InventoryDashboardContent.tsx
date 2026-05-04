import {
  type InventorySupply,
  type InventoryBatch,
  type InventoryKPIs,
} from '../domain/inventory';
import { InventoryKPIsCards } from './InventoryKPIsCards';
import { SupplyTable } from './SupplyTable';
import { RecentBatches } from './RecentBatches';

// 1. Cambiamos la interfaz para recibir la Promesa
interface InventoryDashboardContentProps {
  dashboardPromise: Promise<{
    kpis: InventoryKPIs;
    supplies: InventorySupply[];
    recentBatches: InventoryBatch[];
  }>;
}

export function InventoryDashboardContent({ dashboardPromise }: any) {
  return (
    <div className='flex flex-col gap-8'>
      {/* Enviamos promesas derivadas a cada hijo */}
      <InventoryKPIsCards
        kpisPromise={dashboardPromise.then((d: any) => d.kpis)}
      />

      <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
        <div className='xl:col-span-2'>
          <SupplyTable
            suppliesPromise={dashboardPromise.then((d: any) => d.supplies)}
          />
        </div>
        <div className='xl:col-span-1'>
          <RecentBatches dataPromise={dashboardPromise} />
        </div>
      </div>
    </div>
  );
}
