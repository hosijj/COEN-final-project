jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CoursesService } from '../service/courses.service';
import { ICourses, Courses } from '../courses.model';

import { CoursesUpdateComponent } from './courses-update.component';

describe('Component Tests', () => {
  describe('Courses Management Update Component', () => {
    let comp: CoursesUpdateComponent;
    let fixture: ComponentFixture<CoursesUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let coursesService: CoursesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CoursesUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CoursesUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CoursesUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      coursesService = TestBed.inject(CoursesService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should update editForm', () => {
        const courses: ICourses = { id: 'CBA' };

        activatedRoute.data = of({ courses });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(courses));
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const courses = { id: 'ABC' };
        spyOn(coursesService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ courses });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: courses }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(coursesService.update).toHaveBeenCalledWith(courses);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const courses = new Courses();
        spyOn(coursesService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ courses });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: courses }));
        saveSubject.complete();

        // THEN
        expect(coursesService.create).toHaveBeenCalledWith(courses);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const courses = { id: 'ABC' };
        spyOn(coursesService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ courses });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(coursesService.update).toHaveBeenCalledWith(courses);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });
  });
});
