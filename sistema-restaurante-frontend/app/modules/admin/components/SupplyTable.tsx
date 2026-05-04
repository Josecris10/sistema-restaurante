import { Suspense } from 'react';
import { Await } from 'react-router';
import { Pencil } from 'lucide-react';
import type { InventorySupply } from '../domain/inventory';

interface SupplyTableProps {
  suppliesPromise: Promise<InventorySupply[]>;
}

export function SupplyTable({ suppliesPromise }: SupplyTableProps) {
  return (
    <div className='bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col'>
      {/* Header estático */}
      <div className='p-6 border-b border-gray-100'>
        <h2 className='text-lg font-bold text-brand-dark'>Estado de Insumos</h2>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full text-left text-sm'>
          <thead className='bg-brand-surface text-brand-muted'>
            <tr>
              <th className='px-6 py-3 font-semibold'>Insumo</th>
              <th className='px-6 py-3 font-semibold text-right'>
                Stock Actual
              </th>
              <th className='px-6 py-3 font-semibold text-center'>Estado</th>
              <th className='px-6 py-3 font-semibold text-center'>Acciones</th>
            </tr>
          </thead>

          <Suspense
            fallback={
              <tbody className='divide-y divide-gray-100'>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className='animate-pulse'>
                    <td className='px-6 py-4'>
                      <div className='h-8 bg-gray-100 rounded w-full'></div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='h-8 bg-gray-100 rounded w-full'></div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='h-8 bg-gray-100 rounded w-full'></div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='h-8 bg-gray-100 rounded w-full'></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            }
          >
            <Await resolve={suppliesPromise}>
              {(supplies) => (
                <tbody className='divide-y divide-gray-100'>
                  {supplies.map((supply) => {
                    const isOutOfStock = supply.currentStock === 0;
                    const isCritical =
                      !isOutOfStock && supply.currentStock <= supply.minStock;
                    const isOptimal = supply.currentStock > supply.minStock;

                    return (
                      <tr
                        key={supply.id}
                        className='hover:bg-gray-50 transition-colors'
                      >
                        <td className='px-6 py-4'>
                          <p className='font-bold text-brand-dark'>
                            {supply.name}
                          </p>
                          <p className='text-xs text-brand-muted mt-0.5'>
                            {supply.category}
                          </p>
                        </td>
                        <td className='px-6 py-4 text-right font-mono font-medium text-brand-dark'>
                          {supply.currentStock}{' '}
                          <span className='text-brand-muted text-xs ml-1'>
                            {supply.unit}
                          </span>
                        </td>
                        <td className='px-6 py-4 text-center'>
                          {isOutOfStock && (
                            <span className='inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700'>
                              Sin Stock
                            </span>
                          )}
                          {isCritical && (
                            <span className='inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-100 text-orange-700'>
                              Crítico
                            </span>
                          )}
                          {isOptimal && (
                            <span className='inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold bg-green-100 text-brand-success'>
                              Óptimo
                            </span>
                          )}
                        </td>
                        <td className='px-6 py-4 text-center'>
                          <button className='p-2 text-brand-muted hover:text-brand-accent transition-colors rounded-md hover:bg-brand-surface'>
                            <Pencil className='w-4 h-4' />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              )}
            </Await>
          </Suspense>
        </table>
      </div>
    </div>
  );
}
