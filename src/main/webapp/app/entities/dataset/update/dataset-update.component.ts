import { Component, OnInit, inject } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import SharedModule from 'app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';
import { IUsuario } from 'app/entities/usuario/usuario.model';
import { UsuarioService } from 'app/entities/usuario/service/usuario.service';
import { DatasetService } from '../service/dataset.service';
import { IDataset } from '../dataset.model';
import { DatasetFormGroup, DatasetFormService } from './dataset-form.service';

@Component({
  standalone: true,
  selector: 'jhi-dataset-update',
  templateUrl: './dataset-update.component.html',
  imports: [SharedModule, FormsModule, ReactiveFormsModule],
})
export class DatasetUpdateComponent implements OnInit {
  isSaving = false;
  dataset: IDataset | null = null;

  usuariosSharedCollection: IUsuario[] = [];

  protected dataUtils = inject(DataUtils);
  protected eventManager = inject(EventManager);
  protected datasetService = inject(DatasetService);
  protected datasetFormService = inject(DatasetFormService);
  protected usuarioService = inject(UsuarioService);
  protected activatedRoute = inject(ActivatedRoute);

  // eslint-disable-next-line @typescript-eslint/member-ordering
  editForm: DatasetFormGroup = this.datasetFormService.createDatasetFormGroup();

  compareUsuario = (o1: IUsuario | null, o2: IUsuario | null): boolean => this.usuarioService.compareUsuario(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ dataset }) => {
      this.dataset = dataset;
      if (dataset) {
        this.updateForm(dataset);
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

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const dataset = this.datasetFormService.getDataset(this.editForm);
    if (dataset.id !== null) {
      this.subscribeToSaveResponse(this.datasetService.update(dataset));
    } else {
      this.subscribeToSaveResponse(this.datasetService.create(dataset));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IDataset>>): void {
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

  protected updateForm(dataset: IDataset): void {
    this.dataset = dataset;
    this.datasetFormService.resetForm(this.editForm, dataset);

    this.usuariosSharedCollection = this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(
      this.usuariosSharedCollection,
      dataset.usuario,
    );
  }

  protected loadRelationshipsOptions(): void {
    this.usuarioService
      .query()
      .pipe(map((res: HttpResponse<IUsuario[]>) => res.body ?? []))
      .pipe(map((usuarios: IUsuario[]) => this.usuarioService.addUsuarioToCollectionIfMissing<IUsuario>(usuarios, this.dataset?.usuario)))
      .subscribe((usuarios: IUsuario[]) => (this.usuariosSharedCollection = usuarios));
  }
}
