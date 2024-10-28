import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IEtiquetagem, NewEtiquetagem } from '../etiquetagem.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IEtiquetagem for edit and NewEtiquetagemFormGroupInput for create.
 */
type EtiquetagemFormGroupInput = IEtiquetagem | PartialWithRequiredKeyOf<NewEtiquetagem>;

type EtiquetagemFormDefaults = Pick<NewEtiquetagem, 'id'>;

type EtiquetagemFormGroupContent = {
  id: FormControl<IEtiquetagem['id'] | NewEtiquetagem['id']>;
  x: FormControl<IEtiquetagem['x']>;
  y: FormControl<IEtiquetagem['y']>;
  largura: FormControl<IEtiquetagem['largura']>;
  altura: FormControl<IEtiquetagem['altura']>;
  etiqueta: FormControl<IEtiquetagem['etiqueta']>;
  imagem: FormControl<IEtiquetagem['imagem']>;
};

export type EtiquetagemFormGroup = FormGroup<EtiquetagemFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class EtiquetagemFormService {
  createEtiquetagemFormGroup(etiquetagem: EtiquetagemFormGroupInput = { id: null }): EtiquetagemFormGroup {
    const etiquetagemRawValue = {
      ...this.getFormDefaults(),
      ...etiquetagem,
    };
    return new FormGroup<EtiquetagemFormGroupContent>({
      id: new FormControl(
        { value: etiquetagemRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      x: new FormControl(etiquetagemRawValue.x),
      y: new FormControl(etiquetagemRawValue.y),
      largura: new FormControl(etiquetagemRawValue.largura),
      altura: new FormControl(etiquetagemRawValue.altura),
      etiqueta: new FormControl(etiquetagemRawValue.etiqueta),
      imagem: new FormControl(etiquetagemRawValue.imagem),
    });
  }

  getEtiquetagem(form: EtiquetagemFormGroup): IEtiquetagem | NewEtiquetagem {
    return form.getRawValue() as IEtiquetagem | NewEtiquetagem;
  }

  resetForm(form: EtiquetagemFormGroup, etiquetagem: EtiquetagemFormGroupInput): void {
    const etiquetagemRawValue = { ...this.getFormDefaults(), ...etiquetagem };
    form.reset(
      {
        ...etiquetagemRawValue,
        id: { value: etiquetagemRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): EtiquetagemFormDefaults {
    return {
      id: null,
    };
  }
}
