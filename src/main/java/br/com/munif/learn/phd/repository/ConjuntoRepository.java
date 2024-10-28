package br.com.munif.learn.phd.repository;

import br.com.munif.learn.phd.domain.Conjunto;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Conjunto entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ConjuntoRepository extends JpaRepository<Conjunto, Long> {}
