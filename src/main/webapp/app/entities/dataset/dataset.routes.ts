import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import DatasetResolve from './route/dataset-routing-resolve.service';

const datasetRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/dataset.component').then(m => m.DatasetComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/dataset-detail.component').then(m => m.DatasetDetailComponent),
    resolve: {
      dataset: DatasetResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/dataset-update.component').then(m => m.DatasetUpdateComponent),
    resolve: {
      dataset: DatasetResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/dataset-update.component').then(m => m.DatasetUpdateComponent),
    resolve: {
      dataset: DatasetResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default datasetRoute;
