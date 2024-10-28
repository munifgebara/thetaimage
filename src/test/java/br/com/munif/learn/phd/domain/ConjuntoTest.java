package br.com.munif.learn.phd.domain;

import static br.com.munif.learn.phd.domain.ConjuntoTestSamples.*;
import static br.com.munif.learn.phd.domain.DatasetTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import br.com.munif.learn.phd.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ConjuntoTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Conjunto.class);
        Conjunto conjunto1 = getConjuntoSample1();
        Conjunto conjunto2 = new Conjunto();
        assertThat(conjunto1).isNotEqualTo(conjunto2);

        conjunto2.setId(conjunto1.getId());
        assertThat(conjunto1).isEqualTo(conjunto2);

        conjunto2 = getConjuntoSample2();
        assertThat(conjunto1).isNotEqualTo(conjunto2);
    }

    @Test
    void datasetTest() {
        Conjunto conjunto = getConjuntoRandomSampleGenerator();
        Dataset datasetBack = getDatasetRandomSampleGenerator();

        conjunto.setDataset(datasetBack);
        assertThat(conjunto.getDataset()).isEqualTo(datasetBack);

        conjunto.dataset(null);
        assertThat(conjunto.getDataset()).isNull();
    }
}
