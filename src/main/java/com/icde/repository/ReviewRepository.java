package com.icde.repository;

import com.icde.domain.Review;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

/**
 * Spring Data MongoDB repository for the Review entity.
 */
@Repository
public interface ReviewRepository extends MongoRepository<Review, String> {
    @Query("{}")
    Page<Review> findAllWithEagerRelationships(Pageable pageable);

    @Query("{}")
    List<Review> findAllWithEagerRelationships();

    @Query("{'id': ?0}")
    Optional<Review> findOneWithEagerRelationships(String id);
}
