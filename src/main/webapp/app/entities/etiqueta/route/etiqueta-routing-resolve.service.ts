import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEtiqueta } from '../etiqueta.model';
import { EtiquetaService } from '../service/etiqueta.service';

const etiquetaResolve = (route: ActivatedRouteSnapshot): Observable<null | IEtiqueta> => {
  const id = route.params.id;
  if (id) {
    return inject(EtiquetaService)
      .find(id)
      .pipe(
        mergeMap((etiqueta: HttpResponse<IEtiqueta>) => {
          if (etiqueta.body) {
            return of(etiqueta.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default etiquetaResolve;
