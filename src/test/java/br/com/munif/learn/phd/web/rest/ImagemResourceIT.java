package br.com.munif.learn.phd.web.rest;

import static br.com.munif.learn.phd.domain.ImagemAsserts.*;
import static br.com.munif.learn.phd.web.rest.TestUtil.createUpdateProxyForBean;
import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import br.com.munif.learn.phd.IntegrationTest;
import br.com.munif.learn.phd.domain.Imagem;
import br.com.munif.learn.phd.repository.ImagemRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.persistence.EntityManager;
import java.util.Base64;
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
 * Integration tests for the {@link ImagemResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ImagemResourceIT {

    private static final String DEFAULT_NOME = "AAAAAAAAAA";
    private static final String UPDATED_NOME = "BBBBBBBBBB";

    private static final String DEFAULT_CAMINHO = "AAAAAAAAAA";
    private static final String UPDATED_CAMINHO = "BBBBBBBBBB";

    private static final String DEFAULT_MIME_TYPE = "AAAAAAAAAA";
    private static final String UPDATED_MIME_TYPE = "BBBBBBBBBB";

    private static final Integer DEFAULT_LARGURA = 1;
    private static final Integer UPDATED_LARGURA = 2;

    private static final Integer DEFAULT_ALTURA = 1;
    private static final Integer UPDATED_ALTURA = 2;

    private static final byte[] DEFAULT_DADOS = TestUtil.createByteArray(1, "0");
    private static final byte[] UPDATED_DADOS = TestUtil.createByteArray(1, "1");
    private static final String DEFAULT_DADOS_CONTENT_TYPE = "image/jpg";
    private static final String UPDATED_DADOS_CONTENT_TYPE = "image/png";

    private static final String ENTITY_API_URL = "/api/imagems";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ObjectMapper om;

    @Autowired
    private ImagemRepository imagemRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restImagemMockMvc;

    private Imagem imagem;

    private Imagem insertedImagem;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Imagem createEntity() {
        return new Imagem()
            .nome(DEFAULT_NOME)
            .caminho(DEFAULT_CAMINHO)
            .mimeType(DEFAULT_MIME_TYPE)
            .largura(DEFAULT_LARGURA)
            .altura(DEFAULT_ALTURA)
            .dados(DEFAULT_DADOS)
            .dadosContentType(DEFAULT_DADOS_CONTENT_TYPE);
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Imagem createUpdatedEntity() {
        return new Imagem()
            .nome(UPDATED_NOME)
            .caminho(UPDATED_CAMINHO)
            .mimeType(UPDATED_MIME_TYPE)
            .largura(UPDATED_LARGURA)
            .altura(UPDATED_ALTURA)
            .dados(UPDATED_DADOS)
            .dadosContentType(UPDATED_DADOS_CONTENT_TYPE);
    }

    @BeforeEach
    public void initTest() {
        imagem = createEntity();
    }

    @AfterEach
    public void cleanup() {
        if (insertedImagem != null) {
            imagemRepository.delete(insertedImagem);
            insertedImagem = null;
        }
    }

    @Test
    @Transactional
    void createImagem() throws Exception {
        long databaseSizeBeforeCreate = getRepositoryCount();
        // Create the Imagem
        var returnedImagem = om.readValue(
            restImagemMockMvc
                .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(imagem)))
                .andExpect(status().isCreated())
                .andReturn()
                .getResponse()
                .getContentAsString(),
            Imagem.class
        );

        // Validate the Imagem in the database
        assertIncrementedRepositoryCount(databaseSizeBeforeCreate);
        assertImagemUpdatableFieldsEquals(returnedImagem, getPersistedImagem(returnedImagem));

        insertedImagem = returnedImagem;
    }

    @Test
    @Transactional
    void createImagemWithExistingId() throws Exception {
        // Create the Imagem with an existing ID
        imagem.setId(1L);

        long databaseSizeBeforeCreate = getRepositoryCount();

        // An entity with an existing ID cannot be created, so this API call must fail
        restImagemMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(imagem)))
            .andExpect(status().isBadRequest());

        // Validate the Imagem in the database
        assertSameRepositoryCount(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllImagems() throws Exception {
        // Initialize the database
        insertedImagem = imagemRepository.saveAndFlush(imagem);

        // Get all the imagemList
        restImagemMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(imagem.getId().intValue())))
            .andExpect(jsonPath("$.[*].nome").value(hasItem(DEFAULT_NOME)))
            .andExpect(jsonPath("$.[*].caminho").value(hasItem(DEFAULT_CAMINHO)))
            .andExpect(jsonPath("$.[*].mimeType").value(hasItem(DEFAULT_MIME_TYPE)))
            .andExpect(jsonPath("$.[*].largura").value(hasItem(DEFAULT_LARGURA)))
            .andExpect(jsonPath("$.[*].altura").value(hasItem(DEFAULT_ALTURA)))
            .andExpect(jsonPath("$.[*].dadosContentType").value(hasItem(DEFAULT_DADOS_CONTENT_TYPE)))
            .andExpect(jsonPath("$.[*].dados").value(hasItem(Base64.getEncoder().encodeToString(DEFAULT_DADOS))));
    }

    @Test
    @Transactional
    void getImagem() throws Exception {
        // Initialize the database
        insertedImagem = imagemRepository.saveAndFlush(imagem);

        // Get the imagem
        restImagemMockMvc
            .perform(get(ENTITY_API_URL_ID, imagem.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(imagem.getId().intValue()))
            .andExpect(jsonPath("$.nome").value(DEFAULT_NOME))
            .andExpect(jsonPath("$.caminho").value(DEFAULT_CAMINHO))
            .andExpect(jsonPath("$.mimeType").value(DEFAULT_MIME_TYPE))
            .andExpect(jsonPath("$.largura").value(DEFAULT_LARGURA))
            .andExpect(jsonPath("$.altura").value(DEFAULT_ALTURA))
            .andExpect(jsonPath("$.dadosContentType").value(DEFAULT_DADOS_CONTENT_TYPE))
            .andExpect(jsonPath("$.dados").value(Base64.getEncoder().encodeToString(DEFAULT_DADOS)));
    }

    @Test
    @Transactional
    void getNonExistingImagem() throws Exception {
        // Get the imagem
        restImagemMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putExistingImagem() throws Exception {
        // Initialize the database
        insertedImagem = imagemRepository.saveAndFlush(imagem);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the imagem
        Imagem updatedImagem = imagemRepository.findById(imagem.getId()).orElseThrow();
        // Disconnect from session so that the updates on updatedImagem are not directly saved in db
        em.detach(updatedImagem);
        updatedImagem
            .nome(UPDATED_NOME)
            .caminho(UPDATED_CAMINHO)
            .mimeType(UPDATED_MIME_TYPE)
            .largura(UPDATED_LARGURA)
            .altura(UPDATED_ALTURA)
            .dados(UPDATED_DADOS)
            .dadosContentType(UPDATED_DADOS_CONTENT_TYPE);

        restImagemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedImagem.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(updatedImagem))
            )
            .andExpect(status().isOk());

        // Validate the Imagem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertPersistedImagemToMatchAllProperties(updatedImagem);
    }

    @Test
    @Transactional
    void putNonExistingImagem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        imagem.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restImagemMockMvc
            .perform(put(ENTITY_API_URL_ID, imagem.getId()).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(imagem)))
            .andExpect(status().isBadRequest());

        // Validate the Imagem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchImagem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        imagem.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restImagemMockMvc
            .perform(
                put(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(om.writeValueAsBytes(imagem))
            )
            .andExpect(status().isBadRequest());

        // Validate the Imagem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamImagem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        imagem.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restImagemMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(om.writeValueAsBytes(imagem)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Imagem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateImagemWithPatch() throws Exception {
        // Initialize the database
        insertedImagem = imagemRepository.saveAndFlush(imagem);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the imagem using partial update
        Imagem partialUpdatedImagem = new Imagem();
        partialUpdatedImagem.setId(imagem.getId());

        partialUpdatedImagem.mimeType(UPDATED_MIME_TYPE).dados(UPDATED_DADOS).dadosContentType(UPDATED_DADOS_CONTENT_TYPE);

        restImagemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedImagem.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedImagem))
            )
            .andExpect(status().isOk());

        // Validate the Imagem in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertImagemUpdatableFieldsEquals(createUpdateProxyForBean(partialUpdatedImagem, imagem), getPersistedImagem(imagem));
    }

    @Test
    @Transactional
    void fullUpdateImagemWithPatch() throws Exception {
        // Initialize the database
        insertedImagem = imagemRepository.saveAndFlush(imagem);

        long databaseSizeBeforeUpdate = getRepositoryCount();

        // Update the imagem using partial update
        Imagem partialUpdatedImagem = new Imagem();
        partialUpdatedImagem.setId(imagem.getId());

        partialUpdatedImagem
            .nome(UPDATED_NOME)
            .caminho(UPDATED_CAMINHO)
            .mimeType(UPDATED_MIME_TYPE)
            .largura(UPDATED_LARGURA)
            .altura(UPDATED_ALTURA)
            .dados(UPDATED_DADOS)
            .dadosContentType(UPDATED_DADOS_CONTENT_TYPE);

        restImagemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedImagem.getId())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(partialUpdatedImagem))
            )
            .andExpect(status().isOk());

        // Validate the Imagem in the database

        assertSameRepositoryCount(databaseSizeBeforeUpdate);
        assertImagemUpdatableFieldsEquals(partialUpdatedImagem, getPersistedImagem(partialUpdatedImagem));
    }

    @Test
    @Transactional
    void patchNonExistingImagem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        imagem.setId(longCount.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restImagemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, imagem.getId()).contentType("application/merge-patch+json").content(om.writeValueAsBytes(imagem))
            )
            .andExpect(status().isBadRequest());

        // Validate the Imagem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchImagem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        imagem.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restImagemMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, longCount.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(om.writeValueAsBytes(imagem))
            )
            .andExpect(status().isBadRequest());

        // Validate the Imagem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamImagem() throws Exception {
        long databaseSizeBeforeUpdate = getRepositoryCount();
        imagem.setId(longCount.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restImagemMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(om.writeValueAsBytes(imagem)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Imagem in the database
        assertSameRepositoryCount(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteImagem() throws Exception {
        // Initialize the database
        insertedImagem = imagemRepository.saveAndFlush(imagem);

        long databaseSizeBeforeDelete = getRepositoryCount();

        // Delete the imagem
        restImagemMockMvc
            .perform(delete(ENTITY_API_URL_ID, imagem.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        assertDecrementedRepositoryCount(databaseSizeBeforeDelete);
    }

    protected long getRepositoryCount() {
        return imagemRepository.count();
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

    protected Imagem getPersistedImagem(Imagem imagem) {
        return imagemRepository.findById(imagem.getId()).orElseThrow();
    }

    protected void assertPersistedImagemToMatchAllProperties(Imagem expectedImagem) {
        assertImagemAllPropertiesEquals(expectedImagem, getPersistedImagem(expectedImagem));
    }

    protected void assertPersistedImagemToMatchUpdatableProperties(Imagem expectedImagem) {
        assertImagemAllUpdatablePropertiesEquals(expectedImagem, getPersistedImagem(expectedImagem));
    }
}
