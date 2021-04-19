import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IReview, getReviewIdentifier } from '../review.model';

export type EntityResponseType = HttpResponse<IReview>;
export type EntityArrayResponseType = HttpResponse<IReview[]>;

@Injectable({ providedIn: 'root' })
export class ReviewService {
  public resourceUrl = this.applicationConfigService.getEndpointFor('api/reviews');

  constructor(protected http: HttpClient, private applicationConfigService: ApplicationConfigService) {}

  create(review: IReview): Observable<EntityResponseType> {
    return this.http.post<IReview>(this.resourceUrl, review, { observe: 'response' });
  }

  update(review: IReview): Observable<EntityResponseType> {
    return this.http.put<IReview>(`${this.resourceUrl}/${getReviewIdentifier(review) as string}`, review, { observe: 'response' });
  }

  partialUpdate(review: IReview): Observable<EntityResponseType> {
    return this.http.patch<IReview>(`${this.resourceUrl}/${getReviewIdentifier(review) as string}`, review, { observe: 'response' });
  }

  find(id: string): Observable<EntityResponseType> {
    return this.http.get<IReview>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IReview[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: string): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addReviewToCollectionIfMissing(reviewCollection: IReview[], ...reviewsToCheck: (IReview | null | undefined)[]): IReview[] {
    const reviews: IReview[] = reviewsToCheck.filter(isPresent);
    if (reviews.length > 0) {
      const reviewCollectionIdentifiers = reviewCollection.map(reviewItem => getReviewIdentifier(reviewItem)!);
      const reviewsToAdd = reviews.filter(reviewItem => {
        const reviewIdentifier = getReviewIdentifier(reviewItem);
        if (reviewIdentifier == null || reviewCollectionIdentifiers.includes(reviewIdentifier)) {
          return false;
        }
        reviewCollectionIdentifiers.push(reviewIdentifier);
        return true;
      });
      return [...reviewsToAdd, ...reviewCollection];
    }
    return reviewCollection;
  }
}
