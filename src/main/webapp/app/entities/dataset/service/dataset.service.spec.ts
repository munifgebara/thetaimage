import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IDataset } from '../dataset.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../dataset.test-samples';

import { DatasetService } from './dataset.service';

const requireRestSample: IDataset = {
  ...sampleWithRequiredData,
};

describe('Dataset Service', () => {
  let service: DatasetService;
  let httpMock: HttpTestingController;
  let expectedResult: IDataset | IDataset[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(DatasetService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Dataset', () => {
      const dataset = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(dataset).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Dataset', () => {
      const dataset = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(dataset).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Dataset', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Dataset', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Dataset', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addDatasetToCollectionIfMissing', () => {
      it('should add a Dataset to an empty array', () => {
        const dataset: IDataset = sampleWithRequiredData;
        expectedResult = service.addDatasetToCollectionIfMissing([], dataset);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(dataset);
      });

      it('should not add a Dataset to an array that contains it', () => {
        const dataset: IDataset = sampleWithRequiredData;
        const datasetCollection: IDataset[] = [
          {
            ...dataset,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addDatasetToCollectionIfMissing(datasetCollection, dataset);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Dataset to an array that doesn't contain it", () => {
        const dataset: IDataset = sampleWithRequiredData;
        const datasetCollection: IDataset[] = [sampleWithPartialData];
        expectedResult = service.addDatasetToCollectionIfMissing(datasetCollection, dataset);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(dataset);
      });

      it('should add only unique Dataset to an array', () => {
        const datasetArray: IDataset[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const datasetCollection: IDataset[] = [sampleWithRequiredData];
        expectedResult = service.addDatasetToCollectionIfMissing(datasetCollection, ...datasetArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const dataset: IDataset = sampleWithRequiredData;
        const dataset2: IDataset = sampleWithPartialData;
        expectedResult = service.addDatasetToCollectionIfMissing([], dataset, dataset2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(dataset);
        expect(expectedResult).toContain(dataset2);
      });

      it('should accept null and undefined values', () => {
        const dataset: IDataset = sampleWithRequiredData;
        expectedResult = service.addDatasetToCollectionIfMissing([], null, dataset, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(dataset);
      });

      it('should return initial array if no Dataset is added', () => {
        const datasetCollection: IDataset[] = [sampleWithRequiredData];
        expectedResult = service.addDatasetToCollectionIfMissing(datasetCollection, undefined, null);
        expect(expectedResult).toEqual(datasetCollection);
      });
    });

    describe('compareDataset', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareDataset(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareDataset(entity1, entity2);
        const compareResult2 = service.compareDataset(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareDataset(entity1, entity2);
        const compareResult2 = service.compareDataset(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareDataset(entity1, entity2);
        const compareResult2 = service.compareDataset(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
