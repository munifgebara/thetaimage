import { TestBed } from '@angular/core/testing';

import { sampleWithNewData, sampleWithRequiredData } from '../dataset.test-samples';

import { DatasetFormService } from './dataset-form.service';

describe('Dataset Form Service', () => {
  let service: DatasetFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatasetFormService);
  });

  describe('Service methods', () => {
    describe('createDatasetFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createDatasetFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            descricao: expect.any(Object),
            diferencaMinima: expect.any(Object),
            usuario: expect.any(Object),
          }),
        );
      });

      it('passing IDataset should create a new form with FormGroup', () => {
        const formGroup = service.createDatasetFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            nome: expect.any(Object),
            descricao: expect.any(Object),
            diferencaMinima: expect.any(Object),
            usuario: expect.any(Object),
          }),
        );
      });
    });

    describe('getDataset', () => {
      it('should return NewDataset for default Dataset initial value', () => {
        const formGroup = service.createDatasetFormGroup(sampleWithNewData);

        const dataset = service.getDataset(formGroup) as any;

        expect(dataset).toMatchObject(sampleWithNewData);
      });

      it('should return NewDataset for empty Dataset initial value', () => {
        const formGroup = service.createDatasetFormGroup();

        const dataset = service.getDataset(formGroup) as any;

        expect(dataset).toMatchObject({});
      });

      it('should return IDataset', () => {
        const formGroup = service.createDatasetFormGroup(sampleWithRequiredData);

        const dataset = service.getDataset(formGroup) as any;

        expect(dataset).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing IDataset should not enable id FormControl', () => {
        const formGroup = service.createDatasetFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewDataset should disable id FormControl', () => {
        const formGroup = service.createDatasetFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
