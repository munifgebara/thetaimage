import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEtiquetagem, NewEtiquetagem } from '../etiquetagem.model';

export type PartialUpdateEtiquetagem = Partial<IEtiquetagem> & Pick<IEtiquetagem, 'id'>;

export type EntityResponseType = HttpResponse<IEtiquetagem>;
export type EntityArrayResponseType = HttpResponse<IEtiquetagem[]>;

@Injectable({ providedIn: 'root' })
export class EtiquetagemService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/etiquetagems');

  create(etiquetagem: NewEtiquetagem): Observable<EntityResponseType> {
    return this.http.post<IEtiquetagem>(this.resourceUrl, etiquetagem, { observe: 'response' });
  }

  update(etiquetagem: IEtiquetagem): Observable<EntityResponseType> {
    return this.http.put<IEtiquetagem>(`${this.resourceUrl}/${this.getEtiquetagemIdentifier(etiquetagem)}`, etiquetagem, {
      observe: 'response',
    });
  }

  partialUpdate(etiquetagem: PartialUpdateEtiquetagem): Observable<EntityResponseType> {
    return this.http.patch<IEtiquetagem>(`${this.resourceUrl}/${this.getEtiquetagemIdentifier(etiquetagem)}`, etiquetagem, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEtiquetagem>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEtiquetagem[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getEtiquetagemIdentifier(etiquetagem: Pick<IEtiquetagem, 'id'>): number {
    return etiquetagem.id;
  }

  compareEtiquetagem(o1: Pick<IEtiquetagem, 'id'> | null, o2: Pick<IEtiquetagem, 'id'> | null): boolean {
    return o1 && o2 ? this.getEtiquetagemIdentifier(o1) === this.getEtiquetagemIdentifier(o2) : o1 === o2;
  }

  addEtiquetagemToCollectionIfMissing<Type extends Pick<IEtiquetagem, 'id'>>(
    etiquetagemCollection: Type[],
    ...etiquetagemsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const etiquetagems: Type[] = etiquetagemsToCheck.filter(isPresent);
    if (etiquetagems.length > 0) {
      const etiquetagemCollectionIdentifiers = etiquetagemCollection.map(etiquetagemItem => this.getEtiquetagemIdentifier(etiquetagemItem));
      const etiquetagemsToAdd = etiquetagems.filter(etiquetagemItem => {
        const etiquetagemIdentifier = this.getEtiquetagemIdentifier(etiquetagemItem);
        if (etiquetagemCollectionIdentifiers.includes(etiquetagemIdentifier)) {
          return false;
        }
        etiquetagemCollectionIdentifiers.push(etiquetagemIdentifier);
        return true;
      });
      return [...etiquetagemsToAdd, ...etiquetagemCollection];
    }
    return etiquetagemCollection;
  }
}
