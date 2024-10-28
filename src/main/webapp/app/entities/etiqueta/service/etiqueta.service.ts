import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEtiqueta, NewEtiqueta } from '../etiqueta.model';

export type PartialUpdateEtiqueta = Partial<IEtiqueta> & Pick<IEtiqueta, 'id'>;

export type EntityResponseType = HttpResponse<IEtiqueta>;
export type EntityArrayResponseType = HttpResponse<IEtiqueta[]>;

@Injectable({ providedIn: 'root' })
export class EtiquetaService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/etiquetas');

  create(etiqueta: NewEtiqueta): Observable<EntityResponseType> {
    return this.http.post<IEtiqueta>(this.resourceUrl, etiqueta, { observe: 'response' });
  }

  update(etiqueta: IEtiqueta): Observable<EntityResponseType> {
    return this.http.put<IEtiqueta>(`${this.resourceUrl}/${this.getEtiquetaIdentifier(etiqueta)}`, etiqueta, { observe: 'response' });
  }

  partialUpdate(etiqueta: PartialUpdateEtiqueta): Observable<EntityResponseType> {
    return this.http.patch<IEtiqueta>(`${this.resourceUrl}/${this.getEtiquetaIdentifier(etiqueta)}`, etiqueta, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEtiqueta>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEtiqueta[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEtiquetaIdentifier(etiqueta: Pick<IEtiqueta, 'id'>): number {
    return etiqueta.id;
  }

  compareEtiqueta(o1: Pick<IEtiqueta, 'id'> | null, o2: Pick<IEtiqueta, 'id'> | null): boolean {
    return o1 && o2 ? this.getEtiquetaIdentifier(o1) === this.getEtiquetaIdentifier(o2) : o1 === o2;
  }

  addEtiquetaToCollectionIfMissing<Type extends Pick<IEtiqueta, 'id'>>(
    etiquetaCollection: Type[],
    ...etiquetasToCheck: (Type | null | undefined)[]
  ): Type[] {
    const etiquetas: Type[] = etiquetasToCheck.filter(isPresent);
    if (etiquetas.length > 0) {
      const etiquetaCollectionIdentifiers = etiquetaCollection.map(etiquetaItem => this.getEtiquetaIdentifier(etiquetaItem));
      const etiquetasToAdd = etiquetas.filter(etiquetaItem => {
        const etiquetaIdentifier = this.getEtiquetaIdentifier(etiquetaItem);
        if (etiquetaCollectionIdentifiers.includes(etiquetaIdentifier)) {
          return false;
        }
        etiquetaCollectionIdentifiers.push(etiquetaIdentifier);
        return true;
      });
      return [...etiquetasToAdd, ...etiquetaCollection];
    }
    return etiquetaCollection;
  }
}
