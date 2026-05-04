import { BookOpen, Calendar, LayoutDashboard, Package } from 'lucide-react';
import type { ComponentType } from 'react';

export interface AdminRoute {
  path: string;
  label: string;
  file: string;
  index?: boolean;
  icon?: ComponentType<{ className?: string }>;
}

export const adminNavigation: AdminRoute[] = [
  {
    path: '',
    label: 'Dashboard',
    file: 'modules/admin/routes/Dashboard.tsx',
    index: true,
    icon: LayoutDashboard,
  },
  {
    path: 'inventario',
    label: 'Inventario',
    file: 'modules/admin/routes/Inventory.tsx',
    icon: Package,
  },
  {
    path: 'catalogo',
    label: 'Catálogo y Recetas',
    file: 'modules/admin/routes/Catalog.tsx',
    icon: BookOpen,
  },
  {
    path: 'planificacion',
    label: 'Planificación',
    file: 'modules/admin/routes/Planning.tsx',
    icon: Calendar,
  },
];
