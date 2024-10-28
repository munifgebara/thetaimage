package br.com.munif.learn.phd.web.rest;

import static br.com.munif.learn.phd.domain.EtiquetaAsserts.*;
import static br.com.munif.learn.phd.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.com.munif.learn.phd.IntegrationTest;
import br.com.munif.learn.phd.domain.Etiqueta;
import br.com.munif.learn.phd.repository.EtiquetaRepository;
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
 * Integration tests for the {@link EtiquetaResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EtiquetaResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/etiquetas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private EtiquetaRepository etiquetaRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEtiquetaMockMvc;

    private Etiqueta etiqueta;

    private Etiqueta insertedEtiqueta;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Etiqueta createEntity() {
        return new Etiqueta().nome(DEFAULT_NOME);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Etiqueta createUpdatedEntity() {
        return new Etiqueta().nome(UPDATED_NOME);
    }

    @BeforeEach
    public void initTest() {
        etiqueta = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedEtiqueta != null) {
            etiquetaRepository.delete(insertedEtiqueta);
            insertedEtiqueta = null;
        }
    }

    @Test
    @Transactional
    void createEtiqueta() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Etiqueta
        var returnedEtiqueta = om.readValue(
            restEtiquetaMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(etiqueta)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Etiqueta.class
        );

        // Validate the Etiqueta in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertEtiquetaUpdatableFieldsEquals(returnedEtiqueta, getPersistedEtiqueta(returnedEtiqueta));

        insertedEtiqueta = returnedEtiqueta;
    }

    @Test
    @Transactional
    void createEtiquetaWithExistingId() throws Exception {
        // Create the Etiqueta with an existing ID
        etiqueta.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEtiquetaMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(etiqueta)))
            .andExpect(status().isBadRequest());

        // Validate the Etiqueta in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEtiquetas() throws Exception {
        // Initialize the database
        insertedEtiqueta = etiquetaRepository.saveAndFlush(etiqueta);

        // Get all the etiquetaList
        restEtiquetaMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(etiqueta.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)));
    }

    @Test
    @Transactional
    void getEtiqueta() throws Exception {
        // Initialize the database
        insertedEtiqueta = etiquetaRepository.saveAndFlush(etiqueta);

        // Get the etiqueta
        restEtiquetaMockMvc
            .perform(get(ENTITY_API_URL_ID, etiqueta.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(etiqueta.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME));
    }

    @Test
    @Transactional
    void getNonExistingEtiqueta() throws Exception {
        // Get the etiqueta
        restEtiquetaMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEtiqueta() throws Exception {
        // Initialize the database
        insertedEtiqueta = etiquetaRepository.saveAndFlush(etiqueta);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the etiqueta
        Etiqueta updatedEtiqueta = etiquetaRepository.findById(etiqueta.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedEtiqueta are not directly saved in db
        em.detach(updatedEtiqueta);
        updatedEtiqueta.nome(UPDATED_NOME);

        restEtiquetaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEtiqueta.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedEtiqueta))
            )
            .andExpect(status().isOk());

        // Validate the Etiqueta in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedEtiquetaToMatchAllProperties(updatedEtiqueta);
    }

    @Test
    @Transactional
    void putNonExistingEtiqueta() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        etiqueta.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEtiquetaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, etiqueta.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(etiqueta))
            )
            .andExpect(status().isBadRequest());

        // Validate the Etiqueta in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEtiqueta() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        etiqueta.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtiquetaMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(etiqueta))
            )
            .andExpect(status().isBadRequest());

        // Validate the Etiqueta in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEtiqueta() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        etiqueta.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtiquetaMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(etiqueta)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Etiqueta in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEtiquetaWithPatch() throws Exception {
        // Initialize the database
        insertedEtiqueta = etiquetaRepository.saveAndFlush(etiqueta);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the etiqueta using partial update
        Etiqueta partialUpdatedEtiqueta = new Etiqueta();
        partialUpdatedEtiqueta.setId(etiqueta.getId());

        partialUpdatedEtiqueta.nome(UPDATED_NOME);

        restEtiquetaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEtiqueta.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedEtiqueta))
            )
            .andExpect(status().isOk());

        // Validate the Etiqueta in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEtiquetaUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedEtiqueta, etiqueta), getPersistedEtiqueta(etiqueta));
    }

    @Test
    @Transactional
    void fullUpdateEtiquetaWithPatch() throws Exception {
        // Initialize the database
        insertedEtiqueta = etiquetaRepository.saveAndFlush(etiqueta);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the etiqueta using partial update
        Etiqueta partialUpdatedEtiqueta = new Etiqueta();
        partialUpdatedEtiqueta.setId(etiqueta.getId());

        partialUpdatedEtiqueta.nome(UPDATED_NOME);

        restEtiquetaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEtiqueta.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedEtiqueta))
            )
            .andExpect(status().isOk());

        // Validate the Etiqueta in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEtiquetaUpdatableFieldsEquals(partialUpdatedEtiqueta, getPersistedEtiqueta(partialUpdatedEtiqueta));
    }

    @Test
    @Transactional
    void patchNonExistingEtiqueta() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        etiqueta.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEtiquetaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, etiqueta.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(etiqueta))
            )
            .andExpect(status().isBadRequest());

        // Validate the Etiqueta in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEtiqueta() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        etiqueta.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtiquetaMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(etiqueta))
            )
            .andExpect(status().isBadRequest());

        // Validate the Etiqueta in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEtiqueta() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        etiqueta.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtiquetaMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(etiqueta)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Etiqueta in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEtiqueta() throws Exception {
        // Initialize the database
        insertedEtiqueta = etiquetaRepository.saveAndFlush(etiqueta);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the etiqueta
        restEtiquetaMockMvc
            .perform(delete(ENTITY_API_URL_ID, etiqueta.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return etiquetaRepository.count();
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

    protected Etiqueta getPersistedEtiqueta(Etiqueta etiqueta) {
        return etiquetaRepository.findById(etiqueta.getId()).orElseThrow();
    }

    protected void assertPersistedEtiquetaToMatchAllProperties(Etiqueta expectedEtiqueta) {
        assertEtiquetaAllPropertiesEquals(expectedEtiqueta, getPersistedEtiqueta(expectedEtiqueta));
    }

    protected void assertPersistedEtiquetaToMatchUpdatableProperties(Etiqueta expectedEtiqueta) {
        assertEtiquetaAllUpdatablePropertiesEquals(expectedEtiqueta, getPersistedEtiqueta(expectedEtiqueta));
    }
}
