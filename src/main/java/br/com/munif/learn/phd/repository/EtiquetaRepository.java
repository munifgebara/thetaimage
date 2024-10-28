package br.com.munif.learn.phd.repository;

import br.com.munif.learn.phd.domain.Etiqueta;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Etiqueta entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EtiquetaRepository extends JpaRepository<Etiqueta, Long> {}
