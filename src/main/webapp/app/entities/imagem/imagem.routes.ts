import { Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { ASC } from 'app/config/navigation.constants';
import ImagemResolve from './route/imagem-routing-resolve.service';

const imagemRoute: Routes = [
  {
    path: '',
    loadComponent: () => import('./list/imagem.component').then(m => m.ImagemComponent),
    data: {
      defaultSort: `id,${ASC}`,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    loadComponent: () => import('./detail/imagem-detail.component').then(m => m.ImagemDetailComponent),
    resolve: {
      imagem: ImagemResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    loadComponent: () => import('./update/imagem-update.component').then(m => m.ImagemUpdateComponent),
    resolve: {
      imagem: ImagemResolve,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    loadComponent: () => import('./update/imagem-update.component').then(m => m.ImagemUpdateComponent),
    resolve: {
      imagem: ImagemResolve,
    },
    canActivate: [UserRouteAccessService],
  },
];

export default imagemRoute;
