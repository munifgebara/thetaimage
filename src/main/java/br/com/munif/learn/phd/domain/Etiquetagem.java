package br.com.munif.learn.phd.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;

/**
 * A Etiquetagem.
 */
@Entity
@Table(name = "etiquetagem")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Etiquetagem implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "x")
    private Double x;

    @Column(name = "y")
    private Double y;

    @Column(name = "largura")
    private Double largura;

    @Column(name = "altura")
    private Double altura;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "dataset" }, allowSetters = true)
    private Etiqueta etiqueta;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "dataset", "conjunto", "classe" }, allowSetters = true)
    private Imagem imagem;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Etiquetagem id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Double getX() {
        return this.x;
    }

    public Etiquetagem x(Double x) {
        this.setX(x);
        return this;
    }

    public void setX(Double x) {
        this.x = x;
    }

    public Double getY() {
        return this.y;
    }

    public Etiquetagem y(Double y) {
        this.setY(y);
        return this;
    }

    public void setY(Double y) {
        this.y = y;
    }

    public Double getLargura() {
        return this.largura;
    }

    public Etiquetagem largura(Double largura) {
        this.setLargura(largura);
        return this;
    }

    public void setLargura(Double largura) {
        this.largura = largura;
    }

    public Double getAltura() {
        return this.altura;
    }

    public Etiquetagem altura(Double altura) {
        this.setAltura(altura);
        return this;
    }

    public void setAltura(Double altura) {
        this.altura = altura;
    }

    public Etiqueta getEtiqueta() {
        return this.etiqueta;
    }

    public void setEtiqueta(Etiqueta etiqueta) {
        this.etiqueta = etiqueta;
    }

    public Etiquetagem etiqueta(Etiqueta etiqueta) {
        this.setEtiqueta(etiqueta);
        return this;
    }

    public Imagem getImagem() {
        return this.imagem;
    }

    public void setImagem(Imagem imagem) {
        this.imagem = imagem;
    }

    public Etiquetagem imagem(Imagem imagem) {
        this.setImagem(imagem);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Etiquetagem)) {
            return false;
        }
        return getId() != null && getId().equals(((Etiquetagem) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Etiquetagem{" +
            "id=" + getId() +
            ", x=" + getX() +
            ", y=" + getY() +
            ", largura=" + getLargura() +
            ", altura=" + getAltura() +
            "}";
    }
}
