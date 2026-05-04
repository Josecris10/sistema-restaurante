import { useLoaderData, Await } from 'react-router';
import { InventoryService } from '../services/inventory.service';
import { Plus, Boxes, AlertTriangle, XOctagon, Pencil } from 'lucide-react';
import { InventoryHeader } from '../components/InventoryHeader';
import { Suspense } from 'react';
import { InventorySkeleton } from '../components/InventorySkeleton';
import { InventoryDashboardContent } from '../components/InventoryDashboardContent';

// 1. CARGA DE DATOS (Loader)
export async function clientLoader() {
  const dashboardPromise = InventoryService.getDashboardSummary();
  return {
    dashboardData: dashboardPromise,
  };
}

export default function InventoryPage() {
  // Consumimos los datos tipados desde el loader
  const { dashboardData } = useLoaderData<typeof clientLoader>();

  return (
    <div className='flex flex-col gap-8'>
      <InventoryHeader />
      {/* El contenido se monta de inmediato, la espera se gestiona adentro */}
      <InventoryDashboardContent dashboardPromise={dashboardData} />
    </div>
  );
}
