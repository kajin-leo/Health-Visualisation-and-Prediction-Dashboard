package com.cs79_1.interactive_dashboard.Repository;

import com.cs79_1.interactive_dashboard.Entity.User;
import com.cs79_1.interactive_dashboard.Enum.Role;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);

    void deleteByUsername(String username);

    boolean existsByUsername(String username);

    List<User> findByRole(Role role);
}
