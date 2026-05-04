import { Boxes, Plus } from 'lucide-react';

export function InventoryHeader() {
  return (
    <div className='flex items-center justify-between'>
      <div>
        <h1 className='text-2xl font-bold text-brand-dark'>
          Gestión de Inventario
        </h1>
        <p className='text-brand-muted'>Control de insumos y lotes de compra</p>
      </div>
      <div className='flex items-center gap-3'>
        <button className='flex items-center px-4 py-2 bg-white border border-gray-300 text-brand-dark rounded-lg font-semibold hover:bg-gray-50 transition-colors shadow-sm'>
          <Boxes className='w-4 h-4 mr-2 text-brand-muted' />
          Nuevo Insumo
        </button>
        <button className='flex items-center px-4 py-2 bg-brand-accent text-white rounded-lg font-semibold hover:bg-orange-600 transition-colors shadow-sm'>
          <Plus className='w-5 h-5 mr-2' />
          Nueva Compra
        </button>
      </div>
    </div>
  );
}
