package br.com.munif.learn.phd.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class ClasseTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Classe getClasseSample1() {
        return new Classe().id(1L).nome("nome1");
    }

    public static Classe getClasseSample2() {
        return new Classe().id(2L).nome("nome2");
    }

    public static Classe getClasseRandomSampleGenerator() {
        return new Classe().id(longCount.incrementAndGet()).nome(UUID.randomUUID().toString());
    }
}
