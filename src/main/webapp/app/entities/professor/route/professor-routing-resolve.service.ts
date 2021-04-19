import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IProfessor, Professor } from '../professor.model';
import { ProfessorService } from '../service/professor.service';

@Injectable({ providedIn: 'root' })
export class ProfessorRoutingResolveService implements Resolve<IProfessor> {
  constructor(protected service: ProfessorService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IProfessor> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((professor: HttpResponse<Professor>) => {
          if (professor.body) {
            return of(professor.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Professor());
  }
}
