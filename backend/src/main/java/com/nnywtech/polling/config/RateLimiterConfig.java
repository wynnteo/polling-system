package com.nnywtech.polling.config;

import io.github.resilience4j.ratelimiter.RateLimiterRegistry;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
public class RateLimiterConfig {
    @Bean
    public RateLimiterRegistry rateLimiterRegistry() {
        return RateLimiterRegistry.of(
            io.github.resilience4j.ratelimiter.RateLimiterConfig.custom()
                .limitForPeriod(3) // Allow 3 votes per minute
                .limitRefreshPeriod(Duration.ofMinutes(1))
                .build()
        );
    }
}