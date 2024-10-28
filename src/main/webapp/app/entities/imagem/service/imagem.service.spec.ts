import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';

import { IImagem } from '../imagem.model';
import { sampleWithFullData, sampleWithNewData, sampleWithPartialData, sampleWithRequiredData } from '../imagem.test-samples';

import { ImagemService } from './imagem.service';

const requireRestSample: IImagem = {
  ...sampleWithRequiredData,
};

describe('Imagem Service', () => {
  let service: ImagemService;
  let httpMock: HttpTestingController;
  let expectedResult: IImagem | IImagem[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    expectedResult = null;
    service = TestBed.inject(ImagemService);
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

    it('should create a Imagem', () => {
      const imagem = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(imagem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Imagem', () => {
      const imagem = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(imagem).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Imagem', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Imagem', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Imagem', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addImagemToCollectionIfMissing', () => {
      it('should add a Imagem to an empty array', () => {
        const imagem: IImagem = sampleWithRequiredData;
        expectedResult = service.addImagemToCollectionIfMissing([], imagem);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(imagem);
      });

      it('should not add a Imagem to an array that contains it', () => {
        const imagem: IImagem = sampleWithRequiredData;
        const imagemCollection: IImagem[] = [
          {
            ...imagem,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addImagemToCollectionIfMissing(imagemCollection, imagem);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Imagem to an array that doesn't contain it", () => {
        const imagem: IImagem = sampleWithRequiredData;
        const imagemCollection: IImagem[] = [sampleWithPartialData];
        expectedResult = service.addImagemToCollectionIfMissing(imagemCollection, imagem);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(imagem);
      });

      it('should add only unique Imagem to an array', () => {
        const imagemArray: IImagem[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const imagemCollection: IImagem[] = [sampleWithRequiredData];
        expectedResult = service.addImagemToCollectionIfMissing(imagemCollection, ...imagemArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const imagem: IImagem = sampleWithRequiredData;
        const imagem2: IImagem = sampleWithPartialData;
        expectedResult = service.addImagemToCollectionIfMissing([], imagem, imagem2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(imagem);
        expect(expectedResult).toContain(imagem2);
      });

      it('should accept null and undefined values', () => {
        const imagem: IImagem = sampleWithRequiredData;
        expectedResult = service.addImagemToCollectionIfMissing([], null, imagem, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(imagem);
      });

      it('should return initial array if no Imagem is added', () => {
        const imagemCollection: IImagem[] = [sampleWithRequiredData];
        expectedResult = service.addImagemToCollectionIfMissing(imagemCollection, undefined, null);
        expect(expectedResult).toEqual(imagemCollection);
      });
    });

    describe('compareImagem', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareImagem(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareImagem(entity1, entity2);
        const compareResult2 = service.compareImagem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareImagem(entity1, entity2);
        const compareResult2 = service.compareImagem(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareImagem(entity1, entity2);
        const compareResult2 = service.compareImagem(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
