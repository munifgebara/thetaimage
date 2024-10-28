package br.com.munif.learn.phd.web.rest;

import br.com.munif.learn.phd.domain.Imagem;
import br.com.munif.learn.phd.repository.ImagemRepository;
import br.com.munif.learn.phd.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.PaginationUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link br.com.munif.learn.phd.domain.Imagem}.
 */
@RestController
@RequestMapping("/api/imagems")
@Transactional
public class ImagemResource {

    private static final Logger LOG = LoggerFactory.getLogger(ImagemResource.class);

    private static final String ENTITY_NAME = "imagem";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ImagemRepository imagemRepository;

    public ImagemResource(ImagemRepository imagemRepository) {
        this.imagemRepository = imagemRepository;
    }

    /**
     * {@code POST  /imagems} : Create a new imagem.
     *
     * @param imagem the imagem to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new imagem, or with status {@code 400 (Bad Request)} if the imagem has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Imagem> createImagem(@RequestBody Imagem imagem) throws URISyntaxException {
        LOG.debug("REST request to save Imagem : {}", imagem);
        if (imagem.getId() != null) {
            throw new BadRequestAlertException("A new imagem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        imagem = imagemRepository.save(imagem);
        return ResponseEntity.created(new URI("/api/imagems/" + imagem.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, imagem.getId().toString()))
            .body(imagem);
    }

    /**
     * {@code PUT  /imagems/:id} : Updates an existing imagem.
     *
     * @param id the id of the imagem to save.
     * @param imagem the imagem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated imagem,
     * or with status {@code 400 (Bad Request)} if the imagem is not valid,
     * or with status {@code 500 (Internal Server Error)} if the imagem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Imagem> updateImagem(@PathVariable(value = "id", required = false) final Long id, @RequestBody Imagem imagem)
        throws URISyntaxException {
        LOG.debug("REST request to update Imagem : {}, {}", id, imagem);
        if (imagem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, imagem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!imagemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        imagem = imagemRepository.save(imagem);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, imagem.getId().toString()))
            .body(imagem);
    }

    /**
     * {@code PATCH  /imagems/:id} : Partial updates given fields of an existing imagem, field will ignore if it is null
     *
     * @param id the id of the imagem to save.
     * @param imagem the imagem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated imagem,
     * or with status {@code 400 (Bad Request)} if the imagem is not valid,
     * or with status {@code 404 (Not Found)} if the imagem is not found,
     * or with status {@code 500 (Internal Server Error)} if the imagem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Imagem> partialUpdateImagem(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Imagem imagem
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Imagem partially : {}, {}", id, imagem);
        if (imagem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, imagem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!imagemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Imagem> result = imagemRepository
            .findById(imagem.getId())
            .map(existingImagem -> {
                if (imagem.getNome() != null) {
                    existingImagem.setNome(imagem.getNome());
                }
                if (imagem.getCaminho() != null) {
                    existingImagem.setCaminho(imagem.getCaminho());
                }
                if (imagem.getMimeType() != null) {
                    existingImagem.setMimeType(imagem.getMimeType());
                }
                if (imagem.getLargura() != null) {
                    existingImagem.setLargura(imagem.getLargura());
                }
                if (imagem.getAltura() != null) {
                    existingImagem.setAltura(imagem.getAltura());
                }
                if (imagem.getDados() != null) {
                    existingImagem.setDados(imagem.getDados());
                }
                if (imagem.getDadosContentType() != null) {
                    existingImagem.setDadosContentType(imagem.getDadosContentType());
                }

                return existingImagem;
            })
            .map(imagemRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, imagem.getId().toString())
        );
    }

    /**
     * {@code GET  /imagems} : get all the imagems.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of imagems in body.
     */
    @GetMapping("")
    public ResponseEntity<List<Imagem>> getAllImagems(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Imagems");
        Page<Imagem> page = imagemRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /imagems/:id} : get the "id" imagem.
     *
     * @param id the id of the imagem to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the imagem, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Imagem> getImagem(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Imagem : {}", id);
        Optional<Imagem> imagem = imagemRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(imagem);
    }

    /**
     * {@code DELETE  /imagems/:id} : delete the "id" imagem.
     *
     * @param id the id of the imagem to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteImagem(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Imagem : {}", id);
        imagemRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
