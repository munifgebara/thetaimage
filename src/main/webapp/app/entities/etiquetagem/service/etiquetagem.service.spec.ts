import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IEtiquetagem } from '../etiquetagem.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../etiquetagem.test-samples';

import { EtiquetagemService } from './etiquetagem.service';

const requireRestSample: IEtiquetagem = {
  ...sampleWithRequiredData,
};

describe('Etiquetagem Service', () => {
  let service: EtiquetagemService;
  let httpMock: HttpTestingController;
  let expectedResult: IEtiquetagem | IEtiquetagem[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(EtiquetagemService);
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

    it('should create a Etiquetagem', () => {
      const etiquetagem = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(etiquetagem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Etiquetagem', () => {
      const etiquetagem = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(etiquetagem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Etiquetagem', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Etiquetagem', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Etiquetagem', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addEtiquetagemToCollectionIfMissing', () => {
      it('should add a Etiquetagem to an empty array', () => {
        const etiquetagem: IEtiquetagem = sampleWithRequiredData;
        expectedResult = service.addEtiquetagemToCollectionIfMissing([], etiquetagem);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(etiquetagem);
      });

      it('should not add a Etiquetagem to an array that contains it', () => {
        const etiquetagem: IEtiquetagem = sampleWithRequiredData;
        const etiquetagemCollection: IEtiquetagem[] = [
          {
            ...etiquetagem,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addEtiquetagemToCollectionIfMissing(etiquetagemCollection, etiquetagem);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Etiquetagem to an array that doesn't contain it", () => {
        const etiquetagem: IEtiquetagem = sampleWithRequiredData;
        const etiquetagemCollection: IEtiquetagem[] = [sampleWithPartialData];
        expectedResult = service.addEtiquetagemToCollectionIfMissing(etiquetagemCollection, etiquetagem);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(etiquetagem);
      });

      it('should add only unique Etiquetagem to an array', () => {
        const etiquetagemArray: IEtiquetagem[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const etiquetagemCollection: IEtiquetagem[] = [sampleWithRequiredData];
        expectedResult = service.addEtiquetagemToCollectionIfMissing(etiquetagemCollection, ...etiquetagemArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const etiquetagem: IEtiquetagem = sampleWithRequiredData;
        const etiquetagem2: IEtiquetagem = sampleWithPartialData;
        expectedResult = service.addEtiquetagemToCollectionIfMissing([], etiquetagem, etiquetagem2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(etiquetagem);
        expect(expectedResult).toContain(etiquetagem2);
      });

      it('should accept null and undefined values', () => {
        const etiquetagem: IEtiquetagem = sampleWithRequiredData;
        expectedResult = service.addEtiquetagemToCollectionIfMissing([], null, etiquetagem, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(etiquetagem);
      });

      it('should return initial array if no Etiquetagem is added', () => {
        const etiquetagemCollection: IEtiquetagem[] = [sampleWithRequiredData];
        expectedResult = service.addEtiquetagemToCollectionIfMissing(etiquetagemCollection, undefined, null);
        expect(expectedResult).toEqual(etiquetagemCollection);
      });
    });

    describe('compareEtiquetagem', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareEtiquetagem(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareEtiquetagem(entity1, entity2);
        const compareResult2 = service.compareEtiquetagem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareEtiquetagem(entity1, entity2);
        const compareResult2 = service.compareEtiquetagem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareEtiquetagem(entity1, entity2);
        const compareResult2 = service.compareEtiquetagem(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
