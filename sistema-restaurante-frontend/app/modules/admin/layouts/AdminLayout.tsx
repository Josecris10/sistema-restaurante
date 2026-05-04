import { Outlet, NavLink } from 'react-router';
import { adminNavigation } from '../admin.routes';
import { Dot, OctagonMinus } from 'lucide-react';

export default function AdminLayout() {
  return (
    <div className='flex h-screen w-full bg-brand-base font-sans text-brand-dark'>
      <aside className='flex flex-col w-64 bg-brand-surface border-r border-gray-200 shadow-sm'>
        <div className='flex items-center justify-center h-16 border-b border-gray-200'>
          <h2 className='text-xl font-bold'>Restaurante</h2>
        </div>

        {/* Navegación */}
        <nav className='flex flex-col flex-1 p-4 space-y-1'>
          {adminNavigation.map((route) => {
            const Icon = route.icon ?? Dot;
            return (
              <NavLink
                key={route.path}
                to={route.path === '' ? '/admin' : `/admin/${route.path}`}
                end={route.index}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-brand-accent text-white shadow-sm'
                      : 'text-brand-muted hover:bg-white hover:text-brand-dark'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      className={`w-5 h-5 shrink-0 transition-colors ${
                        isActive
                          ? 'text-white'
                          : 'text-brand-muted group-hover:text-brand-dark'
                      }`}
                    />
                    <span
                      className={`ml-3 text-sm tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}
                    >
                      {route.label}
                    </span>
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>
      <main className='flex flex-col flex-1 overflow-hidden'>
        <header className='flex items-center justify-end h-16 px-8 bg-brand-dark text-brand-base shadow-sm'>
          <div className='flex items-center space-x-3'>
            <span className='text-sm font-medium'>Administrador</span>
            <div className='w-8 h-8 bg-brand-accent rounded-full flex items-center justify-center text-white font-bold'>
              A
            </div>
          </div>
        </header>
        <section className='flex-1 p-8 overflow-y-auto'>
          <Outlet />
        </section>
      </main>
    </div>
  );
}
