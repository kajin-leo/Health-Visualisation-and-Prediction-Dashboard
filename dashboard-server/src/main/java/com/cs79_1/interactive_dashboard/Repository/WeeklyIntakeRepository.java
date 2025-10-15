package com.cs79_1.interactive_dashboard.Repository;

import com.cs79_1.interactive_dashboard.Entity.WeeklyIntake;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.Query;
import java.util.Optional;

@Repository
public interface WeeklyIntakeRepository extends JpaRepository<WeeklyIntake, Long> {

    @Query("SELECT w.energyGroupAvgDaily FROM WeeklyIntake w WHERE w.user.id = :userId")
    Optional<Double> findEnergyByUserId(long userId);

    @Query("SELECT w.protectiveGroupAvgDaily FROM WeeklyIntake w WHERE w.user.id = :userId")
    Optional<Double> findProtectiveByUserId(long userId);

    @Query("SELECT w.bodybuildingGroupAvgDaily FROM WeeklyIntake w WHERE w.user.id = :userId")
    Optional<Double> findBodyBuildingByUserId(long userId);

    @Query("SELECT w.limitedFoodAvgDaily FROM WeeklyIntake w WHERE w.user.id = :userId")
    Optional<Double> findLimitedFoodByUserId(long userId);

    @Query("SELECT w.limitedBeveragesAvgDaily FROM WeeklyIntake w WHERE w.user.id = :userId")
    Optional<Double> findLimitedBeveragesByUserId(long userId);

    public WeeklyIntake findByUserId(long userId);
}