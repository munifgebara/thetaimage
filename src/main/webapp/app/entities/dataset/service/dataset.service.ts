import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IDataset, NewDataset } from '../dataset.model';

export type PartialUpdateDataset = Partial<IDataset> & Pick<IDataset, 'id'>;

export type EntityResponseType = HttpResponse<IDataset>;
export type EntityArrayResponseType = HttpResponse<IDataset[]>;

@Injectable({ providedIn: 'root' })
export class DatasetService {
  protected http = inject(HttpClient);
  protected applicationConfigService = inject(ApplicationConfigService);

  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/datasets');

  create(dataset: NewDataset): Observable<EntityResponseType> {
    return this.http.post<IDataset>(this.resourceUrl, dataset, { observe: 'response' });
  }

  update(dataset: IDataset): Observable<EntityResponseType> {
    return this.http.put<IDataset>(`${this.resourceUrl}/${this.getDatasetIdentifier(dataset)}`, dataset, { observe: 'response' });
  }

  partialUpdate(dataset: PartialUpdateDataset): Observable<EntityResponseType> {
    return this.http.patch<IDataset>(`${this.resourceUrl}/${this.getDatasetIdentifier(dataset)}`, dataset, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IDataset>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IDataset[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getDatasetIdentifier(dataset: Pick<IDataset, 'id'>): number {
    return dataset.id;
  }

  compareDataset(o1: Pick<IDataset, 'id'> | null, o2: Pick<IDataset, 'id'> | null): boolean {
    return o1 && o2 ? this.getDatasetIdentifier(o1) === this.getDatasetIdentifier(o2) : o1 === o2;
  }

  addDatasetToCollectionIfMissing<Type extends Pick<IDataset, 'id'>>(
    datasetCollection: Type[],
    ...datasetsToCheck: (Type | null | undefined)[]
  ): Type[] {
    const datasets: Type[] = datasetsToCheck.filter(isPresent);
    if (datasets.length > 0) {
      const datasetCollectionIdentifiers = datasetCollection.map(datasetItem => this.getDatasetIdentifier(datasetItem));
      const datasetsToAdd = datasets.filter(datasetItem => {
        const datasetIdentifier = this.getDatasetIdentifier(datasetItem);
        if (datasetCollectionIdentifiers.includes(datasetIdentifier)) {
          return false;
        }
        datasetCollectionIdentifiers.push(datasetIdentifier);
        return true;
      });
      return [...datasetsToAdd, ...datasetCollection];
    }
    return datasetCollection;
  }
}
