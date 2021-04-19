package com.icde.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.icde.IntegrationTest;
import com.icde.domain.Courses;
import com.icde.repository.CoursesRepository;
import java.util.List;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

/**
 * Integration tests for the {@link CoursesResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class CoursesResourceIT {

    private static final String DEFAULT_NAME = "AAAAAAAAAA";
    private static final String UPDATED_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_CODE = "AAAAAAAAAA";
    private static final String UPDATED_CODE = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/courses";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private CoursesRepository coursesRepository;

    @Autowired
    private MockMvc restCoursesMockMvc;

    private Courses courses;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Courses createEntity() {
        Courses courses = new Courses().name(DEFAULT_NAME).code(DEFAULT_CODE).description(DEFAULT_DESCRIPTION);
        return courses;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Courses createUpdatedEntity() {
        Courses courses = new Courses().name(UPDATED_NAME).code(UPDATED_CODE).description(UPDATED_DESCRIPTION);
        return courses;
    }

    @BeforeEach
    public void initTest() {
        coursesRepository.deleteAll();
        courses = createEntity();
    }

    @Test
    void createCourses() throws Exception {
        int databaseSizeBeforeCreate = coursesRepository.findAll().size();
        // Create the Courses
        restCoursesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(courses)))
            .andExpect(status().isCreated());

        // Validate the Courses in the database
        List<Courses> coursesList = coursesRepository.findAll();
        assertThat(coursesList).hasSize(databaseSizeBeforeCreate + 1);
        Courses testCourses = coursesList.get(coursesList.size() - 1);
        assertThat(testCourses.getName()).isEqualTo(DEFAULT_NAME);
        assertThat(testCourses.getCode()).isEqualTo(DEFAULT_CODE);
        assertThat(testCourses.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    void createCoursesWithExistingId() throws Exception {
        // Create the Courses with an existing ID
        courses.setId("existing_id");

        int databaseSizeBeforeCreate = coursesRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restCoursesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(courses)))
            .andExpect(status().isBadRequest());

        // Validate the Courses in the database
        List<Courses> coursesList = coursesRepository.findAll();
        assertThat(coursesList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = coursesRepository.findAll().size();
        // set the field null
        courses.setName(null);

        // Create the Courses, which fails.

        restCoursesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(courses)))
            .andExpect(status().isBadRequest());

        List<Courses> coursesList = coursesRepository.findAll();
        assertThat(coursesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkCodeIsRequired() throws Exception {
        int databaseSizeBeforeTest = coursesRepository.findAll().size();
        // set the field null
        courses.setCode(null);

        // Create the Courses, which fails.

        restCoursesMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(courses)))
            .andExpect(status().isBadRequest());

        List<Courses> coursesList = coursesRepository.findAll();
        assertThat(coursesList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllCourses() throws Exception {
        // Initialize the database
        coursesRepository.save(courses);

        // Get all the coursesList
        restCoursesMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(courses.getId())))
            .andExpect(jsonPath("$.[*].name").value(hasItem(DEFAULT_NAME)))
            .andExpect(jsonPath("$.[*].code").value(hasItem(DEFAULT_CODE)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)));
    }

    @Test
    void getCourses() throws Exception {
        // Initialize the database
        coursesRepository.save(courses);

        // Get the courses
        restCoursesMockMvc
            .perform(get(ENTITY_API_URL_ID, courses.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(courses.getId()))
            .andExpect(jsonPath("$.name").value(DEFAULT_NAME))
            .andExpect(jsonPath("$.code").value(DEFAULT_CODE))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION));
    }

    @Test
    void getNonExistingCourses() throws Exception {
        // Get the courses
        restCoursesMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putNewCourses() throws Exception {
        // Initialize the database
        coursesRepository.save(courses);

        int databaseSizeBeforeUpdate = coursesRepository.findAll().size();

        // Update the courses
        Courses updatedCourses = coursesRepository.findById(courses.getId()).get();
        updatedCourses.name(UPDATED_NAME).code(UPDATED_CODE).description(UPDATED_DESCRIPTION);

        restCoursesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedCourses.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedCourses))
            )
            .andExpect(status().isOk());

        // Validate the Courses in the database
        List<Courses> coursesList = coursesRepository.findAll();
        assertThat(coursesList).hasSize(databaseSizeBeforeUpdate);
        Courses testCourses = coursesList.get(coursesList.size() - 1);
        assertThat(testCourses.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCourses.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testCourses.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    void putNonExistingCourses() throws Exception {
        int databaseSizeBeforeUpdate = coursesRepository.findAll().size();
        courses.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCoursesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, courses.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(courses))
            )
            .andExpect(status().isBadRequest());

        // Validate the Courses in the database
        List<Courses> coursesList = coursesRepository.findAll();
        assertThat(coursesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchCourses() throws Exception {
        int databaseSizeBeforeUpdate = coursesRepository.findAll().size();
        courses.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCoursesMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(courses))
            )
            .andExpect(status().isBadRequest());

        // Validate the Courses in the database
        List<Courses> coursesList = coursesRepository.findAll();
        assertThat(coursesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamCourses() throws Exception {
        int databaseSizeBeforeUpdate = coursesRepository.findAll().size();
        courses.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCoursesMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(courses)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Courses in the database
        List<Courses> coursesList = coursesRepository.findAll();
        assertThat(coursesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateCoursesWithPatch() throws Exception {
        // Initialize the database
        coursesRepository.save(courses);

        int databaseSizeBeforeUpdate = coursesRepository.findAll().size();

        // Update the courses using partial update
        Courses partialUpdatedCourses = new Courses();
        partialUpdatedCourses.setId(courses.getId());

        partialUpdatedCourses.name(UPDATED_NAME).code(UPDATED_CODE);

        restCoursesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCourses.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCourses))
            )
            .andExpect(status().isOk());

        // Validate the Courses in the database
        List<Courses> coursesList = coursesRepository.findAll();
        assertThat(coursesList).hasSize(databaseSizeBeforeUpdate);
        Courses testCourses = coursesList.get(coursesList.size() - 1);
        assertThat(testCourses.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCourses.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testCourses.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
    }

    @Test
    void fullUpdateCoursesWithPatch() throws Exception {
        // Initialize the database
        coursesRepository.save(courses);

        int databaseSizeBeforeUpdate = coursesRepository.findAll().size();

        // Update the courses using partial update
        Courses partialUpdatedCourses = new Courses();
        partialUpdatedCourses.setId(courses.getId());

        partialUpdatedCourses.name(UPDATED_NAME).code(UPDATED_CODE).description(UPDATED_DESCRIPTION);

        restCoursesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedCourses.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedCourses))
            )
            .andExpect(status().isOk());

        // Validate the Courses in the database
        List<Courses> coursesList = coursesRepository.findAll();
        assertThat(coursesList).hasSize(databaseSizeBeforeUpdate);
        Courses testCourses = coursesList.get(coursesList.size() - 1);
        assertThat(testCourses.getName()).isEqualTo(UPDATED_NAME);
        assertThat(testCourses.getCode()).isEqualTo(UPDATED_CODE);
        assertThat(testCourses.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
    }

    @Test
    void patchNonExistingCourses() throws Exception {
        int databaseSizeBeforeUpdate = coursesRepository.findAll().size();
        courses.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restCoursesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, courses.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(courses))
            )
            .andExpect(status().isBadRequest());

        // Validate the Courses in the database
        List<Courses> coursesList = coursesRepository.findAll();
        assertThat(coursesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchCourses() throws Exception {
        int databaseSizeBeforeUpdate = coursesRepository.findAll().size();
        courses.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCoursesMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(courses))
            )
            .andExpect(status().isBadRequest());

        // Validate the Courses in the database
        List<Courses> coursesList = coursesRepository.findAll();
        assertThat(coursesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamCourses() throws Exception {
        int databaseSizeBeforeUpdate = coursesRepository.findAll().size();
        courses.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restCoursesMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(courses)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Courses in the database
        List<Courses> coursesList = coursesRepository.findAll();
        assertThat(coursesList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteCourses() throws Exception {
        // Initialize the database
        coursesRepository.save(courses);

        int databaseSizeBeforeDelete = coursesRepository.findAll().size();

        // Delete the courses
        restCoursesMockMvc
            .perform(delete(ENTITY_API_URL_ID, courses.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Courses> coursesList = coursesRepository.findAll();
        assertThat(coursesList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
