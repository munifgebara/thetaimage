package br.com.munif.learn.phd.domain;

import static br.com.munif.learn.phd.domain.ClasseTestSamples.*;
import static br.com.munif.learn.phd.domain.DatasetTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import br.com.munif.learn.phd.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ClasseTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Classe.class);
        Classe classe1 = getClasseSample1();
        Classe classe2 = new Classe();
        assertThat(classe1).isNotEqualTo(classe2);

        classe2.setId(classe1.getId());
        assertThat(classe1).isEqualTo(classe2);

        classe2 = getClasseSample2();
        assertThat(classe1).isNotEqualTo(classe2);
    }

    @Test
    void datasetTest() {
        Classe classe = getClasseRandomSampleGenerator();
        Dataset datasetBack = getDatasetRandomSampleGenerator();

        classe.setDataset(datasetBack);
        assertThat(classe.getDataset()).isEqualTo(datasetBack);

        classe.dataset(null);
        assertThat(classe.getDataset()).isNull();
    }
}
