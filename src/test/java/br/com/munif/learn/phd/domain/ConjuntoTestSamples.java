package br.com.munif.learn.phd.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ConjuntoTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Conjunto getConjuntoSample1() {
        return new Conjunto().id(1L).nome("nome1");
    }

    public static Conjunto getConjuntoSample2() {
        return new Conjunto().id(2L).nome("nome2");
    }

    public static Conjunto getConjuntoRandomSampleGenerator() {
        return new Conjunto().id(longCount.incrementAndGet()).nome(UUID.randomUUID().toString());
    }
}
