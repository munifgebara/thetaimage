package br.com.munif.learn.phd.domain;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.io.Serializable;

/**
 * A Imagem.
 */
@Entity
@Table(name = "imagem")
@SuppressWarnings("common-java:DuplicatedBlocks")
public class Imagem implements Serializable {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Long id;

    @Column(name = "nome")
    private String nome;

    @Column(name = "caminho")
    private String caminho;

    @Column(name = "mime_type")
    private String mimeType;

    @Column(name = "largura")
    private Integer largura;

    @Column(name = "altura")
    private Integer altura;

    @Lob
    @Column(name = "dados")
    private byte[] dados;

    @Column(name = "dados_content_type")
    private String dadosContentType;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "usuario" }, allowSetters = true)
    private Dataset dataset;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "dataset" }, allowSetters = true)
    private Conjunto conjunto;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "dataset" }, allowSetters = true)
    private Classe classe;

    // jhipster-needle-entity-add-field - JHipster will add fields here

    public Long getId() {
        return this.id;
    }

    public Imagem id(Long id) {
        this.setId(id);
        return this;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getNome() {
        return this.nome;
    }

    public Imagem nome(String nome) {
        this.setNome(nome);
        return this;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public String getCaminho() {
        return this.caminho;
    }

    public Imagem caminho(String caminho) {
        this.setCaminho(caminho);
        return this;
    }

    public void setCaminho(String caminho) {
        this.caminho = caminho;
    }

    public String getMimeType() {
        return this.mimeType;
    }

    public Imagem mimeType(String mimeType) {
        this.setMimeType(mimeType);
        return this;
    }

    public void setMimeType(String mimeType) {
        this.mimeType = mimeType;
    }

    public Integer getLargura() {
        return this.largura;
    }

    public Imagem largura(Integer largura) {
        this.setLargura(largura);
        return this;
    }

    public void setLargura(Integer largura) {
        this.largura = largura;
    }

    public Integer getAltura() {
        return this.altura;
    }

    public Imagem altura(Integer altura) {
        this.setAltura(altura);
        return this;
    }

    public void setAltura(Integer altura) {
        this.altura = altura;
    }

    public byte[] getDados() {
        return this.dados;
    }

    public Imagem dados(byte[] dados) {
        this.setDados(dados);
        return this;
    }

    public void setDados(byte[] dados) {
        this.dados = dados;
    }

    public String getDadosContentType() {
        return this.dadosContentType;
    }

    public Imagem dadosContentType(String dadosContentType) {
        this.dadosContentType = dadosContentType;
        return this;
    }

    public void setDadosContentType(String dadosContentType) {
        this.dadosContentType = dadosContentType;
    }

    public Dataset getDataset() {
        return this.dataset;
    }

    public void setDataset(Dataset dataset) {
        this.dataset = dataset;
    }

    public Imagem dataset(Dataset dataset) {
        this.setDataset(dataset);
        return this;
    }

    public Conjunto getConjunto() {
        return this.conjunto;
    }

    public void setConjunto(Conjunto conjunto) {
        this.conjunto = conjunto;
    }

    public Imagem conjunto(Conjunto conjunto) {
        this.setConjunto(conjunto);
        return this;
    }

    public Classe getClasse() {
        return this.classe;
    }

    public void setClasse(Classe classe) {
        this.classe = classe;
    }

    public Imagem classe(Classe classe) {
        this.setClasse(classe);
        return this;
    }

    // jhipster-needle-entity-add-getters-setters - JHipster will add getters and setters here

    @Override
    public boolean equals(Object o) {
        if (this == o) {
            return true;
        }
        if (!(o instanceof Imagem)) {
            return false;
        }
        return getId() != null && getId().equals(((Imagem) o).getId());
    }

    @Override
    public int hashCode() {
        // see https://vladmihalcea.com/how-to-implement-equals-and-hashcode-using-the-jpa-entity-identifier/
        return getClass().hashCode();
    }

    // prettier-ignore
    @Override
    public String toString() {
        return "Imagem{" +
            "id=" + getId() +
            ", nome='" + getNome() + "'" +
            ", caminho='" + getCaminho() + "'" +
            ", mimeType='" + getMimeType() + "'" +
            ", largura=" + getLargura() +
            ", altura=" + getAltura() +
            ", dados='" + getDados() + "'" +
            ", dadosContentType='" + getDadosContentType() + "'" +
            "}";
    }
}
