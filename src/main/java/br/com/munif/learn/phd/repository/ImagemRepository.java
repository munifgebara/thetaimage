package br.com.munif.learn.phd.repository;

import br.com.munif.learn.phd.domain.Imagem;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Imagem entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ImagemRepository extends JpaRepository<Imagem, Long> {}
