package br.com.munif.learn.phd.domain;

import static br.com.munif.learn.phd.domain.DatasetTestSamples.*;
import static br.com.munif.learn.phd.domain.EtiquetaTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import br.com.munif.learn.phd.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class EtiquetaTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Etiqueta.class);
        Etiqueta etiqueta1 = getEtiquetaSample1();
        Etiqueta etiqueta2 = new Etiqueta();
        assertThat(etiqueta1).isNotEqualTo(etiqueta2);

        etiqueta2.setId(etiqueta1.getId());
        assertThat(etiqueta1).isEqualTo(etiqueta2);

        etiqueta2 = getEtiquetaSample2();
        assertThat(etiqueta1).isNotEqualTo(etiqueta2);
    }

    @Test
    void datasetTest() {
        Etiqueta etiqueta = getEtiquetaRandomSampleGenerator();
        Dataset datasetBack = getDatasetRandomSampleGenerator();

        etiqueta.setDataset(datasetBack);
        assertThat(etiqueta.getDataset()).isEqualTo(datasetBack);

        etiqueta.dataset(null);
        assertThat(etiqueta.getDataset()).isNull();
    }
}
