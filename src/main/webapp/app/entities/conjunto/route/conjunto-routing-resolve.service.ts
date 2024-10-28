import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IConjunto } from '../conjunto.model';
import { ConjuntoService } from '../service/conjunto.service';

const conjuntoResolve = (route: ActivatedRouteSnapshot): Observable<null | IConjunto> => {
  const id = route.params.id;
  if (id) {
    return inject(ConjuntoService)
      .find(id)
      .pipe(
        mergeMap((conjunto: HttpResponse<IConjunto>) => {
          if (conjunto.body) {
            return of(conjunto.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default conjuntoResolve;
