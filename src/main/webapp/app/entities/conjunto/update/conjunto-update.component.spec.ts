import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IDataset } from 'app/entities/dataset/dataset.model';
import { DatasetService } from 'app/entities/dataset/service/dataset.service';
import { ConjuntoService } from '../service/conjunto.service';
import { IConjunto } from '../conjunto.model';
import { ConjuntoFormService } from './conjunto-form.service';

import { ConjuntoUpdateComponent } from './conjunto-update.component';

describe('Conjunto Management Update Component', () => {
  let comp: ConjuntoUpdateComponent;
  let fixture: ComponentFixture<ConjuntoUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let conjuntoFormService: ConjuntoFormService;
  let conjuntoService: ConjuntoService;
  let datasetService: DatasetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConjuntoUpdateComponent],
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
      .overrideTemplate(ConjuntoUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ConjuntoUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    conjuntoFormService = TestBed.inject(ConjuntoFormService);
    conjuntoService = TestBed.inject(ConjuntoService);
    datasetService = TestBed.inject(DatasetService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Dataset query and add missing value', () => {
      const conjunto: IConjunto = { id: 456 };
      const dataset: IDataset = { id: 24427 };
      conjunto.dataset = dataset;

      const datasetCollection: IDataset[] = [{ id: 23687 }];
      jest.spyOn(datasetService, 'query').mockReturnValue(of(new HttpResponse({ body: datasetCollection })));
      const additionalDatasets = [dataset];
      const expectedCollection: IDataset[] = [...additionalDatasets, ...datasetCollection];
      jest.spyOn(datasetService, 'addDatasetToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ conjunto });
      comp.ngOnInit();

      expect(datasetService.query).toHaveBeenCalled();
      expect(datasetService.addDatasetToCollectionIfMissing).toHaveBeenCalledWith(
        datasetCollection,
        ...additionalDatasets.map(expect.objectContaining),
      );
      expect(comp.datasetsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const conjunto: IConjunto = { id: 456 };
      const dataset: IDataset = { id: 21453 };
      conjunto.dataset = dataset;

      activatedRoute.data = of({ conjunto });
      comp.ngOnInit();

      expect(comp.datasetsSharedCollection).toContain(dataset);
      expect(comp.conjunto).toEqual(conjunto);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConjunto>>();
      const conjunto = { id: 123 };
      jest.spyOn(conjuntoFormService, 'getConjunto').mockReturnValue(conjunto);
      jest.spyOn(conjuntoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ conjunto });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: conjunto }));
      saveSubject.complete();

      // THEN
      expect(conjuntoFormService.getConjunto).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(conjuntoService.update).toHaveBeenCalledWith(expect.objectContaining(conjunto));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConjunto>>();
      const conjunto = { id: 123 };
      jest.spyOn(conjuntoFormService, 'getConjunto').mockReturnValue({ id: null });
      jest.spyOn(conjuntoService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ conjunto: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: conjunto }));
      saveSubject.complete();

      // THEN
      expect(conjuntoFormService.getConjunto).toHaveBeenCalled();
      expect(conjuntoService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IConjunto>>();
      const conjunto = { id: 123 };
      jest.spyOn(conjuntoService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ conjunto });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(conjuntoService.update).toHaveBeenCalled();
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
