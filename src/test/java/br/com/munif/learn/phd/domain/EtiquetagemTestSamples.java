package br.com.munif.learn.phd.domain;

import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;

public class EtiquetagemTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Etiquetagem getEtiquetagemSample1() {
        return new Etiquetagem().id(1L);
    }

    public static Etiquetagem getEtiquetagemSample2() {
        return new Etiquetagem().id(2L);
    }

    public static Etiquetagem getEtiquetagemRandomSampleGenerator() {
        return new Etiquetagem().id(longCount.incrementAndGet());
    }
}
