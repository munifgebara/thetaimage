import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IConjunto, NewConjunto } from '../conjunto.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IConjunto for edit and NewConjuntoFormGroupInput for create.
 */
type ConjuntoFormGroupInput = IConjunto | PartialWithRequiredKeyOf<NewConjunto>;

type ConjuntoFormDefaults = Pick<NewConjunto, 'id'>;

type ConjuntoFormGroupContent = {
  id: FormControl<IConjunto['id'] | NewConjunto['id']>;
  nome: FormControl<IConjunto['nome']>;
  dataset: FormControl<IConjunto['dataset']>;
};

export type ConjuntoFormGroup = FormGroup<ConjuntoFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ConjuntoFormService {
  createConjuntoFormGroup(conjunto: ConjuntoFormGroupInput = { id: null }): ConjuntoFormGroup {
    const conjuntoRawValue = {
      ...this.getFormDefaults(),
      ...conjunto,
    };
    return new FormGroup<ConjuntoFormGroupContent>({
      id: new FormControl(
        { value: conjuntoRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nome: new FormControl(conjuntoRawValue.nome),
      dataset: new FormControl(conjuntoRawValue.dataset),
    });
  }

  getConjunto(form: ConjuntoFormGroup): IConjunto | NewConjunto {
    return form.getRawValue() as IConjunto | NewConjunto;
  }

  resetForm(form: ConjuntoFormGroup, conjunto: ConjuntoFormGroupInput): void {
    const conjuntoRawValue = { ...this.getFormDefaults(), ...conjunto };
    form.reset(
      {
        ...conjuntoRawValue,
        id: { value: conjuntoRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ConjuntoFormDefaults {
    return {
      id: null,
    };
  }
}
