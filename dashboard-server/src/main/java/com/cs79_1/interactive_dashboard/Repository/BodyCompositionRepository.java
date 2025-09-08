package com.cs79_1.interactive_dashboard.Repository;

import com.cs79_1.interactive_dashboard.Entity.BodyComposition;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface BodyCompositionRepository extends JpaRepository<BodyComposition, Long> {
    Optional<BodyComposition> findByUser_Id(Long userId);
    


}
