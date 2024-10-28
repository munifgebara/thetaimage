import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IImagem, NewImagem } from '../imagem.model';

export type PartialUpdateImagem = Partial<IImagem> & Pick<IImagem, 'id'>;

export type EntityResponseType = HttpResponse<IImagem>;
export type EntityArrayResponseType = HttpResponse<IImagem[]>;

@Injectable({ providedIn: 'root' })
export class ImagemService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/imagems');

  create(imagem: NewImagem): Observable<EntityResponseType> {
    return this.http.post<IImagem>(this.resourceUrl, imagem, { observe: 'response' });
  }

  update(imagem: IImagem): Observable<EntityResponseType> {
    return this.http.put<IImagem>(`${this.resourceUrl}/${this.getImagemIdentifier(imagem)}`, imagem, { observe: 'response' });
  }

  partialUpdate(imagem: PartialUpdateImagem): Observable<EntityResponseType> {
    return this.http.patch<IImagem>(`${this.resourceUrl}/${this.getImagemIdentifier(imagem)}`, imagem, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IImagem>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IImagem[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getImagemIdentifier(imagem: Pick<IImagem, 'id'>): number {
    return imagem.id;
  }

  compareImagem(o1: Pick<IImagem, 'id'> | null, o2: Pick<IImagem, 'id'> | null): boolean {
    return o1 && o2 ? this.getImagemIdentifier(o1) === this.getImagemIdentifier(o2) : o1 === o2;
  }

  addImagemToCollectionIfMissing<Type extends Pick<IImagem, 'id'>>(
    imagemCollection: Type[],
    ...imagemsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const imagems: Type[] = imagemsToCheck.filter(isPresent);
    if (imagems.length > 0) {
      const imagemCollectionIdentifiers = imagemCollection.map(imagemItem => this.getImagemIdentifier(imagemItem));
      const imagemsToAdd = imagems.filter(imagemItem => {
        const imagemIdentifier = this.getImagemIdentifier(imagemItem);
        if (imagemCollectionIdentifiers.includes(imagemIdentifier)) {
          return false;
        }
        imagemCollectionIdentifiers.push(imagemIdentifier);
        return true;
      });
      return [...imagemsToAdd, ...imagemCollection];
    }
    return imagemCollection;
  }
}
