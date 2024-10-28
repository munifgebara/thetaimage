package br.com.munif.learn.phd.web.rest;

import br.com.munif.learn.phd.domain.Conjunto;
import br.com.munif.learn.phd.repository.ConjuntoRepository;
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
 * REST controller for managing {@link br.com.munif.learn.phd.domain.Conjunto}.
 */
@RestController
@RequestMapping("/api/conjuntos")
@Transactional
public class ConjuntoResource {

    private static final Logger LOG = LoggerFactory.getLogger(ConjuntoResource.class);

    private static final String ENTITY_NAME = "conjunto";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ConjuntoRepository conjuntoRepository;

    public ConjuntoResource(ConjuntoRepository conjuntoRepository) {
        this.conjuntoRepository = conjuntoRepository;
    }

    /**
     * {@code POST  /conjuntos} : Create a new conjunto.
     *
     * @param conjunto the conjunto to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new conjunto, or with status {@code 400 (Bad Request)} if the conjunto has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Conjunto> createConjunto(@RequestBody Conjunto conjunto) throws URISyntaxException {
        LOG.debug("REST request to save Conjunto : {}", conjunto);
        if (conjunto.getId() != null) {
            throw new BadRequestAlertException("A new conjunto cannot already have an ID", ENTITY_NAME, "idexists");
        }
        conjunto = conjuntoRepository.save(conjunto);
        return ResponseEntity.created(new URI("/api/conjuntos/" + conjunto.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, conjunto.getId().toString()))
            .body(conjunto);
    }

    /**
     * {@code PUT  /conjuntos/:id} : Updates an existing conjunto.
     *
     * @param id the id of the conjunto to save.
     * @param conjunto the conjunto to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated conjunto,
     * or with status {@code 400 (Bad Request)} if the conjunto is not valid,
     * or with status {@code 500 (Internal Server Error)} if the conjunto couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Conjunto> updateConjunto(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Conjunto conjunto
    ) throws URISyntaxException {
        LOG.debug("REST request to update Conjunto : {}, {}", id, conjunto);
        if (conjunto.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, conjunto.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!conjuntoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        conjunto = conjuntoRepository.save(conjunto);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, conjunto.getId().toString()))
            .body(conjunto);
    }

    /**
     * {@code PATCH  /conjuntos/:id} : Partial updates given fields of an existing conjunto, field will ignore if it is null
     *
     * @param id the id of the conjunto to save.
     * @param conjunto the conjunto to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated conjunto,
     * or with status {@code 400 (Bad Request)} if the conjunto is not valid,
     * or with status {@code 404 (Not Found)} if the conjunto is not found,
     * or with status {@code 500 (Internal Server Error)} if the conjunto couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Conjunto> partialUpdateConjunto(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Conjunto conjunto
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Conjunto partially : {}, {}", id, conjunto);
        if (conjunto.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, conjunto.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!conjuntoRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Conjunto> result = conjuntoRepository
            .findById(conjunto.getId())
            .map(existingConjunto -> {
                if (conjunto.getNome() != null) {
                    existingConjunto.setNome(conjunto.getNome());
                }

                return existingConjunto;
            })
            .map(conjuntoRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, conjunto.getId().toString())
        );
    }

    /**
     * {@code GET  /conjuntos} : get all the conjuntos.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of conjuntos in body.
     */
    @GetMapping("")
    public ResponseEntity<List<Conjunto>> getAllConjuntos(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Conjuntos");
        Page<Conjunto> page = conjuntoRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /conjuntos/:id} : get the "id" conjunto.
     *
     * @param id the id of the conjunto to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the conjunto, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Conjunto> getConjunto(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Conjunto : {}", id);
        Optional<Conjunto> conjunto = conjuntoRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(conjunto);
    }

    /**
     * {@code DELETE  /conjuntos/:id} : delete the "id" conjunto.
     *
     * @param id the id of the conjunto to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteConjunto(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Conjunto : {}", id);
        conjuntoRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
