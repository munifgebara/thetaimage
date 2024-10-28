import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import ClasseResolve from './route/classe-routing-resolve.service';

const classeRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/classe.component').then(m => m.ClasseComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/classe-detail.component').then(m => m.ClasseDetailComponent),
    resolve: {
      classe: ClasseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/classe-update.component').then(m => m.ClasseUpdateComponent),
    resolve: {
      classe: ClasseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/classe-update.component').then(m => m.ClasseUpdateComponent),
    resolve: {
      classe: ClasseResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default classeRoute;
