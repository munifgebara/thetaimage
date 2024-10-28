import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import EtiquetaResolve from './route/etiqueta-routing-resolve.service';

const etiquetaRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/etiqueta.component').then(m => m.EtiquetaComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/etiqueta-detail.component').then(m => m.EtiquetaDetailComponent),
    resolve: {
      etiqueta: EtiquetaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/etiqueta-update.component').then(m => m.EtiquetaUpdateComponent),
    resolve: {
      etiqueta: EtiquetaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/etiqueta-update.component').then(m => m.EtiquetaUpdateComponent),
    resolve: {
      etiqueta: EtiquetaResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default etiquetaRoute;
