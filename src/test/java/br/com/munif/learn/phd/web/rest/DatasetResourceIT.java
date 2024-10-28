package br.com.munif.learn.phd.web.rest;

import static br.com.munif.learn.phd.domain.DatasetAsserts.*;
import static br.com.munif.learn.phd.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.com.munif.learn.phd.IntegrationTest;
import br.com.munif.learn.phd.domain.Dataset;
import br.com.munif.learn.phd.repository.DatasetRepository;
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
 * Integration tests for the {@link DatasetResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class DatasetResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRICAO = "AAAAAAAAAA";
    private static final String UPDATED_DESCRICAO = "BBBBBBBBBB";

    private static final Double DEFAULT_DIFERENCA_MINIMA = 1D;
    private static final Double UPDATED_DIFERENCA_MINIMA = 2D;

    private static final String ENTITY_API_URL = "/api/datasets";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private DatasetRepository datasetRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restDatasetMockMvc;

    private Dataset dataset;

    private Dataset insertedDataset;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Dataset createEntity() {
        return new Dataset().nome(DEFAULT_NOME).descricao(DEFAULT_DESCRICAO).diferencaMinima(DEFAULT_DIFERENCA_MINIMA);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Dataset createUpdatedEntity() {
        return new Dataset().nome(UPDATED_NOME).descricao(UPDATED_DESCRICAO).diferencaMinima(UPDATED_DIFERENCA_MINIMA);
    }

    @BeforeEach
    public void initTest() {
        dataset = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedDataset != null) {
            datasetRepository.delete(insertedDataset);
            insertedDataset = null;
        }
    }

    @Test
    @Transactional
    void createDataset() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Dataset
        var returnedDataset = om.readValue(
            restDatasetMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(dataset)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Dataset.class
        );

        // Validate the Dataset in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertDatasetUpdatableFieldsEquals(returnedDataset, getPersistedDataset(returnedDataset));

        insertedDataset = returnedDataset;
    }

    @Test
    @Transactional
    void createDatasetWithExistingId() throws Exception {
        // Create the Dataset with an existing ID
        dataset.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restDatasetMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(dataset)))
            .andExpect(status().isBadRequest());

        // Validate the Dataset in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllDatasets() throws Exception {
        // Initialize the database
        insertedDataset = datasetRepository.saveAndFlush(dataset);

        // Get all the datasetList
        restDatasetMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(dataset.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].descricao").value(hasItem(DEFAULT_DESCRICAO.toString())))
            .andExpect(jsonPath("$.[*].diferencaMinima").value(hasItem(DEFAULT_DIFERENCA_MINIMA.doubleValue())));
    }

    @Test
    @Transactional
    void getDataset() throws Exception {
        // Initialize the database
        insertedDataset = datasetRepository.saveAndFlush(dataset);

        // Get the dataset
        restDatasetMockMvc
            .perform(get(ENTITY_API_URL_ID, dataset.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(dataset.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.descricao").value(DEFAULT_DESCRICAO.toString()))
            .andExpect(jsonPath("$.diferencaMinima").value(DEFAULT_DIFERENCA_MINIMA.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingDataset() throws Exception {
        // Get the dataset
        restDatasetMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingDataset() throws Exception {
        // Initialize the database
        insertedDataset = datasetRepository.saveAndFlush(dataset);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the dataset
        Dataset updatedDataset = datasetRepository.findById(dataset.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedDataset are not directly saved in db
        em.detach(updatedDataset);
        updatedDataset.nome(UPDATED_NOME).descricao(UPDATED_DESCRICAO).diferencaMinima(UPDATED_DIFERENCA_MINIMA);

        restDatasetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedDataset.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedDataset))
            )
            .andExpect(status().isOk());

        // Validate the Dataset in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedDatasetToMatchAllProperties(updatedDataset);
    }

    @Test
    @Transactional
    void putNonExistingDataset() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        dataset.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDatasetMockMvc
            .perform(put(ENTITY_API_URL_ID, dataset.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(dataset)))
            .andExpect(status().isBadRequest());

        // Validate the Dataset in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchDataset() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        dataset.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDatasetMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(dataset))
            )
            .andExpect(status().isBadRequest());

        // Validate the Dataset in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamDataset() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        dataset.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDatasetMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(dataset)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Dataset in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateDatasetWithPatch() throws Exception {
        // Initialize the database
        insertedDataset = datasetRepository.saveAndFlush(dataset);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the dataset using partial update
        Dataset partialUpdatedDataset = new Dataset();
        partialUpdatedDataset.setId(dataset.getId());

        partialUpdatedDataset.diferencaMinima(UPDATED_DIFERENCA_MINIMA);

        restDatasetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDataset.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDataset))
            )
            .andExpect(status().isOk());

        // Validate the Dataset in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDatasetUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedDataset, dataset), getPersistedDataset(dataset));
    }

    @Test
    @Transactional
    void fullUpdateDatasetWithPatch() throws Exception {
        // Initialize the database
        insertedDataset = datasetRepository.saveAndFlush(dataset);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the dataset using partial update
        Dataset partialUpdatedDataset = new Dataset();
        partialUpdatedDataset.setId(dataset.getId());

        partialUpdatedDataset.nome(UPDATED_NOME).descricao(UPDATED_DESCRICAO).diferencaMinima(UPDATED_DIFERENCA_MINIMA);

        restDatasetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedDataset.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedDataset))
            )
            .andExpect(status().isOk());

        // Validate the Dataset in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertDatasetUpdatableFieldsEquals(partialUpdatedDataset, getPersistedDataset(partialUpdatedDataset));
    }

    @Test
    @Transactional
    void patchNonExistingDataset() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        dataset.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restDatasetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, dataset.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(dataset))
            )
            .andExpect(status().isBadRequest());

        // Validate the Dataset in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchDataset() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        dataset.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDatasetMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(dataset))
            )
            .andExpect(status().isBadRequest());

        // Validate the Dataset in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamDataset() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        dataset.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restDatasetMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(dataset)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Dataset in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteDataset() throws Exception {
        // Initialize the database
        insertedDataset = datasetRepository.saveAndFlush(dataset);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the dataset
        restDatasetMockMvc
            .perform(delete(ENTITY_API_URL_ID, dataset.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return datasetRepository.count();
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

    protected Dataset getPersistedDataset(Dataset dataset) {
        return datasetRepository.findById(dataset.getId()).orElseThrow();
    }

    protected void assertPersistedDatasetToMatchAllProperties(Dataset expectedDataset) {
        assertDatasetAllPropertiesEquals(expectedDataset, getPersistedDataset(expectedDataset));
    }

    protected void assertPersistedDatasetToMatchUpdatableProperties(Dataset expectedDataset) {
        assertDatasetAllUpdatablePropertiesEquals(expectedDataset, getPersistedDataset(expectedDataset));
    }
}
