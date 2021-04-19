import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICourses, getCoursesIdentifier } from '../courses.model';

export type EntityResponseType = HttpResponse<ICourses>;
export type EntityArrayResponseType = HttpResponse<ICourses[]>;

@Injectable({ providedIn: 'root' })
export class CoursesService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/courses');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(courses: ICourses): Observable<EntityResponseType> {
    return this.http.post<ICourses>(this.resourceUrl, courses, { observe: 'response' });
  }

  update(courses: ICourses): Observable<EntityResponseType> {
    return this.http.put<ICourses>(`${this.resourceUrl}/${getCoursesIdentifier(courses) as string}`, courses, { observe: 'response' });
  }

  partialUpdate(courses: ICourses): Observable<EntityResponseType> {
    return this.http.patch<ICourses>(`${this.resourceUrl}/${getCoursesIdentifier(courses) as string}`, courses, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<ICourses>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICourses[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addCoursesToCollectionIfMissing(coursesCollection: ICourses[], ...coursesToCheck: (ICourses | null | undefined)[]): ICourses[] {
    const courses: ICourses[] = coursesToCheck.filter(isPresent);
    if (courses.length > 0) {
      const coursesCollectionIdentifiers = coursesCollection.map(coursesItem => getCoursesIdentifier(coursesItem)!);
      const coursesToAdd = courses.filter(coursesItem => {
        const coursesIdentifier = getCoursesIdentifier(coursesItem);
        if (coursesIdentifier == null || coursesCollectionIdentifiers.includes(coursesIdentifier)) {
          return false;
        }
        coursesCollectionIdentifiers.push(coursesIdentifier);
        return true;
      });
      return [...coursesToAdd, ...coursesCollection];
    }
    return coursesCollection;
  }
}
