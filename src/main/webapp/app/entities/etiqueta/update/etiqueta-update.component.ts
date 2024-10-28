import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IDataset } from 'app/entities/dataset/dataset.model';
import { DatasetService } from 'app/entities/dataset/service/dataset.service';
import { IEtiqueta } from '../etiqueta.model';
import { EtiquetaService } from '../service/etiqueta.service';
import { EtiquetaFormGroup, EtiquetaFormService } from './etiqueta-form.service';

@Component({
  standalone: true,
  selector: 'jhi-etiqueta-update',
  templateUrl: './etiqueta-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class EtiquetaUpdateComponent implements OnInit {
  isSaving = false;
  etiqueta: IEtiqueta | null = null;

  datasetsSharedCollection: IDataset[] = [];

  protected etiquetaService = inject(EtiquetaService);
  protected etiquetaFormService = inject(EtiquetaFormService);
  protected datasetService = inject(DatasetService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: EtiquetaFormGroup = this.etiquetaFormService.createEtiquetaFormGroup();

  compareDataset = (o1: IDataset | null, o2: IDataset | null): boolean => this.datasetService.compareDataset(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ etiqueta }) => {
      this.etiqueta = etiqueta;
      if (etiqueta) {
        this.updateForm(etiqueta);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const etiqueta = this.etiquetaFormService.getEtiqueta(this.editForm);
    if (etiqueta.id !== null) {
      this.subscribeToSaveResponse(this.etiquetaService.update(etiqueta));
    } else {
      this.subscribeToSaveResponse(this.etiquetaService.create(etiqueta));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEtiqueta>>): void {
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

  protected updateForm(etiqueta: IEtiqueta): void {
    this.etiqueta = etiqueta;
    this.etiquetaFormService.resetForm(this.editForm, etiqueta);

    this.datasetsSharedCollection = this.datasetService.addDatasetToCollectionIfMissing<IDataset>(
      this.datasetsSharedCollection,
      etiqueta.dataset,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.datasetService
      .query()
      .pipe(map((res: HttpResponse<IDataset[]>) => res.body ?? []))
      .pipe(map((datasets: IDataset[]) => this.datasetService.addDatasetToCollectionIfMissing<IDataset>(datasets, this.etiqueta?.dataset)))
      .subscribe((datasets: IDataset[]) => (this.datasetsSharedCollection = datasets));
  }
}
