import { Suspense, useEffect, useState } from 'react'; // 1. Importamos useState
import { Await } from 'react-router';
import { type LucideIcon } from 'lucide-react';
import { type InventoryKPIs } from '../domain/inventory';

interface KPICardProps {
  label: string;
  icon: LucideIcon;
  colorClass: string; // Ej: 'text-orange-500'
  bgClass: string;
  kpisPromise: Promise<InventoryKPIs>;
  dataKey: keyof InventoryKPIs;
  borderColorClass: string;
}

export function KPICard({
  label,
  icon: Icon,
  colorClass,
  bgClass,
  kpisPromise,
  dataKey,
  borderColorClass,
}: KPICardProps) {
  // 2. Estado local para saber si los datos ya llegaron
  const [isLoaded, setIsLoaded] = useState(false);

  // 3. Clases base dinámicas. Por defecto borde neutro, cambia cuando carga.
  const containerClasses = `
    bg-white p-6 rounded-xl shadow-sm flex items-center transition-all duration-300
    border-2
    ${isLoaded ? `${borderColorClass}` : 'border-gray-200'}
  `.trim();

  return (
    <div className={containerClasses}>
      <div className={`p-4 ${bgClass} rounded-lg mr-4`}>
        <Icon className={`w-6 h-6 ${colorClass}`} />
      </div>
      <div>
        <p className='text-sm font-medium text-brand-muted'>{label}</p>

        <div className='text-2xl font-bold text-brand-dark min-h-[32px] mt-0.5 flex items-end'>
          <Suspense
            fallback={
              <div className='h-7 w-12 bg-gray-100 animate-pulse rounded mt-1'></div>
            }
          >
            <Await resolve={kpisPromise}>
              {(kpis) => (
                /* 4. Usamos un componente interno para trigger el estado loaded */
                <ActiveValue
                  kpis={kpis}
                  dataKey={dataKey}
                  onLoaded={() => setIsLoaded(true)}
                />
              )}
            </Await>
          </Suspense>
        </div>
      </div>
    </div>
  );
}

// Avisar al padre cuando se monta con datos
function ActiveValue({
  kpis,
  dataKey,
  onLoaded,
}: {
  kpis: InventoryKPIs;
  dataKey: keyof InventoryKPIs;
  onLoaded: () => void;
}) {
  useEffect(() => {
    onLoaded();
  }, [onLoaded]);

  return <span>{kpis[dataKey] ?? 0}</span>;
}
