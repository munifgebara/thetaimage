import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IDataset } from 'app/entities/dataset/dataset.model';
import { DatasetService } from 'app/entities/dataset/service/dataset.service';
import { IClasse } from '../classe.model';
import { ClasseService } from '../service/classe.service';
import { ClasseFormGroup, ClasseFormService } from './classe-form.service';

@Component({
  standalone: true,
  selector: 'jhi-classe-update',
  templateUrl: './classe-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class ClasseUpdateComponent implements OnInit {
  isSaving = false;
  classe: IClasse | null = null;

  datasetsSharedCollection: IDataset[] = [];

  protected classeService = inject(ClasseService);
  protected classeFormService = inject(ClasseFormService);
  protected datasetService = inject(DatasetService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: ClasseFormGroup = this.classeFormService.createClasseFormGroup();

  compareDataset = (o1: IDataset | null, o2: IDataset | null): boolean => this.datasetService.compareDataset(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ classe }) => {
      this.classe = classe;
      if (classe) {
        this.updateForm(classe);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const classe = this.classeFormService.getClasse(this.editForm);
    if (classe.id !== null) {
      this.subscribeToSaveResponse(this.classeService.update(classe));
    } else {
      this.subscribeToSaveResponse(this.classeService.create(classe));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IClasse>>): void {
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

  protected updateForm(classe: IClasse): void {
    this.classe = classe;
    this.classeFormService.resetForm(this.editForm, classe);

    this.datasetsSharedCollection = this.datasetService.addDatasetToCollectionIfMissing<IDataset>(
      this.datasetsSharedCollection,
      classe.dataset,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.datasetService
      .query()
      .pipe(map((res: HttpResponse<IDataset[]>) => res.body ?? []))
      .pipe(map((datasets: IDataset[]) => this.datasetService.addDatasetToCollectionIfMissing<IDataset>(datasets, this.classe?.dataset)))
      .subscribe((datasets: IDataset[]) => (this.datasetsSharedCollection = datasets));
  }
}
