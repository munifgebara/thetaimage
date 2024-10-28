import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../etiquetagem.test-samples';

import { EtiquetagemFormService } from './etiquetagem-form.service';

describe('Etiquetagem Form Service', () => {
  let service: EtiquetagemFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EtiquetagemFormService);
  });

  describe('Service methods', () => {
    describe('createEtiquetagemFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createEtiquetagemFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            x: expect.any(Object),
            y: expect.any(Object),
            largura: expect.any(Object),
            altura: expect.any(Object),
            etiqueta: expect.any(Object),
            imagem: expect.any(Object),
          }),
        );
      });

      it('passing IEtiquetagem should create a new form with FormGroup', () => {
        const formGroup = service.createEtiquetagemFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            x: expect.any(Object),
            y: expect.any(Object),
            largura: expect.any(Object),
            altura: expect.any(Object),
            etiqueta: expect.any(Object),
            imagem: expect.any(Object),
          }),
        );
      });
    });

    describe('getEtiquetagem', () => {
      it('should return NewEtiquetagem for default Etiquetagem initial value', () => {
        const formGroup = service.createEtiquetagemFormGroup(sampleWithNewData);

        const etiquetagem = service.getEtiquetagem(formGroup) as any;

        expect(etiquetagem).toMatchObject(sampleWithNewData);
      });

      it('should return NewEtiquetagem for empty Etiquetagem initial value', () => {
        const formGroup = service.createEtiquetagemFormGroup();

        const etiquetagem = service.getEtiquetagem(formGroup) as any;

        expect(etiquetagem).toMatchObject({});
      });

      it('should return IEtiquetagem', () => {
        const formGroup = service.createEtiquetagemFormGroup(sampleWithRequiredData);

        const etiquetagem = service.getEtiquetagem(formGroup) as any;

        expect(etiquetagem).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IEtiquetagem should not enable id FormControl', () => {
        const formGroup = service.createEtiquetagemFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewEtiquetagem should disable id FormControl', () => {
        const formGroup = service.createEtiquetagemFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
