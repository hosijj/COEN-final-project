import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { CoursesDetailComponent } from './courses-detail.component';

describe('Component Tests', () => {
  describe('Courses Management Detail Component', () => {
    let comp: CoursesDetailComponent;
    let fixture: ComponentFixture<CoursesDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [CoursesDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ courses: { id: 'ABC' } }) },
          },
        ],
      })
        .overrideTemplate(CoursesDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(CoursesDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load courses on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.courses).toEqual(jasmine.objectContaining({ id: 'ABC' }));
      });
    });
  });
});
