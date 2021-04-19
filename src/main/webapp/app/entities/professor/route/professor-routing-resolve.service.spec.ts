jest.mock('@angular/router');

import { TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRouteSnapshot, Router } from '@angular/router';
import { of } from 'rxjs';

import { IProfessor, Professor } from '../professor.model';
import { ProfessorService } from '../service/professor.service';

import { ProfessorRoutingResolveService } from './professor-routing-resolve.service';

describe('Service Tests', () => {
  describe('Professor routing resolve service', () => {
    let mockRouter: Router;
    let mockActivatedRouteSnapshot: ActivatedRouteSnapshot;
    let routingResolveService: ProfessorRoutingResolveService;
    let service: ProfessorService;
    let resultProfessor: IProfessor | undefined;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        providers: [Router, ActivatedRouteSnapshot],
      });
      mockRouter = TestBed.inject(Router);
      mockActivatedRouteSnapshot = TestBed.inject(ActivatedRouteSnapshot);
      routingResolveService = TestBed.inject(ProfessorRoutingResolveService);
      service = TestBed.inject(ProfessorService);
      resultProfessor = undefined;
    });

    describe('resolve', () => {
      it('should return IProfessor returned by find', () => {
        // GIVEN
        service.find = jest.fn(id => of(new HttpResponse({ body: { id } })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProfessor = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultProfessor).toEqual({ id: 'ABC' });
      });

      it('should return new IProfessor if id is not provided', () => {
        // GIVEN
        service.find = jest.fn();
        mockActivatedRouteSnapshot.params = {};

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProfessor = result;
        });

        // THEN
        expect(service.find).not.toBeCalled();
        expect(resultProfessor).toEqual(new Professor());
      });

      it('should route to 404 page if data not found in server', () => {
        // GIVEN
        spyOn(service, 'find').and.returnValue(of(new HttpResponse({ body: null })));
        mockActivatedRouteSnapshot.params = { id: 'ABC' };

        // WHEN
        routingResolveService.resolve(mockActivatedRouteSnapshot).subscribe(result => {
          resultProfessor = result;
        });

        // THEN
        expect(service.find).toBeCalledWith('ABC');
        expect(resultProfessor).toEqual(undefined);
        expect(mockRouter.navigate).toHaveBeenCalledWith(['404']);
      });
    });
  });
});
