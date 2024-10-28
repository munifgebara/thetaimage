import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IConjunto, NewConjunto } from '../conjunto.model';

export type PartialUpdateConjunto = Partial<IConjunto> & Pick<IConjunto, 'id'>;

export type EntityResponseType = HttpResponse<IConjunto>;
export type EntityArrayResponseType = HttpResponse<IConjunto[]>;

@Injectable({ providedIn: 'root' })
export class ConjuntoService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/conjuntos');

  create(conjunto: NewConjunto): Observable<EntityResponseType> {
    return this.http.post<IConjunto>(this.resourceUrl, conjunto, { observe: 'response' });
  }

  update(conjunto: IConjunto): Observable<EntityResponseType> {
    return this.http.put<IConjunto>(`${this.resourceUrl}/${this.getConjuntoIdentifier(conjunto)}`, conjunto, { observe: 'response' });
  }

  partialUpdate(conjunto: PartialUpdateConjunto): Observable<EntityResponseType> {
    return this.http.patch<IConjunto>(`${this.resourceUrl}/${this.getConjuntoIdentifier(conjunto)}`, conjunto, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IConjunto>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IConjunto[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getConjuntoIdentifier(conjunto: Pick<IConjunto, 'id'>): number {
    return conjunto.id;
  }

  compareConjunto(o1: Pick<IConjunto, 'id'> | null, o2: Pick<IConjunto, 'id'> | null): boolean {
    return o1 && o2 ? this.getConjuntoIdentifier(o1) === this.getConjuntoIdentifier(o2) : o1 === o2;
  }

  addConjuntoToCollectionIfMissing<Type extends Pick<IConjunto, 'id'>>(
    conjuntoCollection: Type[],
    ...conjuntosToCheck: (Type | null | undefined)[]
  ): Type[] {
    const conjuntos: Type[] = conjuntosToCheck.filter(isPresent);
    if (conjuntos.length > 0) {
      const conjuntoCollectionIdentifiers = conjuntoCollection.map(conjuntoItem => this.getConjuntoIdentifier(conjuntoItem));
      const conjuntosToAdd = conjuntos.filter(conjuntoItem => {
        const conjuntoIdentifier = this.getConjuntoIdentifier(conjuntoItem);
        if (conjuntoCollectionIdentifiers.includes(conjuntoIdentifier)) {
          return false;
        }
        conjuntoCollectionIdentifiers.push(conjuntoIdentifier);
        return true;
      });
      return [...conjuntosToAdd, ...conjuntoCollection];
    }
    return conjuntoCollection;
  }
}
