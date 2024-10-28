import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IDataset, NewDataset } from '../dataset.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IDataset for edit and NewDatasetFormGroupInput for create.
 */
type DatasetFormGroupInput = IDataset | PartialWithRequiredKeyOf<NewDataset>;

type DatasetFormDefaults = Pick<NewDataset, 'id'>;

type DatasetFormGroupContent = {
  id: FormControl<IDataset['id'] | NewDataset['id']>;
  nome: FormControl<IDataset['nome']>;
  descricao: FormControl<IDataset['descricao']>;
  diferencaMinima: FormControl<IDataset['diferencaMinima']>;
  usuario: FormControl<IDataset['usuario']>;
};

export type DatasetFormGroup = FormGroup<DatasetFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class DatasetFormService {
  createDatasetFormGroup(dataset: DatasetFormGroupInput = { id: null }): DatasetFormGroup {
    const datasetRawValue = {
      ...this.getFormDefaults(),
      ...dataset,
    };
    return new FormGroup<DatasetFormGroupContent>({
      id: new FormControl(
        { value: datasetRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nome: new FormControl(datasetRawValue.nome),
      descricao: new FormControl(datasetRawValue.descricao),
      diferencaMinima: new FormControl(datasetRawValue.diferencaMinima),
      usuario: new FormControl(datasetRawValue.usuario),
    });
  }

  getDataset(form: DatasetFormGroup): IDataset | NewDataset {
    return form.getRawValue() as IDataset | NewDataset;
  }

  resetForm(form: DatasetFormGroup, dataset: DatasetFormGroupInput): void {
    const datasetRawValue = { ...this.getFormDefaults(), ...dataset };
    form.reset(
      {
        ...datasetRawValue,
        id: { value: datasetRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): DatasetFormDefaults {
    return {
      id: null,
    };
  }
}
