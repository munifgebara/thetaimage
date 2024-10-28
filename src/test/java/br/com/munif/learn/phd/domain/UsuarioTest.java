package br.com.munif.learn.phd.domain;

import static br.com.munif.learn.phd.domain.UsuarioTestSamples.*;
import static org.assertj.core.api.Assertions.assertThat;

import br.com.munif.learn.phd.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class UsuarioTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Usuario.class);
        Usuario usuario1 = getUsuarioSample1();
        Usuario usuario2 = new Usuario();
        assertThat(usuario1).isNotEqualTo(usuario2);

        usuario2.setId(usuario1.getId());
        assertThat(usuario1).isEqualTo(usuario2);

        usuario2 = getUsuarioSample2();
        assertThat(usuario1).isNotEqualTo(usuario2);
    }
}
