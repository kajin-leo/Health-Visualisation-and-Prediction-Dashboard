package com.cs79_1.interactive_dashboard.Service;

import com.cs79_1.interactive_dashboard.Entity.User;
import com.cs79_1.interactive_dashboard.Entity.UserPreference;
import com.cs79_1.interactive_dashboard.Enum.UserPreference.UIAppearance;
import com.cs79_1.interactive_dashboard.Repository.UserPreferenceRepository;
import com.cs79_1.interactive_dashboard.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserPreferenceRepository userPreferenceRepository;

    public Optional<User> getUserByUserId(long id){
        return userRepository.findById(id);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }

    @Transactional
    public UserPreference getOrCreateUserPreference(long userId) {
        User user = getUserByUserId(userId).orElseThrow();
        Optional<UserPreference> userPreferenceOptional = userPreferenceRepository.findByUserId(userId);
        if (userPreferenceOptional.isPresent()) {
            return userPreferenceOptional.get();
        } else {
            UserPreference userPreference = new UserPreference(user, UIAppearance.System);
            return userPreferenceRepository.save(userPreference);
        }
    }

    public UserPreference setUserPreference(UserPreference userPreference) {
        return userPreferenceRepository.save(userPreference);
    }

    public UserPreference setUserUIAppearancePreference(long userId, UIAppearance appearance) {
        UserPreference userPreference = getOrCreateUserPreference(userId);
        userPreference.setAppearance(appearance);
        return setUserPreference(userPreference);
    }
}

