package com.icde.repository;

import com.icde.domain.Courses;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Courses entity.
 */
@SuppressWarnings("unused")
@Repository
public interface CoursesRepository extends MongoRepository<Courses, String> {}
