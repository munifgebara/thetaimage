package br.com.munif.learn.phd.web.rest;

import static br.com.munif.learn.phd.domain.EtiquetagemAsserts.*;
import static br.com.munif.learn.phd.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.com.munif.learn.phd.IntegrationTest;
import br.com.munif.learn.phd.domain.Etiquetagem;
import br.com.munif.learn.phd.repository.EtiquetagemRepository;
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
 * Integration tests for the {@link EtiquetagemResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EtiquetagemResourceIT {

    private static final Double DEFAULT_X = 1D;
    private static final Double UPDATED_X = 2D;

    private static final Double DEFAULT_Y = 1D;
    private static final Double UPDATED_Y = 2D;

    private static final Double DEFAULT_LARGURA = 1D;
    private static final Double UPDATED_LARGURA = 2D;

    private static final Double DEFAULT_ALTURA = 1D;
    private static final Double UPDATED_ALTURA = 2D;

    private static final String ENTITY_API_URL = "/api/etiquetagems";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private EtiquetagemRepository etiquetagemRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEtiquetagemMockMvc;

    private Etiquetagem etiquetagem;

    private Etiquetagem insertedEtiquetagem;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Etiquetagem createEntity() {
        return new Etiquetagem().x(DEFAULT_X).y(DEFAULT_Y).largura(DEFAULT_LARGURA).altura(DEFAULT_ALTURA);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Etiquetagem createUpdatedEntity() {
        return new Etiquetagem().x(UPDATED_X).y(UPDATED_Y).largura(UPDATED_LARGURA).altura(UPDATED_ALTURA);
    }

    @BeforeEach
    public void initTest() {
        etiquetagem = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedEtiquetagem != null) {
            etiquetagemRepository.delete(insertedEtiquetagem);
            insertedEtiquetagem = null;
        }
    }

    @Test
    @Transactional
    void createEtiquetagem() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Etiquetagem
        var returnedEtiquetagem = om.readValue(
            restEtiquetagemMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(etiquetagem)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Etiquetagem.class
        );

        // Validate the Etiquetagem in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertEtiquetagemUpdatableFieldsEquals(returnedEtiquetagem, getPersistedEtiquetagem(returnedEtiquetagem));

        insertedEtiquetagem = returnedEtiquetagem;
    }

    @Test
    @Transactional
    void createEtiquetagemWithExistingId() throws Exception {
        // Create the Etiquetagem with an existing ID
        etiquetagem.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEtiquetagemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(etiquetagem)))
            .andExpect(status().isBadRequest());

        // Validate the Etiquetagem in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEtiquetagems() throws Exception {
        // Initialize the database
        insertedEtiquetagem = etiquetagemRepository.saveAndFlush(etiquetagem);

        // Get all the etiquetagemList
        restEtiquetagemMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(etiquetagem.getId().intValue())))
            .andExpect(jsonPath("$.[*].x").value(hasItem(DEFAULT_X.doubleValue())))
            .andExpect(jsonPath("$.[*].y").value(hasItem(DEFAULT_Y.doubleValue())))
            .andExpect(jsonPath("$.[*].largura").value(hasItem(DEFAULT_LARGURA.doubleValue())))
            .andExpect(jsonPath("$.[*].altura").value(hasItem(DEFAULT_ALTURA.doubleValue())));
    }

    @Test
    @Transactional
    void getEtiquetagem() throws Exception {
        // Initialize the database
        insertedEtiquetagem = etiquetagemRepository.saveAndFlush(etiquetagem);

        // Get the etiquetagem
        restEtiquetagemMockMvc
            .perform(get(ENTITY_API_URL_ID, etiquetagem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(etiquetagem.getId().intValue()))
            .andExpect(jsonPath("$.x").value(DEFAULT_X.doubleValue()))
            .andExpect(jsonPath("$.y").value(DEFAULT_Y.doubleValue()))
            .andExpect(jsonPath("$.largura").value(DEFAULT_LARGURA.doubleValue()))
            .andExpect(jsonPath("$.altura").value(DEFAULT_ALTURA.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingEtiquetagem() throws Exception {
        // Get the etiquetagem
        restEtiquetagemMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingEtiquetagem() throws Exception {
        // Initialize the database
        insertedEtiquetagem = etiquetagemRepository.saveAndFlush(etiquetagem);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the etiquetagem
        Etiquetagem updatedEtiquetagem = etiquetagemRepository.findById(etiquetagem.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedEtiquetagem are not directly saved in db
        em.detach(updatedEtiquetagem);
        updatedEtiquetagem.x(UPDATED_X).y(UPDATED_Y).largura(UPDATED_LARGURA).altura(UPDATED_ALTURA);

        restEtiquetagemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEtiquetagem.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedEtiquetagem))
            )
            .andExpect(status().isOk());

        // Validate the Etiquetagem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedEtiquetagemToMatchAllProperties(updatedEtiquetagem);
    }

    @Test
    @Transactional
    void putNonExistingEtiquetagem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        etiquetagem.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEtiquetagemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, etiquetagem.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(etiquetagem))
            )
            .andExpect(status().isBadRequest());

        // Validate the Etiquetagem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEtiquetagem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        etiquetagem.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtiquetagemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(etiquetagem))
            )
            .andExpect(status().isBadRequest());

        // Validate the Etiquetagem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEtiquetagem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        etiquetagem.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtiquetagemMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(etiquetagem)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Etiquetagem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEtiquetagemWithPatch() throws Exception {
        // Initialize the database
        insertedEtiquetagem = etiquetagemRepository.saveAndFlush(etiquetagem);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the etiquetagem using partial update
        Etiquetagem partialUpdatedEtiquetagem = new Etiquetagem();
        partialUpdatedEtiquetagem.setId(etiquetagem.getId());

        partialUpdatedEtiquetagem.x(UPDATED_X).altura(UPDATED_ALTURA);

        restEtiquetagemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEtiquetagem.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedEtiquetagem))
            )
            .andExpect(status().isOk());

        // Validate the Etiquetagem in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEtiquetagemUpdatableFieldsEquals(
            createUpdateProxyForBean(partialUpdatedEtiquetagem, etiquetagem),
            getPersistedEtiquetagem(etiquetagem)
        );
    }

    @Test
    @Transactional
    void fullUpdateEtiquetagemWithPatch() throws Exception {
        // Initialize the database
        insertedEtiquetagem = etiquetagemRepository.saveAndFlush(etiquetagem);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the etiquetagem using partial update
        Etiquetagem partialUpdatedEtiquetagem = new Etiquetagem();
        partialUpdatedEtiquetagem.setId(etiquetagem.getId());

        partialUpdatedEtiquetagem.x(UPDATED_X).y(UPDATED_Y).largura(UPDATED_LARGURA).altura(UPDATED_ALTURA);

        restEtiquetagemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEtiquetagem.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedEtiquetagem))
            )
            .andExpect(status().isOk());

        // Validate the Etiquetagem in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertEtiquetagemUpdatableFieldsEquals(partialUpdatedEtiquetagem, getPersistedEtiquetagem(partialUpdatedEtiquetagem));
    }

    @Test
    @Transactional
    void patchNonExistingEtiquetagem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        etiquetagem.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEtiquetagemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, etiquetagem.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(etiquetagem))
            )
            .andExpect(status().isBadRequest());

        // Validate the Etiquetagem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEtiquetagem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        etiquetagem.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtiquetagemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(etiquetagem))
            )
            .andExpect(status().isBadRequest());

        // Validate the Etiquetagem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEtiquetagem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        etiquetagem.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEtiquetagemMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(etiquetagem)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Etiquetagem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEtiquetagem() throws Exception {
        // Initialize the database
        insertedEtiquetagem = etiquetagemRepository.saveAndFlush(etiquetagem);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the etiquetagem
        restEtiquetagemMockMvc
            .perform(delete(ENTITY_API_URL_ID, etiquetagem.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return etiquetagemRepository.count();
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

    protected Etiquetagem getPersistedEtiquetagem(Etiquetagem etiquetagem) {
        return etiquetagemRepository.findById(etiquetagem.getId()).orElseThrow();
    }

    protected void assertPersistedEtiquetagemToMatchAllProperties(Etiquetagem expectedEtiquetagem) {
        assertEtiquetagemAllPropertiesEquals(expectedEtiquetagem, getPersistedEtiquetagem(expectedEtiquetagem));
    }

    protected void assertPersistedEtiquetagemToMatchUpdatableProperties(Etiquetagem expectedEtiquetagem) {
        assertEtiquetagemAllUpdatablePropertiesEquals(expectedEtiquetagem, getPersistedEtiquetagem(expectedEtiquetagem));
    }
}
