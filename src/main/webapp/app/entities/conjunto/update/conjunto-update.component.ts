import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IDataset } from 'app/entities/dataset/dataset.model';
import { DatasetService } from 'app/entities/dataset/service/dataset.service';
import { IConjunto } from '../conjunto.model';
import { ConjuntoService } from '../service/conjunto.service';
import { ConjuntoFormGroup, ConjuntoFormService } from './conjunto-form.service';

@Component({
  standalone: true,
  selector: 'jhi-conjunto-update',
  templateUrl: './conjunto-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ConjuntoUpdateComponent implements OnInit {
  isSaving = false;
  conjunto: IConjunto | null = null;

  datasetsSharedCollection: IDataset[] = [];

  protected conjuntoService = inject(ConjuntoService);
  protected conjuntoFormService = inject(ConjuntoFormService);
  protected datasetService = inject(DatasetService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ConjuntoFormGroup = this.conjuntoFormService.createConjuntoFormGroup();

  compareDataset = (o1: IDataset | null, o2: IDataset | null): boolean => this.datasetService.compareDataset(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ conjunto }) => {
      this.conjunto = conjunto;
      if (conjunto) {
        this.updateForm(conjunto);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const conjunto = this.conjuntoFormService.getConjunto(this.editForm);
    if (conjunto.id !== null) {
      this.subscribeToSaveResponse(this.conjuntoService.update(conjunto));
    } else {
      this.subscribeToSaveResponse(this.conjuntoService.create(conjunto));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IConjunto>>): void {
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

  protected updateForm(conjunto: IConjunto): void {
    this.conjunto = conjunto;
    this.conjuntoFormService.resetForm(this.editForm, conjunto);

    this.datasetsSharedCollection = this.datasetService.addDatasetToCollectionIfMissing<IDataset>(
      this.datasetsSharedCollection,
      conjunto.dataset,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.datasetService
      .query()
      .pipe(map((res: HttpResponse<IDataset[]>) => res.body ?? []))
      .pipe(map((datasets: IDataset[]) => this.datasetService.addDatasetToCollectionIfMissing<IDataset>(datasets, this.conjunto?.dataset)))
      .subscribe((datasets: IDataset[]) => (this.datasetsSharedCollection = datasets));
  }
}
