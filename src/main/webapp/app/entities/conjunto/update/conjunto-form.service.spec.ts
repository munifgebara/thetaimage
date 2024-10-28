import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../conjunto.test-samples';

import { ConjuntoFormService } from './conjunto-form.service';

describe('Conjunto Form Service', () => {
  let service: ConjuntoFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ConjuntoFormService);
  });

  describe('Service methods', () => {
    describe('createConjuntoFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createConjuntoFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            dataset: expect.any(Object),
          }),
        );
      });

      it('passing IConjunto should create a new form with FormGroup', () => {
        const formGroup = service.createConjuntoFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            dataset: expect.any(Object),
          }),
        );
      });
    });

    describe('getConjunto', () => {
      it('should return NewConjunto for default Conjunto initial value', () => {
        const formGroup = service.createConjuntoFormGroup(sampleWithNewData);

        const conjunto = service.getConjunto(formGroup) as any;

        expect(conjunto).toMatchObject(sampleWithNewData);
      });

      it('should return NewConjunto for empty Conjunto initial value', () => {
        const formGroup = service.createConjuntoFormGroup();

        const conjunto = service.getConjunto(formGroup) as any;

        expect(conjunto).toMatchObject({});
      });

      it('should return IConjunto', () => {
        const formGroup = service.createConjuntoFormGroup(sampleWithRequiredData);

        const conjunto = service.getConjunto(formGroup) as any;

        expect(conjunto).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IConjunto should not enable id FormControl', () => {
        const formGroup = service.createConjuntoFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewConjunto should disable id FormControl', () => {
        const formGroup = service.createConjuntoFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
