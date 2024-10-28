package br.com.munif.learn.phd.web.rest;

import br.com.munif.learn.phd.domain.Etiquetagem;
import br.com.munif.learn.phd.repository.EtiquetagemRepository;
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
 * REST controller for managing {@link br.com.munif.learn.phd.domain.Etiquetagem}.
 */
@RestController
@RequestMapping("/api/etiquetagems")
@Transactional
public class EtiquetagemResource {

    private static final Logger LOG = LoggerFactory.getLogger(EtiquetagemResource.class);

    private static final String ENTITY_NAME = "etiquetagem";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EtiquetagemRepository etiquetagemRepository;

    public EtiquetagemResource(EtiquetagemRepository etiquetagemRepository) {
        this.etiquetagemRepository = etiquetagemRepository;
    }

    /**
     * {@code POST  /etiquetagems} : Create a new etiquetagem.
     *
     * @param etiquetagem the etiquetagem to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new etiquetagem, or with status {@code 400 (Bad Request)} if the etiquetagem has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Etiquetagem> createEtiquetagem(@RequestBody Etiquetagem etiquetagem) throws URISyntaxException {
        LOG.debug("REST request to save Etiquetagem : {}", etiquetagem);
        if (etiquetagem.getId() != null) {
            throw new BadRequestAlertException("A new etiquetagem cannot already have an ID", ENTITY_NAME, "idexists");
        }
        etiquetagem = etiquetagemRepository.save(etiquetagem);
        return ResponseEntity.created(new URI("/api/etiquetagems/" + etiquetagem.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, etiquetagem.getId().toString()))
            .body(etiquetagem);
    }

    /**
     * {@code PUT  /etiquetagems/:id} : Updates an existing etiquetagem.
     *
     * @param id the id of the etiquetagem to save.
     * @param etiquetagem the etiquetagem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated etiquetagem,
     * or with status {@code 400 (Bad Request)} if the etiquetagem is not valid,
     * or with status {@code 500 (Internal Server Error)} if the etiquetagem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Etiquetagem> updateEtiquetagem(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Etiquetagem etiquetagem
    ) throws URISyntaxException {
        LOG.debug("REST request to update Etiquetagem : {}, {}", id, etiquetagem);
        if (etiquetagem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, etiquetagem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!etiquetagemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        etiquetagem = etiquetagemRepository.save(etiquetagem);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, etiquetagem.getId().toString()))
            .body(etiquetagem);
    }

    /**
     * {@code PATCH  /etiquetagems/:id} : Partial updates given fields of an existing etiquetagem, field will ignore if it is null
     *
     * @param id the id of the etiquetagem to save.
     * @param etiquetagem the etiquetagem to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated etiquetagem,
     * or with status {@code 400 (Bad Request)} if the etiquetagem is not valid,
     * or with status {@code 404 (Not Found)} if the etiquetagem is not found,
     * or with status {@code 500 (Internal Server Error)} if the etiquetagem couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Etiquetagem> partialUpdateEtiquetagem(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Etiquetagem etiquetagem
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Etiquetagem partially : {}, {}", id, etiquetagem);
        if (etiquetagem.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, etiquetagem.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!etiquetagemRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Etiquetagem> result = etiquetagemRepository
            .findById(etiquetagem.getId())
            .map(existingEtiquetagem -> {
                if (etiquetagem.getX() != null) {
                    existingEtiquetagem.setX(etiquetagem.getX());
                }
                if (etiquetagem.getY() != null) {
                    existingEtiquetagem.setY(etiquetagem.getY());
                }
                if (etiquetagem.getLargura() != null) {
                    existingEtiquetagem.setLargura(etiquetagem.getLargura());
                }
                if (etiquetagem.getAltura() != null) {
                    existingEtiquetagem.setAltura(etiquetagem.getAltura());
                }

                return existingEtiquetagem;
            })
            .map(etiquetagemRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, etiquetagem.getId().toString())
        );
    }

    /**
     * {@code GET  /etiquetagems} : get all the etiquetagems.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of etiquetagems in body.
     */
    @GetMapping("")
    public ResponseEntity<List<Etiquetagem>> getAllEtiquetagems(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Etiquetagems");
        Page<Etiquetagem> page = etiquetagemRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /etiquetagems/:id} : get the "id" etiquetagem.
     *
     * @param id the id of the etiquetagem to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the etiquetagem, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Etiquetagem> getEtiquetagem(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Etiquetagem : {}", id);
        Optional<Etiquetagem> etiquetagem = etiquetagemRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(etiquetagem);
    }

    /**
     * {@code DELETE  /etiquetagems/:id} : delete the "id" etiquetagem.
     *
     * @param id the id of the etiquetagem to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEtiquetagem(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Etiquetagem : {}", id);
        etiquetagemRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
