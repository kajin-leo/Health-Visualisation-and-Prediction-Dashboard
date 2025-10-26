package com.cs79_1.interactive_dashboard.Repository;


import com.cs79_1.interactive_dashboard.Entity.FoodFrequencyRecord;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FoodFrequencyRepository extends JpaRepository<FoodFrequencyRecord, Long> {
}

