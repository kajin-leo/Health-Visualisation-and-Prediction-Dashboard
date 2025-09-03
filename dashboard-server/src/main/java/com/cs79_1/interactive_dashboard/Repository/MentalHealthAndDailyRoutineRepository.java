package com.cs79_1.interactive_dashboard.Repository;

import com.cs79_1.interactive_dashboard.Entity.MentalHealthAndDailyRoutine;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MentalHealthAndDailyRoutineRepository extends JpaRepository<MentalHealthAndDailyRoutine, Long> {
    Optional<MentalHealthAndDailyRoutine> findByUser_Id(Long userId);
}

