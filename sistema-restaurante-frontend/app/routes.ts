import {
  type RouteConfig,
  index,
  layout,
  prefix,
  route,
} from '@react-router/dev/routes';
import { adminNavigation } from './modules/admin/admin.routes';

export default [
  index('shared/routes/login.tsx'),

  layout('core/guards/AuthGuard.tsx', [
    // ...prefix('garzon', [
    //   layout('modules/waiter/layouts/WaiterLayout.tsx', [
    //     index('modules/waiter/routes/TableMap.tsx'),
    //     route('pedido', 'modules/waiter/routes/OrderForm.tsx'),
    //   ]),
    // ]),

    // ...prefix('cocina', [
    //   layout('modules/kitchen/layouts/KitchenLayout.tsx', [
    //     index('modules/kitchen/routes/KdsBoard.tsx'), // URL: /cocina
    //     route('historial', 'modules/kitchen/routes/History.tsx'), // URL: /cocina/historial
    //   ]),
    // ]),

    ...prefix('admin', [
      layout('modules/admin/layouts/AdminLayout.tsx', [
        ...adminNavigation.map((nav) =>
          nav.index ? index(nav.file) : route(nav.path, nav.file),
        ),
      ]),
    ]),
  ]),
] satisfies RouteConfig;
