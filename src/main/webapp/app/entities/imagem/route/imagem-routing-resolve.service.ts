import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IImagem } from '../imagem.model';
import { ImagemService } from '../service/imagem.service';

const imagemResolve = (route: ActivatedRouteSnapshot): Observable<null | IImagem> => {
  const id = route.params.id;
  if (id) {
    return inject(ImagemService)
      .find(id)
      .pipe(
        mergeMap((imagem: HttpResponse<IImagem>) => {
          if (imagem.body) {
            return of(imagem.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default imagemResolve;
