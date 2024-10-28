package br.com.munif.learn.phd.web.rest;

import static br.com.munif.learn.phd.domain.ClasseAsserts.*;
import static br.com.munif.learn.phd.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.com.munif.learn.phd.IntegrationTest;
import br.com.munif.learn.phd.domain.Classe;
import br.com.munif.learn.phd.repository.ClasseRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ClasseResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ClasseResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/classes";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ClasseRepository classeRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restClasseMockMvc;

    private Classe classe;

    private Classe insertedClasse;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Classe createEntity() {
        return new Classe().nome(DEFAULT_NOME);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Classe createUpdatedEntity() {
        return new Classe().nome(UPDATED_NOME);
    }

    @BeforeEach
    public void initTest() {
        classe = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedClasse != null) {
            classeRepository.delete(insertedClasse);
            insertedClasse = null;
        }
    }

    @Test
    @Transactional
    void createClasse() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Classe
        var returnedClasse = om.readValue(
            restClasseMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(classe)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Classe.class
        );

        // Validate the Classe in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertClasseUpdatableFieldsEquals(returnedClasse, getPersistedClasse(returnedClasse));

        insertedClasse = returnedClasse;
    }

    @Test
    @Transactional
    void createClasseWithExistingId() throws Exception {
        // Create the Classe with an existing ID
        classe.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restClasseMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(classe)))
            .andExpect(status().isBadRequest());

        // Validate the Classe in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllClasses() throws Exception {
        // Initialize the database
        insertedClasse = classeRepository.saveAndFlush(classe);

        // Get all the classeList
        restClasseMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(classe.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)));
    }

    @Test
    @Transactional
    void getClasse() throws Exception {
        // Initialize the database
        insertedClasse = classeRepository.saveAndFlush(classe);

        // Get the classe
        restClasseMockMvc
            .perform(get(ENTITY_API_URL_ID, classe.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(classe.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME));
    }

    @Test
    @Transactional
    void getNonExistingClasse() throws Exception {
        // Get the classe
        restClasseMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingClasse() throws Exception {
        // Initialize the database
        insertedClasse = classeRepository.saveAndFlush(classe);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the classe
        Classe updatedClasse = classeRepository.findById(classe.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedClasse are not directly saved in db
        em.detach(updatedClasse);
        updatedClasse.nome(UPDATED_NOME);

        restClasseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedClasse.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedClasse))
            )
            .andExpect(status().isOk());

        // Validate the Classe in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedClasseToMatchAllProperties(updatedClasse);
    }

    @Test
    @Transactional
    void putNonExistingClasse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        classe.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClasseMockMvc
            .perform(put(ENTITY_API_URL_ID, classe.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(classe)))
            .andExpect(status().isBadRequest());

        // Validate the Classe in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchClasse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        classe.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClasseMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(classe))
            )
            .andExpect(status().isBadRequest());

        // Validate the Classe in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamClasse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        classe.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClasseMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(classe)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Classe in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateClasseWithPatch() throws Exception {
        // Initialize the database
        insertedClasse = classeRepository.saveAndFlush(classe);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the classe using partial update
        Classe partialUpdatedClasse = new Classe();
        partialUpdatedClasse.setId(classe.getId());

        partialUpdatedClasse.nome(UPDATED_NOME);

        restClasseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClasse.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedClasse))
            )
            .andExpect(status().isOk());

        // Validate the Classe in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertClasseUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedClasse, classe), getPersistedClasse(classe));
    }

    @Test
    @Transactional
    void fullUpdateClasseWithPatch() throws Exception {
        // Initialize the database
        insertedClasse = classeRepository.saveAndFlush(classe);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the classe using partial update
        Classe partialUpdatedClasse = new Classe();
        partialUpdatedClasse.setId(classe.getId());

        partialUpdatedClasse.nome(UPDATED_NOME);

        restClasseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedClasse.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedClasse))
            )
            .andExpect(status().isOk());

        // Validate the Classe in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertClasseUpdatableFieldsEquals(partialUpdatedClasse, getPersistedClasse(partialUpdatedClasse));
    }

    @Test
    @Transactional
    void patchNonExistingClasse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        classe.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restClasseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, classe.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(classe))
            )
            .andExpect(status().isBadRequest());

        // Validate the Classe in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchClasse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        classe.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClasseMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(classe))
            )
            .andExpect(status().isBadRequest());

        // Validate the Classe in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamClasse() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        classe.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restClasseMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(classe)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Classe in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteClasse() throws Exception {
        // Initialize the database
        insertedClasse = classeRepository.saveAndFlush(classe);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the classe
        restClasseMockMvc
            .perform(delete(ENTITY_API_URL_ID, classe.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return classeRepository.count();
    }

    protected void assertIncrementedRepositoryCount(long countBefore) {
        assertThat(countBefore + 1).isEqualTo(getRepositoryCount());
    }

    protected void assertDecrementedRepositoryCount(long countBefore) {
        assertThat(countBefore - 1).isEqualTo(getRepositoryCount());
    }

    protected void assertSameRepositoryCount(long countBefore) {
        assertThat(countBefore).isEqualTo(getRepositoryCount());
    }

    protected Classe getPersistedClasse(Classe classe) {
        return classeRepository.findById(classe.getId()).orElseThrow();
    }

    protected void assertPersistedClasseToMatchAllProperties(Classe expectedClasse) {
        assertClasseAllPropertiesEquals(expectedClasse, getPersistedClasse(expectedClasse));
    }

    protected void assertPersistedClasseToMatchUpdatableProperties(Classe expectedClasse) {
        assertClasseAllUpdatablePropertiesEquals(expectedClasse, getPersistedClasse(expectedClasse));
    }
}
