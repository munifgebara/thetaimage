package br.com.munif.learn.phd.web.rest;

import static br.com.munif.learn.phd.domain.ConjuntoAsserts.*;
import static br.com.munif.learn.phd.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.com.munif.learn.phd.IntegrationTest;
import br.com.munif.learn.phd.domain.Conjunto;
import br.com.munif.learn.phd.repository.ConjuntoRepository;
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
 * Integration tests for the {@link ConjuntoResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ConjuntoResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/conjuntos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ConjuntoRepository conjuntoRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restConjuntoMockMvc;

    private Conjunto conjunto;

    private Conjunto insertedConjunto;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Conjunto createEntity() {
        return new Conjunto().nome(DEFAULT_NOME);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Conjunto createUpdatedEntity() {
        return new Conjunto().nome(UPDATED_NOME);
    }

    @BeforeEach
    public void initTest() {
        conjunto = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedConjunto != null) {
            conjuntoRepository.delete(insertedConjunto);
            insertedConjunto = null;
        }
    }

    @Test
    @Transactional
    void createConjunto() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Conjunto
        var returnedConjunto = om.readValue(
            restConjuntoMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(conjunto)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Conjunto.class
        );

        // Validate the Conjunto in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertConjuntoUpdatableFieldsEquals(returnedConjunto, getPersistedConjunto(returnedConjunto));

        insertedConjunto = returnedConjunto;
    }

    @Test
    @Transactional
    void createConjuntoWithExistingId() throws Exception {
        // Create the Conjunto with an existing ID
        conjunto.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restConjuntoMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(conjunto)))
            .andExpect(status().isBadRequest());

        // Validate the Conjunto in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllConjuntos() throws Exception {
        // Initialize the database
        insertedConjunto = conjuntoRepository.saveAndFlush(conjunto);

        // Get all the conjuntoList
        restConjuntoMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(conjunto.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)));
    }

    @Test
    @Transactional
    void getConjunto() throws Exception {
        // Initialize the database
        insertedConjunto = conjuntoRepository.saveAndFlush(conjunto);

        // Get the conjunto
        restConjuntoMockMvc
            .perform(get(ENTITY_API_URL_ID, conjunto.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(conjunto.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME));
    }

    @Test
    @Transactional
    void getNonExistingConjunto() throws Exception {
        // Get the conjunto
        restConjuntoMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingConjunto() throws Exception {
        // Initialize the database
        insertedConjunto = conjuntoRepository.saveAndFlush(conjunto);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the conjunto
        Conjunto updatedConjunto = conjuntoRepository.findById(conjunto.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedConjunto are not directly saved in db
        em.detach(updatedConjunto);
        updatedConjunto.nome(UPDATED_NOME);

        restConjuntoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedConjunto.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedConjunto))
            )
            .andExpect(status().isOk());

        // Validate the Conjunto in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedConjuntoToMatchAllProperties(updatedConjunto);
    }

    @Test
    @Transactional
    void putNonExistingConjunto() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        conjunto.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConjuntoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, conjunto.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(conjunto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Conjunto in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchConjunto() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        conjunto.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConjuntoMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(conjunto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Conjunto in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamConjunto() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        conjunto.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConjuntoMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(conjunto)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Conjunto in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateConjuntoWithPatch() throws Exception {
        // Initialize the database
        insertedConjunto = conjuntoRepository.saveAndFlush(conjunto);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the conjunto using partial update
        Conjunto partialUpdatedConjunto = new Conjunto();
        partialUpdatedConjunto.setId(conjunto.getId());

        partialUpdatedConjunto.nome(UPDATED_NOME);

        restConjuntoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConjunto.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedConjunto))
            )
            .andExpect(status().isOk());

        // Validate the Conjunto in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertConjuntoUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedConjunto, conjunto), getPersistedConjunto(conjunto));
    }

    @Test
    @Transactional
    void fullUpdateConjuntoWithPatch() throws Exception {
        // Initialize the database
        insertedConjunto = conjuntoRepository.saveAndFlush(conjunto);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the conjunto using partial update
        Conjunto partialUpdatedConjunto = new Conjunto();
        partialUpdatedConjunto.setId(conjunto.getId());

        partialUpdatedConjunto.nome(UPDATED_NOME);

        restConjuntoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedConjunto.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedConjunto))
            )
            .andExpect(status().isOk());

        // Validate the Conjunto in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertConjuntoUpdatableFieldsEquals(partialUpdatedConjunto, getPersistedConjunto(partialUpdatedConjunto));
    }

    @Test
    @Transactional
    void patchNonExistingConjunto() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        conjunto.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restConjuntoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, conjunto.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(conjunto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Conjunto in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchConjunto() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        conjunto.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConjuntoMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(conjunto))
            )
            .andExpect(status().isBadRequest());

        // Validate the Conjunto in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamConjunto() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        conjunto.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restConjuntoMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(conjunto)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Conjunto in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteConjunto() throws Exception {
        // Initialize the database
        insertedConjunto = conjuntoRepository.saveAndFlush(conjunto);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the conjunto
        restConjuntoMockMvc
            .perform(delete(ENTITY_API_URL_ID, conjunto.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return conjuntoRepository.count();
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

    protected Conjunto getPersistedConjunto(Conjunto conjunto) {
        return conjuntoRepository.findById(conjunto.getId()).orElseThrow();
    }

    protected void assertPersistedConjuntoToMatchAllProperties(Conjunto expectedConjunto) {
        assertConjuntoAllPropertiesEquals(expectedConjunto, getPersistedConjunto(expectedConjunto));
    }

    protected void assertPersistedConjuntoToMatchUpdatableProperties(Conjunto expectedConjunto) {
        assertConjuntoAllUpdatablePropertiesEquals(expectedConjunto, getPersistedConjunto(expectedConjunto));
    }
}
