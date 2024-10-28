import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'authority',
    data: { pageTitle: 'Authorities' },
    loadChildren: () => import('./admin/authority/authority.routes'),
  },
  {
    path: 'classe',
    data: { pageTitle: 'Classes' },
    loadChildren: () => import('./classe/classe.routes'),
  },
  {
    path: 'conjunto',
    data: { pageTitle: 'Conjuntos' },
    loadChildren: () => import('./conjunto/conjunto.routes'),
  },
  {
    path: 'dataset',
    data: { pageTitle: 'Datasets' },
    loadChildren: () => import('./dataset/dataset.routes'),
  },
  {
    path: 'etiqueta',
    data: { pageTitle: 'Etiquetas' },
    loadChildren: () => import('./etiqueta/etiqueta.routes'),
  },
  {
    path: 'etiquetagem',
    data: { pageTitle: 'Etiquetagems' },
    loadChildren: () => import('./etiquetagem/etiquetagem.routes'),
  },
  {
    path: 'imagem',
    data: { pageTitle: 'Imagems' },
    loadChildren: () => import('./imagem/imagem.routes'),
  },
  {
    path: 'usuario',
    data: { pageTitle: 'Usuarios' },
    loadChildren: () => import('./usuario/usuario.routes'),
  },
  /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
];

export default routes;
