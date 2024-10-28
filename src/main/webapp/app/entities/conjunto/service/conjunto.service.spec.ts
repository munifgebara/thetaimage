import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IConjunto } from '../conjunto.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../conjunto.test-samples';

import { ConjuntoService } from './conjunto.service';

const requireRestSample: IConjunto = {
  ...sampleWithRequiredData,
};

describe('Conjunto Service', () => {
  let service: ConjuntoService;
  let httpMock: HttpTestingController;
  let expectedResult: IConjunto | IConjunto[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(ConjuntoService);
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

    it('should create a Conjunto', () => {
      const conjunto = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(conjunto).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Conjunto', () => {
      const conjunto = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(conjunto).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Conjunto', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Conjunto', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Conjunto', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addConjuntoToCollectionIfMissing', () => {
      it('should add a Conjunto to an empty array', () => {
        const conjunto: IConjunto = sampleWithRequiredData;
        expectedResult = service.addConjuntoToCollectionIfMissing([], conjunto);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(conjunto);
      });

      it('should not add a Conjunto to an array that contains it', () => {
        const conjunto: IConjunto = sampleWithRequiredData;
        const conjuntoCollection: IConjunto[] = [
          {
            ...conjunto,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addConjuntoToCollectionIfMissing(conjuntoCollection, conjunto);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Conjunto to an array that doesn't contain it", () => {
        const conjunto: IConjunto = sampleWithRequiredData;
        const conjuntoCollection: IConjunto[] = [sampleWithPartialData];
        expectedResult = service.addConjuntoToCollectionIfMissing(conjuntoCollection, conjunto);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(conjunto);
      });

      it('should add only unique Conjunto to an array', () => {
        const conjuntoArray: IConjunto[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const conjuntoCollection: IConjunto[] = [sampleWithRequiredData];
        expectedResult = service.addConjuntoToCollectionIfMissing(conjuntoCollection, ...conjuntoArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const conjunto: IConjunto = sampleWithRequiredData;
        const conjunto2: IConjunto = sampleWithPartialData;
        expectedResult = service.addConjuntoToCollectionIfMissing([], conjunto, conjunto2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(conjunto);
        expect(expectedResult).toContain(conjunto2);
      });

      it('should accept null and undefined values', () => {
        const conjunto: IConjunto = sampleWithRequiredData;
        expectedResult = service.addConjuntoToCollectionIfMissing([], null, conjunto, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(conjunto);
      });

      it('should return initial array if no Conjunto is added', () => {
        const conjuntoCollection: IConjunto[] = [sampleWithRequiredData];
        expectedResult = service.addConjuntoToCollectionIfMissing(conjuntoCollection, undefined, null);
        expect(expectedResult).toEqual(conjuntoCollection);
      });
    });

    describe('compareConjunto', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareConjunto(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareConjunto(entity1, entity2);
        const compareResult2 = service.compareConjunto(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareConjunto(entity1, entity2);
        const compareResult2 = service.compareConjunto(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareConjunto(entity1, entity2);
        const compareResult2 = service.compareConjunto(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
