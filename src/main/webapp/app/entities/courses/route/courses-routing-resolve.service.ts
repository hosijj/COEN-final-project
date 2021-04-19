import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICourses, Courses } from '../courses.model';
import { CoursesService } from '../service/courses.service';

@Injectable({ providedIn: 'root' })
export class CoursesRoutingResolveService implements Resolve<ICourses> {
  constructor(protected service: CoursesService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICourses> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((courses: HttpResponse<Courses>) => {
          if (courses.body) {
            return of(courses.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Courses());
  }
}
