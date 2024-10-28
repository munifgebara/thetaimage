package br.com.munif.learn.phd.web.rest;

import br.com.munif.learn.phd.domain.Dataset;
import br.com.munif.learn.phd.repository.DatasetRepository;
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
 * REST controller for managing {@link br.com.munif.learn.phd.domain.Dataset}.
 */
@RestController
@RequestMapping("/api/datasets")
@Transactional
public class DatasetResource {

    private static final Logger LOG = LoggerFactory.getLogger(DatasetResource.class);

    private static final String ENTITY_NAME = "dataset";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final DatasetRepository datasetRepository;

    public DatasetResource(DatasetRepository datasetRepository) {
        this.datasetRepository = datasetRepository;
    }

    /**
     * {@code POST  /datasets} : Create a new dataset.
     *
     * @param dataset the dataset to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new dataset, or with status {@code 400 (Bad Request)} if the dataset has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("")
    public ResponseEntity<Dataset> createDataset(@RequestBody Dataset dataset) throws URISyntaxException {
        LOG.debug("REST request to save Dataset : {}", dataset);
        if (dataset.getId() != null) {
            throw new BadRequestAlertException("A new dataset cannot already have an ID", ENTITY_NAME, "idexists");
        }
        dataset = datasetRepository.save(dataset);
        return ResponseEntity.created(new URI("/api/datasets/" + dataset.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, dataset.getId().toString()))
            .body(dataset);
    }

    /**
     * {@code PUT  /datasets/:id} : Updates an existing dataset.
     *
     * @param id the id of the dataset to save.
     * @param dataset the dataset to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dataset,
     * or with status {@code 400 (Bad Request)} if the dataset is not valid,
     * or with status {@code 500 (Internal Server Error)} if the dataset couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/{id}")
    public ResponseEntity<Dataset> updateDataset(@PathVariable(value = "id", required = false) final Long id, @RequestBody Dataset dataset)
        throws URISyntaxException {
        LOG.debug("REST request to update Dataset : {}, {}", id, dataset);
        if (dataset.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dataset.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!datasetRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        dataset = datasetRepository.save(dataset);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, dataset.getId().toString()))
            .body(dataset);
    }

    /**
     * {@code PATCH  /datasets/:id} : Partial updates given fields of an existing dataset, field will ignore if it is null
     *
     * @param id the id of the dataset to save.
     * @param dataset the dataset to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated dataset,
     * or with status {@code 400 (Bad Request)} if the dataset is not valid,
     * or with status {@code 404 (Not Found)} if the dataset is not found,
     * or with status {@code 500 (Internal Server Error)} if the dataset couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Dataset> partialUpdateDataset(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Dataset dataset
    ) throws URISyntaxException {
        LOG.debug("REST request to partial update Dataset partially : {}, {}", id, dataset);
        if (dataset.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, dataset.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!datasetRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Dataset> result = datasetRepository
            .findById(dataset.getId())
            .map(existingDataset -> {
                if (dataset.getNome() != null) {
                    existingDataset.setNome(dataset.getNome());
                }
                if (dataset.getDescricao() != null) {
                    existingDataset.setDescricao(dataset.getDescricao());
                }
                if (dataset.getDiferencaMinima() != null) {
                    existingDataset.setDiferencaMinima(dataset.getDiferencaMinima());
                }

                return existingDataset;
            })
            .map(datasetRepository::save);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, dataset.getId().toString())
        );
    }

    /**
     * {@code GET  /datasets} : get all the datasets.
     *
     * @param pageable the pagination information.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of datasets in body.
     */
    @GetMapping("")
    public ResponseEntity<List<Dataset>> getAllDatasets(@org.springdoc.core.annotations.ParameterObject Pageable pageable) {
        LOG.debug("REST request to get a page of Datasets");
        Page<Dataset> page = datasetRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(ServletUriComponentsBuilder.fromCurrentRequest(), page);
        return ResponseEntity.ok().headers(headers).body(page.getContent());
    }

    /**
     * {@code GET  /datasets/:id} : get the "id" dataset.
     *
     * @param id the id of the dataset to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the dataset, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/{id}")
    public ResponseEntity<Dataset> getDataset(@PathVariable("id") Long id) {
        LOG.debug("REST request to get Dataset : {}", id);
        Optional<Dataset> dataset = datasetRepository.findById(id);
        return ResponseUtil.wrapOrNotFound(dataset);
    }

    /**
     * {@code DELETE  /datasets/:id} : delete the "id" dataset.
     *
     * @param id the id of the dataset to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDataset(@PathVariable("id") Long id) {
        LOG.debug("REST request to delete Dataset : {}", id);
        datasetRepository.deleteById(id);
        return ResponseEntity.noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
