package br.com.munif.learn.phd.repository;

import br.com.munif.learn.phd.domain.Dataset;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Dataset entity.
 */
@SuppressWarnings("unused")
@Repository
public interface DatasetRepository extends JpaRepository<Dataset, Long> {}
