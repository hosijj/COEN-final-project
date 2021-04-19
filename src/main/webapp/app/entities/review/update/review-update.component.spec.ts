jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { ReviewService } from '../service/review.service';
import { IReview, Review } from '../review.model';
import { IProfessor } from 'app/entities/professor/professor.model';
import { ProfessorService } from 'app/entities/professor/service/professor.service';
import { ICourses } from 'app/entities/courses/courses.model';
import { CoursesService } from 'app/entities/courses/service/courses.service';

import { ReviewUpdateComponent } from './review-update.component';

describe('Component Tests', () => {
  describe('Review Management Update Component', () => {
    let comp: ReviewUpdateComponent;
    let fixture: ComponentFixture<ReviewUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let reviewService: ReviewService;
    let professorService: ProfessorService;
    let coursesService: CoursesService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ReviewUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(ReviewUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ReviewUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      reviewService = TestBed.inject(ReviewService);
      professorService = TestBed.inject(ProfessorService);
      coursesService = TestBed.inject(CoursesService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Professor query and add missing value', () => {
        const review: IReview = { id: 'CBA' };
        const professors: IProfessor[] = [{ id: 'Kentucky expedite' }];
        review.professors = professors;

        const professorCollection: IProfessor[] = [{ id: 'protocol feed' }];
        spyOn(professorService, 'query').and.returnValue(of(new HttpResponse({ body: professorCollection })));
        const additionalProfessors = [...professors];
        const expectedCollection: IProfessor[] = [...additionalProfessors, ...professorCollection];
        spyOn(professorService, 'addProfessorToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ review });
        comp.ngOnInit();

        expect(professorService.query).toHaveBeenCalled();
        expect(professorService.addProfessorToCollectionIfMissing).toHaveBeenCalledWith(professorCollection, ...additionalProfessors);
        expect(comp.professorsSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Courses query and add missing value', () => {
        const review: IReview = { id: 'CBA' };
        const courses: ICourses[] = [{ id: 'content' }];
        review.courses = courses;

        const coursesCollection: ICourses[] = [{ id: 'Nigeria Loan' }];
        spyOn(coursesService, 'query').and.returnValue(of(new HttpResponse({ body: coursesCollection })));
        const additionalCourses = [...courses];
        const expectedCollection: ICourses[] = [...additionalCourses, ...coursesCollection];
        spyOn(coursesService, 'addCoursesToCollectionIfMissing').and.returnValue(expectedCollection);

        activatedRoute.data = of({ review });
        comp.ngOnInit();

        expect(coursesService.query).toHaveBeenCalled();
        expect(coursesService.addCoursesToCollectionIfMissing).toHaveBeenCalledWith(coursesCollection, ...additionalCourses);
        expect(comp.coursesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const review: IReview = { id: 'CBA' };
        const professors: IProfessor = { id: 'Buckinghamshire' };
        review.professors = [professors];
        const courses: ICourses = { id: 'Bacon Dakota Kyrgyz' };
        review.courses = [courses];

        activatedRoute.data = of({ review });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(review));
        expect(comp.professorsSharedCollection).toContain(professors);
        expect(comp.coursesSharedCollection).toContain(courses);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const review = { id: 'ABC' };
        spyOn(reviewService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ review });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: review }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(reviewService.update).toHaveBeenCalledWith(review);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject();
        const review = new Review();
        spyOn(reviewService, 'create').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ review });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: review }));
        saveSubject.complete();

        // THEN
        expect(reviewService.create).toHaveBeenCalledWith(review);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject();
        const review = { id: 'ABC' };
        spyOn(reviewService, 'update').and.returnValue(saveSubject);
        spyOn(comp, 'previousState');
        activatedRoute.data = of({ review });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(reviewService.update).toHaveBeenCalledWith(review);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackProfessorById', () => {
        it('Should return tracked Professor primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackProfessorById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackCoursesById', () => {
        it('Should return tracked Courses primary key', () => {
          const entity = { id: 'ABC' };
          const trackResult = comp.trackCoursesById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedProfessor', () => {
        it('Should return option if no Professor is selected', () => {
          const option = { id: 'ABC' };
          const result = comp.getSelectedProfessor(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Professor for according option', () => {
          const option = { id: 'ABC' };
          const selected = { id: 'ABC' };
          const selected2 = { id: 'CBA' };
          const result = comp.getSelectedProfessor(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Professor is not selected', () => {
          const option = { id: 'ABC' };
          const selected = { id: 'CBA' };
          const result = comp.getSelectedProfessor(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });

      describe('getSelectedCourses', () => {
        it('Should return option if no Courses is selected', () => {
          const option = { id: 'ABC' };
          const result = comp.getSelectedCourses(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Courses for according option', () => {
          const option = { id: 'ABC' };
          const selected = { id: 'ABC' };
          const selected2 = { id: 'CBA' };
          const result = comp.getSelectedCourses(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Courses is not selected', () => {
          const option = { id: 'ABC' };
          const selected = { id: 'CBA' };
          const result = comp.getSelectedCourses(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
