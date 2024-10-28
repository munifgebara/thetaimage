package br.com.munif.learn.phd.domain;

import java.util.Random;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicLong;

public class DatasetTestSamples {

    private static final Random random = new Random();
    private static final AtomicLong longCount = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    public static Dataset getDatasetSample1() {
        return new Dataset().id(1L).nome("nome1");
    }

    public static Dataset getDatasetSample2() {
        return new Dataset().id(2L).nome("nome2");
    }

    public static Dataset getDatasetRandomSampleGenerator() {
        return new Dataset().id(longCount.incrementAndGet()).nome(UUID.randomUUID().toString());
    }
}
