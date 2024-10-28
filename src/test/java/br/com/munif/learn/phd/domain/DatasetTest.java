package br.com.munif.learn.phd.domain;

import static br.com.munif.learn.phd.domain.DatasetTestSamples.*;
import static br.com.munif.learn.phd.domain.UsuarioTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import br.com.munif.learn.phd.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class DatasetTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Dataset.class);
        Dataset dataset1 = getDatasetSample1();
        Dataset dataset2 = new Dataset();
        assertThat(dataset1).isNotEqualTo(dataset2);

        dataset2.setId(dataset1.getId());
        assertThat(dataset1).isEqualTo(dataset2);

        dataset2 = getDatasetSample2();
        assertThat(dataset1).isNotEqualTo(dataset2);
    }

    @Test
    void usuarioTest() {
        Dataset dataset = getDatasetRandomSampleGenerator();
        Usuario usuarioBack = getUsuarioRandomSampleGenerator();

        dataset.setUsuario(usuarioBack);
        assertThat(dataset.getUsuario()).isEqualTo(usuarioBack);

        dataset.usuario(null);
        assertThat(dataset.getUsuario()).isNull();
    }
}
