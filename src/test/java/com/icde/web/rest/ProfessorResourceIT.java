package com.icde.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.icde.IntegrationTest;
import com.icde.domain.Professor;
import com.icde.repository.ProfessorRepository;
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
 * Integration tests for the {@link ProfessorResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ProfessorResourceIT {

    private static final String DEFAULT_FIRST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_FIRST_NAME = "BBBBBBBBBB";

    private static final String DEFAULT_LAST_NAME = "AAAAAAAAAA";
    private static final String UPDATED_LAST_NAME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/professors";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    @Autowired
    private ProfessorRepository professorRepository;

    @Autowired
    private MockMvc restProfessorMockMvc;

    private Professor professor;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Professor createEntity() {
        Professor professor = new Professor().firstName(DEFAULT_FIRST_NAME).lastName(DEFAULT_LAST_NAME);
        return professor;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Professor createUpdatedEntity() {
        Professor professor = new Professor().firstName(UPDATED_FIRST_NAME).lastName(UPDATED_LAST_NAME);
        return professor;
    }

    @BeforeEach
    public void initTest() {
        professorRepository.deleteAll();
        professor = createEntity();
    }

    @Test
    void createProfessor() throws Exception {
        int databaseSizeBeforeCreate = professorRepository.findAll().size();
        // Create the Professor
        restProfessorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(professor)))
            .andExpect(status().isCreated());

        // Validate the Professor in the database
        List<Professor> professorList = professorRepository.findAll();
        assertThat(professorList).hasSize(databaseSizeBeforeCreate + 1);
        Professor testProfessor = professorList.get(professorList.size() - 1);
        assertThat(testProfessor.getFirstName()).isEqualTo(DEFAULT_FIRST_NAME);
        assertThat(testProfessor.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
    }

    @Test
    void createProfessorWithExistingId() throws Exception {
        // Create the Professor with an existing ID
        professor.setId("existing_id");

        int databaseSizeBeforeCreate = professorRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restProfessorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(professor)))
            .andExpect(status().isBadRequest());

        // Validate the Professor in the database
        List<Professor> professorList = professorRepository.findAll();
        assertThat(professorList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    void checkFirstNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = professorRepository.findAll().size();
        // set the field null
        professor.setFirstName(null);

        // Create the Professor, which fails.

        restProfessorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(professor)))
            .andExpect(status().isBadRequest());

        List<Professor> professorList = professorRepository.findAll();
        assertThat(professorList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void checkLastNameIsRequired() throws Exception {
        int databaseSizeBeforeTest = professorRepository.findAll().size();
        // set the field null
        professor.setLastName(null);

        // Create the Professor, which fails.

        restProfessorMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(professor)))
            .andExpect(status().isBadRequest());

        List<Professor> professorList = professorRepository.findAll();
        assertThat(professorList).hasSize(databaseSizeBeforeTest);
    }

    @Test
    void getAllProfessors() throws Exception {
        // Initialize the database
        professorRepository.save(professor);

        // Get all the professorList
        restProfessorMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(professor.getId())))
            .andExpect(jsonPath("$.[*].firstName").value(hasItem(DEFAULT_FIRST_NAME)))
            .andExpect(jsonPath("$.[*].lastName").value(hasItem(DEFAULT_LAST_NAME)));
    }

    @Test
    void getProfessor() throws Exception {
        // Initialize the database
        professorRepository.save(professor);

        // Get the professor
        restProfessorMockMvc
            .perform(get(ENTITY_API_URL_ID, professor.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(professor.getId()))
            .andExpect(jsonPath("$.firstName").value(DEFAULT_FIRST_NAME))
            .andExpect(jsonPath("$.lastName").value(DEFAULT_LAST_NAME));
    }

    @Test
    void getNonExistingProfessor() throws Exception {
        // Get the professor
        restProfessorMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    void putNewProfessor() throws Exception {
        // Initialize the database
        professorRepository.save(professor);

        int databaseSizeBeforeUpdate = professorRepository.findAll().size();

        // Update the professor
        Professor updatedProfessor = professorRepository.findById(professor.getId()).get();
        updatedProfessor.firstName(UPDATED_FIRST_NAME).lastName(UPDATED_LAST_NAME);

        restProfessorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedProfessor.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedProfessor))
            )
            .andExpect(status().isOk());

        // Validate the Professor in the database
        List<Professor> professorList = professorRepository.findAll();
        assertThat(professorList).hasSize(databaseSizeBeforeUpdate);
        Professor testProfessor = professorList.get(professorList.size() - 1);
        assertThat(testProfessor.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testProfessor.getLastName()).isEqualTo(UPDATED_LAST_NAME);
    }

    @Test
    void putNonExistingProfessor() throws Exception {
        int databaseSizeBeforeUpdate = professorRepository.findAll().size();
        professor.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProfessorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, professor.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(professor))
            )
            .andExpect(status().isBadRequest());

        // Validate the Professor in the database
        List<Professor> professorList = professorRepository.findAll();
        assertThat(professorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithIdMismatchProfessor() throws Exception {
        int databaseSizeBeforeUpdate = professorRepository.findAll().size();
        professor.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProfessorMockMvc
            .perform(
                put(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(professor))
            )
            .andExpect(status().isBadRequest());

        // Validate the Professor in the database
        List<Professor> professorList = professorRepository.findAll();
        assertThat(professorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void putWithMissingIdPathParamProfessor() throws Exception {
        int databaseSizeBeforeUpdate = professorRepository.findAll().size();
        professor.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProfessorMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(professor)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Professor in the database
        List<Professor> professorList = professorRepository.findAll();
        assertThat(professorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void partialUpdateProfessorWithPatch() throws Exception {
        // Initialize the database
        professorRepository.save(professor);

        int databaseSizeBeforeUpdate = professorRepository.findAll().size();

        // Update the professor using partial update
        Professor partialUpdatedProfessor = new Professor();
        partialUpdatedProfessor.setId(professor.getId());

        partialUpdatedProfessor.firstName(UPDATED_FIRST_NAME);

        restProfessorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProfessor.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProfessor))
            )
            .andExpect(status().isOk());

        // Validate the Professor in the database
        List<Professor> professorList = professorRepository.findAll();
        assertThat(professorList).hasSize(databaseSizeBeforeUpdate);
        Professor testProfessor = professorList.get(professorList.size() - 1);
        assertThat(testProfessor.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testProfessor.getLastName()).isEqualTo(DEFAULT_LAST_NAME);
    }

    @Test
    void fullUpdateProfessorWithPatch() throws Exception {
        // Initialize the database
        professorRepository.save(professor);

        int databaseSizeBeforeUpdate = professorRepository.findAll().size();

        // Update the professor using partial update
        Professor partialUpdatedProfessor = new Professor();
        partialUpdatedProfessor.setId(professor.getId());

        partialUpdatedProfessor.firstName(UPDATED_FIRST_NAME).lastName(UPDATED_LAST_NAME);

        restProfessorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedProfessor.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedProfessor))
            )
            .andExpect(status().isOk());

        // Validate the Professor in the database
        List<Professor> professorList = professorRepository.findAll();
        assertThat(professorList).hasSize(databaseSizeBeforeUpdate);
        Professor testProfessor = professorList.get(professorList.size() - 1);
        assertThat(testProfessor.getFirstName()).isEqualTo(UPDATED_FIRST_NAME);
        assertThat(testProfessor.getLastName()).isEqualTo(UPDATED_LAST_NAME);
    }

    @Test
    void patchNonExistingProfessor() throws Exception {
        int databaseSizeBeforeUpdate = professorRepository.findAll().size();
        professor.setId(UUID.randomUUID().toString());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restProfessorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, professor.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(professor))
            )
            .andExpect(status().isBadRequest());

        // Validate the Professor in the database
        List<Professor> professorList = professorRepository.findAll();
        assertThat(professorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithIdMismatchProfessor() throws Exception {
        int databaseSizeBeforeUpdate = professorRepository.findAll().size();
        professor.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProfessorMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, UUID.randomUUID().toString())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(professor))
            )
            .andExpect(status().isBadRequest());

        // Validate the Professor in the database
        List<Professor> professorList = professorRepository.findAll();
        assertThat(professorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void patchWithMissingIdPathParamProfessor() throws Exception {
        int databaseSizeBeforeUpdate = professorRepository.findAll().size();
        professor.setId(UUID.randomUUID().toString());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restProfessorMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(professor))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Professor in the database
        List<Professor> professorList = professorRepository.findAll();
        assertThat(professorList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    void deleteProfessor() throws Exception {
        // Initialize the database
        professorRepository.save(professor);

        int databaseSizeBeforeDelete = professorRepository.findAll().size();

        // Delete the professor
        restProfessorMockMvc
            .perform(delete(ENTITY_API_URL_ID, professor.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Professor> professorList = professorRepository.findAll();
        assertThat(professorList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
