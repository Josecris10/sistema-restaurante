import { Suspense } from 'react';
import { Await } from 'react-router';
import type { InventoryBatch, InventorySupply } from '../domain/inventory';

interface RecentBatchesProps {
  dataPromise: Promise<{
    recentBatches: InventoryBatch[];
    supplies: InventorySupply[];
  }>;
}

export function RecentBatches({ dataPromise }: RecentBatchesProps) {
  return (
    <div className='bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden h-full'>
      {/* Header estático */}
      <div className='p-6 border-b border-gray-100 flex items-center justify-between shrink-0'>
        <h2 className='text-lg font-bold text-brand-dark'>Últimos Lotes</h2>
        <button className='text-sm text-brand-accent hover:text-orange-600 font-bold transition-colors'>
          Ver historial &rarr;
        </button>
      </div>

      <div className='flex-1 overflow-y-auto p-6 pt-2'>
        <Suspense
          fallback={
            <div className='space-y-4'>
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className='h-12 bg-gray-100 animate-pulse rounded-lg'
                ></div>
              ))}
            </div>
          }
        >
          <Await resolve={dataPromise}>
            {({ recentBatches, supplies }) => (
              <ul className='space-y-4'>
                {recentBatches.map((batch) => {
                  const supplyInfo = supplies.find(
                    (s) => s.id === batch.inventorySupplyId,
                  );
                  return (
                    <li
                      key={batch.id}
                      className='flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border border-transparent hover:border-gray-100'
                    >
                      <div>
                        <p className='font-bold text-sm text-brand-dark'>
                          {supplyInfo?.name || 'Insumo Eliminado'}
                        </p>
                        <div className='flex items-center text-xs text-brand-muted mt-1 space-x-2'>
                          <span className='font-medium px-1.5 py-0.5 bg-brand-surface rounded text-brand-dark'>
                            {batch.brand}
                          </span>
                          <span>•</span>
                          <span>
                            {new Date(batch.purchaseDate).toLocaleDateString(
                              'es-CL',
                            )}
                          </span>
                        </div>
                      </div>
                      <div className='text-right shrink-0 ml-4'>
                        <p className='font-mono font-bold text-brand-success text-sm'>
                          +{batch.quantity}{' '}
                          <span className='text-xs font-normal text-brand-muted'>
                            {supplyInfo?.unit}
                          </span>
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
