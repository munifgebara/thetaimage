package br.com.munif.learn.phd.repository;

import br.com.munif.learn.phd.domain.Etiquetagem;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Etiquetagem entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EtiquetagemRepository extends JpaRepository<Etiquetagem, Long> {}
