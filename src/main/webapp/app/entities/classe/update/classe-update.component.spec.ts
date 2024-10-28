import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IDataset } from 'app/entities/dataset/dataset.model';
import { DatasetService } from 'app/entities/dataset/service/dataset.service';
import { ClasseService } from '../service/classe.service';
import { IClasse } from '../classe.model';
import { ClasseFormService } from './classe-form.service';

import { ClasseUpdateComponent } from './classe-update.component';

describe('Classe Management Update Component', () => {
  let comp: ClasseUpdateComponent;
  let fixture: ComponentFixture<ClasseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let classeFormService: ClasseFormService;
  let classeService: ClasseService;
  let datasetService: DatasetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ClasseUpdateComponent],
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
      .overrideTemplate(ClasseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ClasseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    classeFormService = TestBed.inject(ClasseFormService);
    classeService = TestBed.inject(ClasseService);
    datasetService = TestBed.inject(DatasetService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Dataset query and add missing value', () => {
      const classe: IClasse = { id: 456 };
      const dataset: IDataset = { id: 19206 };
      classe.dataset = dataset;

      const datasetCollection: IDataset[] = [{ id: 24985 }];
      jest.spyOn(datasetService, 'query').mockReturnValue(of(new HttpResponse({ body: datasetCollection })));
      const additionalDatasets = [dataset];
      const expectedCollection: IDataset[] = [...additionalDatasets, ...datasetCollection];
      jest.spyOn(datasetService, 'addDatasetToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ classe });
      comp.ngOnInit();

      expect(datasetService.query).toHaveBeenCalled();
      expect(datasetService.addDatasetToCollectionIfMissing).toHaveBeenCalledWith(
        datasetCollection,
        ...additionalDatasets.map(expect.objectContaining),
      );
      expect(comp.datasetsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const classe: IClasse = { id: 456 };
      const dataset: IDataset = { id: 28494 };
      classe.dataset = dataset;

      activatedRoute.data = of({ classe });
      comp.ngOnInit();

      expect(comp.datasetsSharedCollection).toContain(dataset);
      expect(comp.classe).toEqual(classe);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClasse>>();
      const classe = { id: 123 };
      jest.spyOn(classeFormService, 'getClasse').mockReturnValue(classe);
      jest.spyOn(classeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ classe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: classe }));
      saveSubject.complete();

      // THEN
      expect(classeFormService.getClasse).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(classeService.update).toHaveBeenCalledWith(expect.objectContaining(classe));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClasse>>();
      const classe = { id: 123 };
      jest.spyOn(classeFormService, 'getClasse').mockReturnValue({ id: null });
      jest.spyOn(classeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ classe: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: classe }));
      saveSubject.complete();

      // THEN
      expect(classeFormService.getClasse).toHaveBeenCalled();
      expect(classeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IClasse>>();
      const classe = { id: 123 };
      jest.spyOn(classeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ classe });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(classeService.update).toHaveBeenCalled();
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
