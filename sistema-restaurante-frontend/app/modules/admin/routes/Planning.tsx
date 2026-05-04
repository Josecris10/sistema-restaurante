export default function Planning() {
  return (
    <div className='flex flex-col gap-6'>
      {/* Encabezado de la página */}
      <div>
        <h1 className='text-3xl font-bold text-brand-dark'>Planificación</h1>
        <p className='text-brand-muted mt-1'>Planifica la producción semanal</p>
      </div>

      {/* Tarjeta de prueba usando tu color de fondo 'surface' */}
      <div className='bg-white p-6 rounded-xl border border-gray-200 shadow-sm'>
        <h2 className='text-lg font-semibold text-brand-dark mb-4'>
          Ventas Totales
        </h2>
        <p className='text-4xl font-bold text-brand-accent'>$0</p>
        <p className='text-sm text-brand-success mt-2'>
          ▲ Sistema iniciado correctamente
        </p>
      </div>
    </div>
  );
}
