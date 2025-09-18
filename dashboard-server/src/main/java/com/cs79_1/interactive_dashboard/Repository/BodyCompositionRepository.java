package com.cs79_1.interactive_dashboard.Repository;

import com.cs79_1.interactive_dashboard.Entity.BodyComposition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BodyCompositionRepository extends JpaRepository<BodyComposition, Long> {
    Optional<BodyComposition> findByUserId(Long userId);

}
