import { inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IDataset } from '../dataset.model';
import { DatasetService } from '../service/dataset.service';

const datasetResolve = (route: ActivatedRouteSnapshot): Observable<null | IDataset> => {
  const id = route.params.id;
  if (id) {
    return inject(DatasetService)
      .find(id)
      .pipe(
        mergeMap((dataset: HttpResponse<IDataset>) => {
          if (dataset.body) {
            return of(dataset.body);
          }
          inject(Router).navigate(['404']);
          return EMPTY;
        }),
      );
  }
  return of(null);
};

export default datasetResolve;
