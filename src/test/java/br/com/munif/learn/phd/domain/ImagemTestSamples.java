package br.com.munif.learn.phd.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

public class ImagemTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));
    private static final AtomicInteger intCount = new AtomicInteger(random.nextInt() + (2 * Short.MAX_VALUE));

    public static Imagem getImagemSample1() {
        return new Imagem().id(1L).nome("nome1").caminho("caminho1").mimeType("mimeType1").largura(1).altura(1);
    }

    public static Imagem getImagemSample2() {
        return new Imagem().id(2L).nome("nome2").caminho("caminho2").mimeType("mimeType2").largura(2).altura(2);
    }

    public static Imagem getImagemRandomSampleGenerator() {
        return new Imagem()
            .id(longCount.incrementAndGet())
            .nome(UUID.randomUUID().toString())
            .caminho(UUID.randomUUID().toString())
            .mimeType(UUID.randomUUID().toString())
            .largura(intCount.incrementAndGet())
            .altura(intCount.incrementAndGet());
    }
}
