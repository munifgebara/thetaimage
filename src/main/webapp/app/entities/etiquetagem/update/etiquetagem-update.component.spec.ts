import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse, provideHttpClient } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject, from, of } from 'rxjs';

import { IEtiqueta } from 'app/entities/etiqueta/etiqueta.model';
import { EtiquetaService } from 'app/entities/etiqueta/service/etiqueta.service';
import { IImagem } from 'app/entities/imagem/imagem.model';
import { ImagemService } from 'app/entities/imagem/service/imagem.service';
import { IEtiquetagem } from '../etiquetagem.model';
import { EtiquetagemService } from '../service/etiquetagem.service';
import { EtiquetagemFormService } from './etiquetagem-form.service';

import { EtiquetagemUpdateComponent } from './etiquetagem-update.component';

describe('Etiquetagem Management Update Component', () => {
  let comp: EtiquetagemUpdateComponent;
  let fixture: ComponentFixture<EtiquetagemUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let etiquetagemFormService: EtiquetagemFormService;
  let etiquetagemService: EtiquetagemService;
  let etiquetaService: EtiquetaService;
  let imagemService: ImagemService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [EtiquetagemUpdateComponent],
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
      .overrideTemplate(EtiquetagemUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EtiquetagemUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    etiquetagemFormService = TestBed.inject(EtiquetagemFormService);
    etiquetagemService = TestBed.inject(EtiquetagemService);
    etiquetaService = TestBed.inject(EtiquetaService);
    imagemService = TestBed.inject(ImagemService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Etiqueta query and add missing value', () => {
      const etiquetagem: IEtiquetagem = { id: 456 };
      const etiqueta: IEtiqueta = { id: 13086 };
      etiquetagem.etiqueta = etiqueta;

      const etiquetaCollection: IEtiqueta[] = [{ id: 30373 }];
      jest.spyOn(etiquetaService, 'query').mockReturnValue(of(new HttpResponse({ body: etiquetaCollection })));
      const additionalEtiquetas = [etiqueta];
      const expectedCollection: IEtiqueta[] = [...additionalEtiquetas, ...etiquetaCollection];
      jest.spyOn(etiquetaService, 'addEtiquetaToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ etiquetagem });
      comp.ngOnInit();

      expect(etiquetaService.query).toHaveBeenCalled();
      expect(etiquetaService.addEtiquetaToCollectionIfMissing).toHaveBeenCalledWith(
        etiquetaCollection,
        ...additionalEtiquetas.map(expect.objectContaining),
      );
      expect(comp.etiquetasSharedCollection).toEqual(expectedCollection);
    });

    it('Should call Imagem query and add missing value', () => {
      const etiquetagem: IEtiquetagem = { id: 456 };
      const imagem: IImagem = { id: 2753 };
      etiquetagem.imagem = imagem;

      const imagemCollection: IImagem[] = [{ id: 13882 }];
      jest.spyOn(imagemService, 'query').mockReturnValue(of(new HttpResponse({ body: imagemCollection })));
      const additionalImagems = [imagem];
      const expectedCollection: IImagem[] = [...additionalImagems, ...imagemCollection];
      jest.spyOn(imagemService, 'addImagemToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ etiquetagem });
      comp.ngOnInit();

      expect(imagemService.query).toHaveBeenCalled();
      expect(imagemService.addImagemToCollectionIfMissing).toHaveBeenCalledWith(
        imagemCollection,
        ...additionalImagems.map(expect.objectContaining),
      );
      expect(comp.imagemsSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const etiquetagem: IEtiquetagem = { id: 456 };
      const etiqueta: IEtiqueta = { id: 10814 };
      etiquetagem.etiqueta = etiqueta;
      const imagem: IImagem = { id: 23625 };
      etiquetagem.imagem = imagem;

      activatedRoute.data = of({ etiquetagem });
      comp.ngOnInit();

      expect(comp.etiquetasSharedCollection).toContain(etiqueta);
      expect(comp.imagemsSharedCollection).toContain(imagem);
      expect(comp.etiquetagem).toEqual(etiquetagem);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEtiquetagem>>();
      const etiquetagem = { id: 123 };
      jest.spyOn(etiquetagemFormService, 'getEtiquetagem').mockReturnValue(etiquetagem);
      jest.spyOn(etiquetagemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etiquetagem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: etiquetagem }));
      saveSubject.complete();

      // THEN
      expect(etiquetagemFormService.getEtiquetagem).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(etiquetagemService.update).toHaveBeenCalledWith(expect.objectContaining(etiquetagem));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEtiquetagem>>();
      const etiquetagem = { id: 123 };
      jest.spyOn(etiquetagemFormService, 'getEtiquetagem').mockReturnValue({ id: null });
      jest.spyOn(etiquetagemService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etiquetagem: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: etiquetagem }));
      saveSubject.complete();

      // THEN
      expect(etiquetagemFormService.getEtiquetagem).toHaveBeenCalled();
      expect(etiquetagemService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IEtiquetagem>>();
      const etiquetagem = { id: 123 };
      jest.spyOn(etiquetagemService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ etiquetagem });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(etiquetagemService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareEtiqueta', () => {
      it('Should forward to etiquetaService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(etiquetaService, 'compareEtiqueta');
        comp.compareEtiqueta(entity, entity2);
        expect(etiquetaService.compareEtiqueta).toHaveBeenCalledWith(entity, entity2);
      });
    });

    describe('compareImagem', () => {
      it('Should forward to imagemService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(imagemService, 'compareImagem');
        comp.compareImagem(entity, entity2);
        expect(imagemService.compareImagem).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
