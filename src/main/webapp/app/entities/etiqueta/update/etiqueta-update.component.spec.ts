import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IDataset } from 'app/entities/dataset/dataset.model';
import { DatasetService } from 'app/entities/dataset/service/dataset.service';
import { EtiquetaService } from '../service/etiqueta.service';
import { IEtiqueta } from '../etiqueta.model';
import { EtiquetaFormService } from './etiqueta-form.service';

import { EtiquetaUpdateComponent } from './etiqueta-update.component';

describe('Etiqueta Management Update Component', () => {
  let comp: EtiquetaUpdateComponent;
  let fixture: ComponentFixture<EtiquetaUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let etiquetaFormService: EtiquetaFormService;
  let etiquetaService: EtiquetaService;
  let datasetService: DatasetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EtiquetaUpdateComponent],
      providers: [
        provideHttpClient(),
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(EtiquetaUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EtiquetaUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    etiquetaFormService = TestBed.inject(EtiquetaFormService);
    etiquetaService = TestBed.inject(EtiquetaService);
    datasetService = TestBed.inject(DatasetService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Dataset query and add missing value', () => {
      const etiqueta: IEtiqueta = { id: 456 };
      const dataset: IDataset = { id: 28925 };
      etiqueta.dataset = dataset;

      const datasetCollection: IDataset[] = [{ id: 2414 }];
      jest.spyOn(datasetService, 'query').mockReturnValue(of(new HttpResponse({ body: datasetCollection })));
      const additionalDatasets = [dataset];
      const expectedCollection: IDataset[] = [...additionalDatasets, ...datasetCollection];
      jest.spyOn(datasetService, 'addDatasetToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ etiqueta });
      comp.ngOnInit();

      expect(datasetService.query).toHaveBeenCalled();
      expect(datasetService.addDatasetToCollectionIfMissing).toHaveBeenCalledWith(
        datasetCollection,
        ...additionalDatasets.map(expect.objectContaining),
      );
      expect(comp.datasetsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const etiqueta: IEtiqueta = { id: 456 };
      const dataset: IDataset = { id: 20471 };
      etiqueta.dataset = dataset;

      activatedRoute.data = of({ etiqueta });
      comp.ngOnInit();

      expect(comp.datasetsSharedCollection).toContain(dataset);
      expect(comp.etiqueta).toEqual(etiqueta);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEtiqueta>>();
      const etiqueta = { id: 123 };
      jest.spyOn(etiquetaFormService, 'getEtiqueta').mockReturnValue(etiqueta);
      jest.spyOn(etiquetaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etiqueta });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: etiqueta }));
      saveSubject.complete();

      // THEN
      expect(etiquetaFormService.getEtiqueta).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(etiquetaService.update).toHaveBeenCalledWith(expect.objectContaining(etiqueta));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEtiqueta>>();
      const etiqueta = { id: 123 };
      jest.spyOn(etiquetaFormService, 'getEtiqueta').mockReturnValue({ id: null });
      jest.spyOn(etiquetaService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etiqueta: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: etiqueta }));
      saveSubject.complete();

      // THEN
      expect(etiquetaFormService.getEtiqueta).toHaveBeenCalled();
      expect(etiquetaService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEtiqueta>>();
      const etiqueta = { id: 123 };
      jest.spyOn(etiquetaService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etiqueta });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(etiquetaService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareDataset', () => {
      it('Should forward to datasetService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(datasetService, 'compareDataset');
        comp.compareDataset(entity, entity2);
        expect(datasetService.compareDataset).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
