jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { ICourses, Courses } from '../courses.model';
import { CoursesService } from '../service/courses.service';

import { CoursesRoutingResolveService } from './courses-routing-resolve.service';

describe('Service Tests', () => {
  describe('Courses routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: CoursesRoutingResolveService;
    let service: CoursesService;
    let resultCourses: ICourses | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(CoursesRoutingResolveService);
      service = TestBed.inject(CoursesService);
      resultCourses = undefined;
    });

    describe('resolve', () => {
      it('should return ICourses returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCourses = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultCourses).toEqual({ id: 'ABC' });
      });

      it('should return new ICourses if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCourses = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultCourses).toEqual(new Courses());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultCourses = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultCourses).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
