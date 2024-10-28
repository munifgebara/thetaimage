import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

import { IImagem, NewImagem } from '../imagem.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IImagem for edit and NewImagemFormGroupInput for create.
 */
type ImagemFormGroupInput = IImagem | PartialWithRequiredKeyOf<NewImagem>;

type ImagemFormDefaults = Pick<NewImagem, 'id'>;

type ImagemFormGroupContent = {
  id: FormControl<IImagem['id'] | NewImagem['id']>;
  nome: FormControl<IImagem['nome']>;
  caminho: FormControl<IImagem['caminho']>;
  mimeType: FormControl<IImagem['mimeType']>;
  largura: FormControl<IImagem['largura']>;
  altura: FormControl<IImagem['altura']>;
  dados: FormControl<IImagem['dados']>;
  dadosContentType: FormControl<IImagem['dadosContentType']>;
  dataset: FormControl<IImagem['dataset']>;
  conjunto: FormControl<IImagem['conjunto']>;
  classe: FormControl<IImagem['classe']>;
};

export type ImagemFormGroup = FormGroup<ImagemFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ImagemFormService {
  createImagemFormGroup(imagem: ImagemFormGroupInput = { id: null }): ImagemFormGroup {
    const imagemRawValue = {
      ...this.getFormDefaults(),
      ...imagem,
    };
    return new FormGroup<ImagemFormGroupContent>({
      id: new FormControl(
        { value: imagemRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        },
      ),
      nome: new FormControl(imagemRawValue.nome),
      caminho: new FormControl(imagemRawValue.caminho),
      mimeType: new FormControl(imagemRawValue.mimeType),
      largura: new FormControl(imagemRawValue.largura),
      altura: new FormControl(imagemRawValue.altura),
      dados: new FormControl(imagemRawValue.dados),
      dadosContentType: new FormControl(imagemRawValue.dadosContentType),
      dataset: new FormControl(imagemRawValue.dataset),
      conjunto: new FormControl(imagemRawValue.conjunto),
      classe: new FormControl(imagemRawValue.classe),
    });
  }

  getImagem(form: ImagemFormGroup): IImagem | NewImagem {
    return form.getRawValue() as IImagem | NewImagem;
  }

  resetForm(form: ImagemFormGroup, imagem: ImagemFormGroupInput): void {
    const imagemRawValue = { ...this.getFormDefaults(), ...imagem };
    form.reset(
      {
        ...imagemRawValue,
        id: { value: imagemRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */,
    );
  }

  private getFormDefaults(): ImagemFormDefaults {
    return {
      id: null,
    };
  }
}
