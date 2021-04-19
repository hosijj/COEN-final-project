export interface ICourses {
  id?: string;
  name?: string;
  code?: string;
  description?: string | null;
}

export class Courses implements ICourses {
  constructor(public id?: string, public name?: string, public code?: string, public description?: string | null) {}
}

export function getCoursesIdentifier(courses: ICourses): string | undefined {
  return courses.id;
}
