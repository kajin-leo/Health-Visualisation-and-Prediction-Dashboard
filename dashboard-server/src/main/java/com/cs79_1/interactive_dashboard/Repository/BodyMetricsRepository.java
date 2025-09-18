package com.cs79_1.interactive_dashboard.Repository;

import com.cs79_1.interactive_dashboard.Entity.BodyMetrics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BodyMetricsRepository extends JpaRepository<BodyMetrics, Long> {
    public BodyMetrics findByUserId(long userId);
}
