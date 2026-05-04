export function InventorySkeleton() {
  return (
    <div className='flex flex-col gap-8 animate-pulse'>
      {/* Skeleton de KPIs */}
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className='h-32 bg-gray-200 rounded-xl border border-gray-100'
          ></div>
        ))}
      </div>

      {/* Skeleton de Tablas */}
      <div className='grid grid-cols-1 xl:grid-cols-3 gap-6'>
        {/* Tabla grande */}
        <div className='xl:col-span-2 h-[500px] bg-gray-200 rounded-xl'></div>
        {/* Tabla lateral */}
        <div className='xl:col-span-1 h-[500px] bg-gray-200 rounded-xl'></div>
      </div>
    </div>
  );
}

export function TableRowsSkeleton({
  columns,
  rows,
}: {
  columns: number;
  rows: number;
}) {
  return (
    <tbody className='divide-y divide-gray-100'>
      {Array.from({ length: rows }).map((_, i) => (
        <tr key={i} className='animate-pulse'>
          {Array.from({ length: columns }).map((_, j) => (
            <td key={j} className='px-6 py-4'>
              <div className='h-4 bg-gray-100 rounded w-full'></div>
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}
