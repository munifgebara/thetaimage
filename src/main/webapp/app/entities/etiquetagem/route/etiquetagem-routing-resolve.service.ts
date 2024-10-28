import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEtiquetagem } from '../etiquetagem.model';
import { EtiquetagemService } from '../service/etiquetagem.service';

const etiquetagemResolve = (route: ActivatedRouteSnapshot): Observable<null | IEtiquetagem> => {
  const id = route.params.id;
  if (id) {
    return inject(EtiquetagemService)
      .find(id)
      .pipe(
        mergeMap((etiquetagem: HttpResponse<IEtiquetagem>) => {
          if (etiquetagem.body) {
            return of(etiquetagem.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default etiquetagemResolve;
