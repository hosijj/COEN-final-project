package com.icde.web.rest;

import com.icde.domain.Courses;
import com.icde.repository.CoursesRepository;
import com.icde.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.icde.domain.Courses}.
 */
@RestController
@RequestMapping("/api")
public class CoursesResource {

    private final Logger log = LoggerFactory.getLogger(CoursesResource.class);

    private static final String ENTITY_NAME = "courses";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CoursesRepository coursesRepository;

    public CoursesResource(CoursesRepository coursesRepository) {
        this.coursesRepository = coursesRepository;
    }

    /**
     * {@code POST  /courses} : Create a new courses.
     *
     * @param courses the courses to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new courses, or with status {@code 400 (Bad Request)} if the courses has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/courses")
    public ResponseEntity<Courses> createCourses(@Valid @RequestBody Courses courses) throws URISyntaxException {
        log.debug("REST request to save Courses : {}", courses);
        if (courses.getId() != null) {
            throw new BadRequestAlertException("A new courses cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Courses result = coursesRepository.save(courses);
        return ResponseEntity
            .created(new URI("/api/courses/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId()))
            .body(result);
    }

    /**
     * {@code PUT  /courses/:id} : Updates an existing courses.
     *
     * @param id the id of the courses to save.
     * @param courses the courses to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated courses,
     * or with status {@code 400 (Bad Request)} if the courses is not valid,
     * or with status {@code 500 (Internal Server Error)} if the courses couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/courses/{id}")
    public ResponseEntity<Courses> updateCourses(
        @PathVariable(value = "id", required = false) final String id,
        @Valid @RequestBody Courses courses
    ) throws URISyntaxException {
        log.debug("REST request to update Courses : {}, {}", id, courses);
        if (courses.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, courses.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!coursesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Courses result = coursesRepository.save(courses);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, courses.getId()))
            .body(result);
    }

    /**
     * {@code PATCH  /courses/:id} : Partial updates given fields of an existing courses, field will ignore if it is null
     *
     * @param id the id of the courses to save.
     * @param courses the courses to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated courses,
     * or with status {@code 400 (Bad Request)} if the courses is not valid,
     * or with status {@code 404 (Not Found)} if the courses is not found,
     * or with status {@code 500 (Internal Server Error)} if the courses couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/courses/{id}", consumes = "application/merge-patch+json")
    public ResponseEntity<Courses> partialUpdateCourses(
        @PathVariable(value = "id", required = false) final String id,
        @NotNull @RequestBody Courses courses
    ) throws URISyntaxException {
        log.debug("REST request to partial update Courses partially : {}, {}", id, courses);
        if (courses.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, courses.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!coursesRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Courses> result = coursesRepository
            .findById(courses.getId())
            .map(
                existingCourses -> {
                    if (courses.getName() != null) {
                        existingCourses.setName(courses.getName());
                    }
                    if (courses.getCode() != null) {
                        existingCourses.setCode(courses.getCode());
                    }
                    if (courses.getDescription() != null) {
                        existingCourses.setDescription(courses.getDescription());
                    }

                    return existingCourses;
                }
            )
            .map(coursesRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, courses.getId())
        );
    }

    /**
     * {@code GET  /courses} : get all the courses.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of courses in body.
     */
    @GetMapping("/courses")
    public ResponseEntity<List<Courses>> getAllCourses(Pageable pageable) {
        log.debug("REST request to get a page of Courses");
        Page<Courses> page = coursesRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /courses/:id} : get the "id" courses.
     *
     * @param id the id of the courses to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the courses, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/courses/{id}")
    public ResponseEntity<Courses> getCourses(@PathVariable String id) {
        log.debug("REST request to get Courses : {}", id);
        Optional<Courses> courses = coursesRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(courses);
    }

    /**
     * {@code DELETE  /courses/:id} : delete the "id" courses.
     *
     * @param id the id of the courses to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/courses/{id}")
    public ResponseEntity<Void> deleteCourses(@PathVariable String id) {
        log.debug("REST request to delete Courses : {}", id);
        coursesRepository.deleteById(id);
        return ResponseEntity.noContent().headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id)).build();
    }
}
