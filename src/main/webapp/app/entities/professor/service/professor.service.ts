import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IProfessor, getProfessorIdentifier } from '../professor.model';

export type EntityResponseType = HttpResponse<IProfessor>;
export type EntityArrayResponseType = HttpResponse<IProfessor[]>;

@Injectable({ providedIn: 'root' })
export class ProfessorService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/professors');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(professor: IProfessor): Observable<EntityResponseType> {
    return this.http.post<IProfessor>(this.resourceUrl, professor, { observe: 'response' });
  }

  update(professor: IProfessor): Observable<EntityResponseType> {
    return this.http.put<IProfessor>(`${this.resourceUrl}/${getProfessorIdentifier(professor) as string}`, professor, {
      observe: 'response',
    });
  }

  partialUpdate(professor: IProfessor): Observable<EntityResponseType> {
    return this.http.patch<IProfessor>(`${this.resourceUrl}/${getProfessorIdentifier(professor) as string}`, professor, {
      observe: 'response',
    });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IProfessor>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IProfessor[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addProfessorToCollectionIfMissing(
    professorCollection: IProfessor[],
    ...professorsToCheck: (IProfessor | null | undefined)[]
  ): IProfessor[] {
    const professors: IProfessor[] = professorsToCheck.filter(isPresent);
    if (professors.length > 0) {
      const professorCollectionIdentifiers = professorCollection.map(professorItem => getProfessorIdentifier(professorItem)!);
      const professorsToAdd = professors.filter(professorItem => {
        const professorIdentifier = getProfessorIdentifier(professorItem);
        if (professorIdentifier == null || professorCollectionIdentifiers.includes(professorIdentifier)) {
          return false;
        }
        professorCollectionIdentifiers.push(professorIdentifier);
        return true;
      });
      return [...professorsToAdd, ...professorCollection];
    }
    return professorCollection;
  }
}
