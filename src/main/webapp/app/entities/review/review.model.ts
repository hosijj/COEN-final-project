import { IProfessor } from 'app/entities/professor/professor.model';
import { ICourses } from 'app/entities/courses/courses.model';

export interface IReview {
  id?: string;
  rate?: number;
  desc?: string | null;
  professors?: IProfessor[] | null;
  courses?: ICourses[] | null;
}

export class Review implements IReview {
  constructor(
    public id?: string,
    public rate?: number,
    public desc?: string | null,
    public professors?: IProfessor[] | null,
    public courses?: ICourses[] | null
  ) {}
}

export function getReviewIdentifier(review: IReview): string | undefined {
  return review.id;
}
