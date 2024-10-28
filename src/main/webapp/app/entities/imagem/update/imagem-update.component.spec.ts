import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IDataset } from 'app/entities/dataset/dataset.model';
import { DatasetService } from 'app/entities/dataset/service/dataset.service';
import { IConjunto } from 'app/entities/conjunto/conjunto.model';
import { ConjuntoService } from 'app/entities/conjunto/service/conjunto.service';
import { IClasse } from 'app/entities/classe/classe.model';
import { ClasseService } from 'app/entities/classe/service/classe.service';
import { IImagem } from '../imagem.model';
import { ImagemService } from '../service/imagem.service';
import { ImagemFormService } from './imagem-form.service';

import { ImagemUpdateComponent } from './imagem-update.component';

describe('Imagem Management Update Component', () => {
  let comp: ImagemUpdateComponent;
  let fixture: ComponentFixture<ImagemUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let imagemFormService: ImagemFormService;
  let imagemService: ImagemService;
  let datasetService: DatasetService;
  let conjuntoService: ConjuntoService;
  let classeService: ClasseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ImagemUpdateComponent],
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
      .overrideTemplate(ImagemUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ImagemUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    imagemFormService = TestBed.inject(ImagemFormService);
    imagemService = TestBed.inject(ImagemService);
    datasetService = TestBed.inject(DatasetService);
    conjuntoService = TestBed.inject(ConjuntoService);
    classeService = TestBed.inject(ClasseService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Dataset query and add missing value', () => {
      const imagem: IImagem = { id: 456 };
      const dataset: IDataset = { id: 11049 };
      imagem.dataset = dataset;

      const datasetCollection: IDataset[] = [{ id: 2267 }];
      jest.spyOn(datasetService, 'query').mockReturnValue(of(new HttpResponse({ body: datasetCollection })));
      const additionalDatasets = [dataset];
      const expectedCollection: IDataset[] = [...additionalDatasets, ...datasetCollection];
      jest.spyOn(datasetService, 'addDatasetToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ imagem });
      comp.ngOnInit();

      expect(datasetService.query).toHaveBeenCalled();
      expect(datasetService.addDatasetToCollectionIfMissing).toHaveBeenCalledWith(
        datasetCollection,
        ...additionalDatasets.map(expect.objectContaining),
      );
      expect(comp.datasetsSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Conjunto query and add missing value', () => {
      const imagem: IImagem = { id: 456 };
      const conjunto: IConjunto = { id: 2999 };
      imagem.conjunto = conjunto;

      const conjuntoCollection: IConjunto[] = [{ id: 26385 }];
      jest.spyOn(conjuntoService, 'query').mockReturnValue(of(new HttpResponse({ body: conjuntoCollection })));
      const additionalConjuntos = [conjunto];
      const expectedCollection: IConjunto[] = [...additionalConjuntos, ...conjuntoCollection];
      jest.spyOn(conjuntoService, 'addConjuntoToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ imagem });
      comp.ngOnInit();

      expect(conjuntoService.query).toHaveBeenCalled();
      expect(conjuntoService.addConjuntoToCollectionIfMissing).toHaveBeenCalledWith(
        conjuntoCollection,
        ...additionalConjuntos.map(expect.objectContaining),
      );
      expect(comp.conjuntosSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Classe query and add missing value', () => {
      const imagem: IImagem = { id: 456 };
      const classe: IClasse = { id: 14255 };
      imagem.classe = classe;

      const classeCollection: IClasse[] = [{ id: 17215 }];
      jest.spyOn(classeService, 'query').mockReturnValue(of(new HttpResponse({ body: classeCollection })));
      const additionalClasses = [classe];
      const expectedCollection: IClasse[] = [...additionalClasses, ...classeCollection];
      jest.spyOn(classeService, 'addClasseToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ imagem });
      comp.ngOnInit();

      expect(classeService.query).toHaveBeenCalled();
      expect(classeService.addClasseToCollectionIfMissing).toHaveBeenCalledWith(
        classeCollection,
        ...additionalClasses.map(expect.objectContaining),
      );
      expect(comp.classesSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const imagem: IImagem = { id: 456 };
      const dataset: IDataset = { id: 10568 };
      imagem.dataset = dataset;
      const conjunto: IConjunto = { id: 5171 };
      imagem.conjunto = conjunto;
      const classe: IClasse = { id: 22496 };
      imagem.classe = classe;

      activatedRoute.data = of({ imagem });
      comp.ngOnInit();

      expect(comp.datasetsSharedCollection).toContain(dataset);
      expect(comp.conjuntosSharedCollection).toContain(conjunto);
      expect(comp.classesSharedCollection).toContain(classe);
      expect(comp.imagem).toEqual(imagem);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IImagem>>();
      const imagem = { id: 123 };
      jest.spyOn(imagemFormService, 'getImagem').mockReturnValue(imagem);
      jest.spyOn(imagemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ imagem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: imagem }));
      saveSubject.complete();

      // THEN
      expect(imagemFormService.getImagem).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(imagemService.update).toHaveBeenCalledWith(expect.objectContaining(imagem));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IImagem>>();
      const imagem = { id: 123 };
      jest.spyOn(imagemFormService, 'getImagem').mockReturnValue({ id: null });
      jest.spyOn(imagemService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ imagem: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: imagem }));
      saveSubject.complete();

      // THEN
      expect(imagemFormService.getImagem).toHaveBeenCalled();
      expect(imagemService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IImagem>>();
      const imagem = { id: 123 };
      jest.spyOn(imagemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ imagem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(imagemService.update).toHaveBeenCalled();
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

    describe('compareConjunto', () => {
      it('Should forward to conjuntoService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(conjuntoService, 'compareConjunto');
        comp.compareConjunto(entity, entity2);
        expect(conjuntoService.compareConjunto).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareClasse', () => {
      it('Should forward to classeService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(classeService, 'compareClasse');
        comp.compareClasse(entity, entity2);
        expect(classeService.compareClasse).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
