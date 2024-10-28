import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IEtiqueta } from 'app/entities/etiqueta/etiqueta.model';
import { EtiquetaService } from 'app/entities/etiqueta/service/etiqueta.service';
import { IImagem } from 'app/entities/imagem/imagem.model';
import { ImagemService } from 'app/entities/imagem/service/imagem.service';
import { EtiquetagemService } from '../service/etiquetagem.service';
import { IEtiquetagem } from '../etiquetagem.model';
import { EtiquetagemFormGroup, EtiquetagemFormService } from './etiquetagem-form.service';

@Component({
  standalone: true,
  selector: 'jhi-etiquetagem-update',
  templateUrl: './etiquetagem-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EtiquetagemUpdateComponent implements OnInit {
  isSaving = false;
  etiquetagem: IEtiquetagem | null = null;

  etiquetasSharedCollection: IEtiqueta[] = [];
  imagemsSharedCollection: IImagem[] = [];

  protected etiquetagemService = inject(EtiquetagemService);
  protected etiquetagemFormService = inject(EtiquetagemFormService);
  protected etiquetaService = inject(EtiquetaService);
  protected imagemService = inject(ImagemService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: EtiquetagemFormGroup = this.etiquetagemFormService.createEtiquetagemFormGroup();

  compareEtiqueta = (o1: IEtiqueta | null, o2: IEtiqueta | null): boolean => this.etiquetaService.compareEtiqueta(o1, o2);

  compareImagem = (o1: IImagem | null, o2: IImagem | null): boolean => this.imagemService.compareImagem(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ etiquetagem }) => {
      this.etiquetagem = etiquetagem;
      if (etiquetagem) {
        this.updateForm(etiquetagem);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const etiquetagem = this.etiquetagemFormService.getEtiquetagem(this.editForm);
    if (etiquetagem.id !== null) {
      this.subscribeToSaveResponse(this.etiquetagemService.update(etiquetagem));
    } else {
      this.subscribeToSaveResponse(this.etiquetagemService.create(etiquetagem));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEtiquetagem>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(etiquetagem: IEtiquetagem): void {
    this.etiquetagem = etiquetagem;
    this.etiquetagemFormService.resetForm(this.editForm, etiquetagem);

    this.etiquetasSharedCollection = this.etiquetaService.addEtiquetaToCollectionIfMissing<IEtiqueta>(
      this.etiquetasSharedCollection,
      etiquetagem.etiqueta,
    );
    this.imagemsSharedCollection = this.imagemService.addImagemToCollectionIfMissing<IImagem>(
      this.imagemsSharedCollection,
      etiquetagem.imagem,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.etiquetaService
      .query()
      .pipe(map((res: HttpResponse<IEtiqueta[]>) => res.body ?? []))
      .pipe(
        map((etiquetas: IEtiqueta[]) =>
          this.etiquetaService.addEtiquetaToCollectionIfMissing<IEtiqueta>(etiquetas, this.etiquetagem?.etiqueta),
        ),
      )
      .subscribe((etiquetas: IEtiqueta[]) => (this.etiquetasSharedCollection = etiquetas));

    this.imagemService
      .query()
      .pipe(map((res: HttpResponse<IImagem[]>) => res.body ?? []))
      .pipe(map((imagems: IImagem[]) => this.imagemService.addImagemToCollectionIfMissing<IImagem>(imagems, this.etiquetagem?.imagem)))
      .subscribe((imagems: IImagem[]) => (this.imagemsSharedCollection = imagems));
  }
}
