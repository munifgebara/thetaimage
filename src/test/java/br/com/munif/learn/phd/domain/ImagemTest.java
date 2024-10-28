package br.com.munif.learn.phd.domain;

import static br.com.munif.learn.phd.domain.ClasseTestSamples.*;
import static br.com.munif.learn.phd.domain.ConjuntoTestSamples.*;
import static br.com.munif.learn.phd.domain.DatasetTestSamples.*;
import static br.com.munif.learn.phd.domain.ImagemTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import br.com.munif.learn.phd.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ImagemTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Imagem.class);
        Imagem imagem1 = getImagemSample1();
        Imagem imagem2 = new Imagem();
        assertThat(imagem1).isNotEqualTo(imagem2);

        imagem2.setId(imagem1.getId());
        assertThat(imagem1).isEqualTo(imagem2);

        imagem2 = getImagemSample2();
        assertThat(imagem1).isNotEqualTo(imagem2);
    }

    @Test
    void datasetTest() {
        Imagem imagem = getImagemRandomSampleGenerator();
        Dataset datasetBack = getDatasetRandomSampleGenerator();

        imagem.setDataset(datasetBack);
        assertThat(imagem.getDataset()).isEqualTo(datasetBack);

        imagem.dataset(null);
        assertThat(imagem.getDataset()).isNull();
    }

    @Test
    void conjuntoTest() {
        Imagem imagem = getImagemRandomSampleGenerator();
        Conjunto conjuntoBack = getConjuntoRandomSampleGenerator();

        imagem.setConjunto(conjuntoBack);
        assertThat(imagem.getConjunto()).isEqualTo(conjuntoBack);

        imagem.conjunto(null);
        assertThat(imagem.getConjunto()).isNull();
    }

    @Test
    void classeTest() {
        Imagem imagem = getImagemRandomSampleGenerator();
        Classe classeBack = getClasseRandomSampleGenerator();

        imagem.setClasse(classeBack);
        assertThat(imagem.getClasse()).isEqualTo(classeBack);

        imagem.classe(null);
        assertThat(imagem.getClasse()).isNull();
    }
}
