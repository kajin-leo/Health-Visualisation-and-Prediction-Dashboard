package com.cs79_1.interactive_dashboard.Repository;

import com.cs79_1.interactive_dashboard.Entity.WorkoutAmount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkoutAmountRepository extends JpaRepository<WorkoutAmount, Long> {
    public void deleteByUserId(Long userId);

    public List<WorkoutAmount> findByUserIdOrderByDateTimeDesc(Long userId);

    public List<WorkoutAmount> findByUserIdOrderByDateTimeAsc(Long userId);
}
