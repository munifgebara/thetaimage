package br.com.munif.learn.phd.web.rest;

import br.com.munif.learn.phd.domain.Etiqueta;
import br.com.munif.learn.phd.repository.EtiquetaRepository;
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
 * REST controller for managing {@link br.com.munif.learn.phd.domain.Etiqueta}.
 */
@RestController
@RequestMapping("/api/etiquetas")
@Transactional
public class EtiquetaResource {

    private static final Logger LOG = LoggerFactory.getLogger(EtiquetaResource.class);

    private static final String ENTITY_NAME = "etiqueta";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EtiquetaRepository etiquetaRepository;

    public EtiquetaResource(EtiquetaRepository etiquetaRepository) {
        this.etiquetaRepository = etiquetaRepository;
    }

    /**
     * {@code POST  /etiquetas} : Create a new etiqueta.
     *
     * @param etiqueta the etiqueta to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new etiqueta, or with status {@code 400 (Bad Request)} if the etiqueta has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Etiqueta> createEtiqueta(@RequestBody Etiqueta etiqueta) throws URISyntaxException {
        LOG.debug("REST request to save Etiqueta : {}", etiqueta);
        if (etiqueta.getId() != null) {
            throw new BadRequestAlertException("A new etiqueta cannot already have an ID", ENTITY_NAME, "idexists");
        }
        etiqueta = etiquetaRepository.save(etiqueta);
        return ResponseEntity.created(new URI("/api/etiquetas/" + etiqueta.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, etiqueta.getId().toString()))
            .body(etiqueta);
    }

    /**
     * {@code PUT  /etiquetas/:id} : Updates an existing etiqueta.
     *
     * @param id the id of the etiqueta to save.
     * @param etiqueta the etiqueta to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated etiqueta,
     * or with status {@code 400 (Bad Request)} if the etiqueta is not valid,
     * or with status {@code 500 (Internal Server Error)} if the etiqueta couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Etiqueta> updateEtiqueta(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Etiqueta etiqueta
    ) throws URISyntaxException {
        LOG.debug("REST request to update Etiqueta : {}, {}", id, etiqueta);
        if (etiqueta.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, etiqueta.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!etiquetaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        etiqueta = etiquetaRepository.save(etiqueta);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, etiqueta.getId().toString()))
            .body(etiqueta);
    }

    /**
     * {@code PATCH  /etiquetas/:id} : Partial updates given fields of an existing etiqueta, field will ignore if it is null
     *
     * @param id the id of the etiqueta to save.
     * @param etiqueta the etiqueta to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated etiqueta,
     * or with status {@code 400 (Bad Request)} if the etiqueta is not valid,
     * or with status {@code 404 (Not Found)} if the etiqueta is not found,
     * or with status {@code 500 (Internal Server Error)} if the etiqueta couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Etiqueta> partialUpdateEtiqueta(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Etiqueta etiqueta
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Etiqueta partially : {}, {}", id, etiqueta);
        if (etiqueta.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, etiqueta.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!etiquetaRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Etiqueta> result = etiquetaRepository
            .findById(etiqueta.getId())
            .map(existingEtiqueta -> {
                if (etiqueta.getNome() != null) {
                    existingEtiqueta.setNome(etiqueta.getNome());
                }

                return existingEtiqueta;
            })
            .map(etiquetaRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, etiqueta.getId().toString())
        );
    }

    /**
     * {@code GET  /etiquetas} : get all the etiquetas.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of etiquetas in body.
     */
    @GetMapping("")
    public ResponseEntity<List<Etiqueta>> getAllEtiquetas(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Etiquetas");
        Page<Etiqueta> page = etiquetaRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /etiquetas/:id} : get the "id" etiqueta.
     *
     * @param id the id of the etiqueta to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the etiqueta, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Etiqueta> getEtiqueta(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Etiqueta : {}", id);
        Optional<Etiqueta> etiqueta = etiquetaRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(etiqueta);
    }

    /**
     * {@code DELETE  /etiquetas/:id} : delete the "id" etiqueta.
     *
     * @param id the id of the etiqueta to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEtiqueta(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Etiqueta : {}", id);
        etiquetaRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
