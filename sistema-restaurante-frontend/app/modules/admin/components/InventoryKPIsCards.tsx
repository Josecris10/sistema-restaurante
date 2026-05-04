import { Boxes, AlertTriangle, XOctagon, CalendarClock } from 'lucide-react';
import { KPICard } from './KPICard';
import { type InventoryKPIs } from '../domain/inventory';

interface InventoryKPIsCardsProps {
  kpisPromise: Promise<InventoryKPIs>;
}

export function InventoryKPIsCards({ kpisPromise }: InventoryKPIsCardsProps) {
  // La configuración ahora es ESTÁTICA, no depende de que los datos existan todavía.
  // Solo le pasamos el "dataKey" para que la tarjeta sepa qué buscar en la promesa.
  const kpiConfig: Array<{
    dataKey: keyof InventoryKPIs;
    label: string;
    icon: any;
    colorClass: string;
    bgClass: string;
    borderColorClass: string;
  }> = [
    {
      dataKey: 'totalSupplies',
      label: 'Total de Insumos',
      icon: Boxes,
      colorClass: 'text-brand-accent',
      bgClass: 'bg-brand-surface',
      borderColorClass: 'border-black-500',
    },
    {
      dataKey: 'criticalStock',
      label: 'Stock Crítico',
      icon: AlertTriangle,
      colorClass: 'text-orange-500',
      bgClass: 'bg-orange-50',
      borderColorClass: 'border-yellow-500',
    },
    {
      dataKey: 'outOfStock',
      label: 'Sin Stock',
      icon: XOctagon,
      colorClass: 'text-red-600',
      bgClass: 'bg-red-50',
      borderColorClass: 'border-red-600',
    },
    {
      dataKey: 'nearExpiration',
      label: 'Prontos a Vencer',
      icon: CalendarClock,
      colorClass: 'text-yellow-600',
      bgClass: 'bg-yellow-50',
      borderColorClass: 'border-yellow-600  ',
    },
  ];

  return (
    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
      {kpiConfig.map((kpi) => (
        <KPICard
          key={kpi.dataKey}
          {...kpi}
          kpisPromise={kpisPromise} // Le pasamos la promesa a cada tarjeta
        />
      ))}
    </div>
  );
}
