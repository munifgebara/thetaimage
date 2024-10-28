package br.com.munif.learn.phd.web.rest;

import br.com.munif.learn.phd.domain.Classe;
import br.com.munif.learn.phd.repository.ClasseRepository;
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
 * REST controller for managing {@link br.com.munif.learn.phd.domain.Classe}.
 */
@RestController
@RequestMapping("/api/classes")
@Transactional
public class ClasseResource {

    private static final Logger LOG = LoggerFactory.getLogger(ClasseResource.class);

    private static final String ENTITY_NAME = "classe";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final ClasseRepository classeRepository;

    public ClasseResource(ClasseRepository classeRepository) {
        this.classeRepository = classeRepository;
    }

    /**
     * {@code POST  /classes} : Create a new classe.
     *
     * @param classe the classe to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new classe, or with status {@code 400 (Bad Request)} if the classe has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Classe> createClasse(@RequestBody Classe classe) throws URISyntaxException {
        LOG.debug("REST request to save Classe : {}", classe);
        if (classe.getId() != null) {
            throw new BadRequestAlertException("A new classe cannot already have an ID", ENTITY_NAME, "idexists");
        }
        classe = classeRepository.save(classe);
        return ResponseEntity.created(new URI("/api/classes/" + classe.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, classe.getId().toString()))
            .body(classe);
    }

    /**
     * {@code PUT  /classes/:id} : Updates an existing classe.
     *
     * @param id the id of the classe to save.
     * @param classe the classe to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated classe,
     * or with status {@code 400 (Bad Request)} if the classe is not valid,
     * or with status {@code 500 (Internal Server Error)} if the classe couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Classe> updateClasse(@PathVariable(value = "id", required = false) final Long id, @RequestBody Classe classe)
        throws URISyntaxException {
        LOG.debug("REST request to update Classe : {}, {}", id, classe);
        if (classe.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, classe.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!classeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        classe = classeRepository.save(classe);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, classe.getId().toString()))
            .body(classe);
    }

    /**
     * {@code PATCH  /classes/:id} : Partial updates given fields of an existing classe, field will ignore if it is null
     *
     * @param id the id of the classe to save.
     * @param classe the classe to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated classe,
     * or with status {@code 400 (Bad Request)} if the classe is not valid,
     * or with status {@code 404 (Not Found)} if the classe is not found,
     * or with status {@code 500 (Internal Server Error)} if the classe couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Classe> partialUpdateClasse(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Classe classe
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Classe partially : {}, {}", id, classe);
        if (classe.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, classe.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!classeRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Classe> result = classeRepository
            .findById(classe.getId())
            .map(existingClasse -> {
                if (classe.getNome() != null) {
                    existingClasse.setNome(classe.getNome());
                }

                return existingClasse;
            })
            .map(classeRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, classe.getId().toString())
        );
    }

    /**
     * {@code GET  /classes} : get all the classes.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of classes in body.
     */
    @GetMapping("")
    public ResponseEntity<List<Classe>> getAllClasses(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Classes");
        Page<Classe> page = classeRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /classes/:id} : get the "id" classe.
     *
     * @param id the id of the classe to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the classe, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Classe> getClasse(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Classe : {}", id);
        Optional<Classe> classe = classeRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(classe);
    }

    /**
     * {@code DELETE  /classes/:id} : delete the "id" classe.
     *
     * @param id the id of the classe to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClasse(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Classe : {}", id);
        classeRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
