import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IEtiqueta } from '../etiqueta.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../etiqueta.test-samples';

import { EtiquetaService } from './etiqueta.service';

const requireRestSample: IEtiqueta = {
  ...sampleWithRequiredData,
};

describe('Etiqueta Service', () => {
  let service: EtiquetaService;
  let httpMock: HttpTestingController;
  let expectedResult: IEtiqueta | IEtiqueta[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(EtiquetaService);
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

    it('should create a Etiqueta', () => {
      const etiqueta = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(etiqueta).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Etiqueta', () => {
      const etiqueta = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(etiqueta).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Etiqueta', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Etiqueta', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Etiqueta', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEtiquetaToCollectionIfMissing', () => {
      it('should add a Etiqueta to an empty array', () => {
        const etiqueta: IEtiqueta = sampleWithRequiredData;
        expectedResult = service.addEtiquetaToCollectionIfMissing([], etiqueta);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(etiqueta);
      });

      it('should not add a Etiqueta to an array that contains it', () => {
        const etiqueta: IEtiqueta = sampleWithRequiredData;
        const etiquetaCollection: IEtiqueta[] = [
          {
            ...etiqueta,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEtiquetaToCollectionIfMissing(etiquetaCollection, etiqueta);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Etiqueta to an array that doesn't contain it", () => {
        const etiqueta: IEtiqueta = sampleWithRequiredData;
        const etiquetaCollection: IEtiqueta[] = [sampleWithPartialData];
        expectedResult = service.addEtiquetaToCollectionIfMissing(etiquetaCollection, etiqueta);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(etiqueta);
      });

      it('should add only unique Etiqueta to an array', () => {
        const etiquetaArray: IEtiqueta[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const etiquetaCollection: IEtiqueta[] = [sampleWithRequiredData];
        expectedResult = service.addEtiquetaToCollectionIfMissing(etiquetaCollection, ...etiquetaArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const etiqueta: IEtiqueta = sampleWithRequiredData;
        const etiqueta2: IEtiqueta = sampleWithPartialData;
        expectedResult = service.addEtiquetaToCollectionIfMissing([], etiqueta, etiqueta2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(etiqueta);
        expect(expectedResult).toContain(etiqueta2);
      });

      it('should accept null and undefined values', () => {
        const etiqueta: IEtiqueta = sampleWithRequiredData;
        expectedResult = service.addEtiquetaToCollectionIfMissing([], null, etiqueta, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(etiqueta);
      });

      it('should return initial array if no Etiqueta is added', () => {
        const etiquetaCollection: IEtiqueta[] = [sampleWithRequiredData];
        expectedResult = service.addEtiquetaToCollectionIfMissing(etiquetaCollection, undefined, null);
        expect(expectedResult).toEqual(etiquetaCollection);
      });
    });

    describe('compareEtiqueta', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEtiqueta(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEtiqueta(entity1, entity2);
        const compareResult2 = service.compareEtiqueta(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEtiqueta(entity1, entity2);
        const compareResult2 = service.compareEtiqueta(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEtiqueta(entity1, entity2);
        const compareResult2 = service.compareEtiqueta(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
