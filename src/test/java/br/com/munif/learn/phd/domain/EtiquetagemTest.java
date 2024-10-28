package br.com.munif.learn.phd.domain;

import static br.com.munif.learn.phd.domain.EtiquetaTestSamples.*;
import static br.com.munif.learn.phd.domain.EtiquetagemTestSamples.*;
import static br.com.munif.learn.phd.domain.ImagemTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import br.com.munif.learn.phd.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EtiquetagemTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Etiquetagem.class);
        Etiquetagem etiquetagem1 = getEtiquetagemSample1();
        Etiquetagem etiquetagem2 = new Etiquetagem();
        assertThat(etiquetagem1).isNotEqualTo(etiquetagem2);

        etiquetagem2.setId(etiquetagem1.getId());
        assertThat(etiquetagem1).isEqualTo(etiquetagem2);

        etiquetagem2 = getEtiquetagemSample2();
        assertThat(etiquetagem1).isNotEqualTo(etiquetagem2);
    }

    @Test
    void etiquetaTest() {
        Etiquetagem etiquetagem = getEtiquetagemRandomSampleGenerator();
        Etiqueta etiquetaBack = getEtiquetaRandomSampleGenerator();

        etiquetagem.setEtiqueta(etiquetaBack);
        assertThat(etiquetagem.getEtiqueta()).isEqualTo(etiquetaBack);

        etiquetagem.etiqueta(null);
        assertThat(etiquetagem.getEtiqueta()).isNull();
    }

    @Test
    void imagemTest() {
        Etiquetagem etiquetagem = getEtiquetagemRandomSampleGenerator();
        Imagem imagemBack = getImagemRandomSampleGenerator();

        etiquetagem.setImagem(imagemBack);
        assertThat(etiquetagem.getImagem()).isEqualTo(imagemBack);

        etiquetagem.imagem(null);
        assertThat(etiquetagem.getImagem()).isNull();
    }
}
