import { Component, ElementRef, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IDataset } from 'app/entities/dataset/dataset.model';
import { DatasetService } from 'app/entities/dataset/service/dataset.service';
import { IConjunto } from 'app/entities/conjunto/conjunto.model';
import { ConjuntoService } from 'app/entities/conjunto/service/conjunto.service';
import { IClasse } from 'app/entities/classe/classe.model';
import { ClasseService } from 'app/entities/classe/service/classe.service';
import { ImagemService } from '../service/imagem.service';
import { IImagem } from '../imagem.model';
import { ImagemFormGroup, ImagemFormService } from './imagem-form.service';

@Component({
  standalone: true,
  selector: 'jhi-imagem-update',
  templateUrl: './imagem-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ImagemUpdateComponent implements OnInit {
  isSaving = false;
  imagem: IImagem | null = null;

  datasetsSharedCollection: IDataset[] = [];
  conjuntosSharedCollection: IConjunto[] = [];
  classesSharedCollection: IClasse[] = [];

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected imagemService = inject(ImagemService);
  protected imagemFormService = inject(ImagemFormService);
  protected datasetService = inject(DatasetService);
  protected conjuntoService = inject(ConjuntoService);
  protected classeService = inject(ClasseService);
  protected elementRef = inject(ElementRef);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ImagemFormGroup = this.imagemFormService.createImagemFormGroup();

  compareDataset = (o1: IDataset | null, o2: IDataset | null): boolean => this.datasetService.compareDataset(o1, o2);

  compareConjunto = (o1: IConjunto | null, o2: IConjunto | null): boolean => this.conjuntoService.compareConjunto(o1, o2);

  compareClasse = (o1: IClasse | null, o2: IClasse | null): boolean => this.classeService.compareClasse(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ imagem }) => {
      this.imagem = imagem;
      if (imagem) {
        this.updateForm(imagem);
      }

      this.loadRelationshipsOptions();
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('thetaimageApp.error', { message: err.message })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector(`#${idInput}`)) {
      this.elementRef.nativeElement.querySelector(`#${idInput}`).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const imagem = this.imagemFormService.getImagem(this.editForm);
    if (imagem.id !== null) {
      this.subscribeToSaveResponse(this.imagemService.update(imagem));
    } else {
      this.subscribeToSaveResponse(this.imagemService.create(imagem));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IImagem>>): void {
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

  protected updateForm(imagem: IImagem): void {
    this.imagem = imagem;
    this.imagemFormService.resetForm(this.editForm, imagem);

    this.datasetsSharedCollection = this.datasetService.addDatasetToCollectionIfMissing<IDataset>(
      this.datasetsSharedCollection,
      imagem.dataset,
    );
    this.conjuntosSharedCollection = this.conjuntoService.addConjuntoToCollectionIfMissing<IConjunto>(
      this.conjuntosSharedCollection,
      imagem.conjunto,
    );
    this.classesSharedCollection = this.classeService.addClasseToCollectionIfMissing<IClasse>(this.classesSharedCollection, imagem.classe);
  }

  protected loadRelationshipsOptions(): void {
    this.datasetService
      .query()
      .pipe(map((res: HttpResponse<IDataset[]>) => res.body ?? []))
      .pipe(map((datasets: IDataset[]) => this.datasetService.addDatasetToCollectionIfMissing<IDataset>(datasets, this.imagem?.dataset)))
      .subscribe((datasets: IDataset[]) => (this.datasetsSharedCollection = datasets));

    this.conjuntoService
      .query()
      .pipe(map((res: HttpResponse<IConjunto[]>) => res.body ?? []))
      .pipe(
        map((conjuntos: IConjunto[]) => this.conjuntoService.addConjuntoToCollectionIfMissing<IConjunto>(conjuntos, this.imagem?.conjunto)),
      )
      .subscribe((conjuntos: IConjunto[]) => (this.conjuntosSharedCollection = conjuntos));

    this.classeService
      .query()
      .pipe(map((res: HttpResponse<IClasse[]>) => res.body ?? []))
      .pipe(map((classes: IClasse[]) => this.classeService.addClasseToCollectionIfMissing<IClasse>(classes, this.imagem?.classe)))
      .subscribe((classes: IClasse[]) => (this.classesSharedCollection = classes));
  }
}
