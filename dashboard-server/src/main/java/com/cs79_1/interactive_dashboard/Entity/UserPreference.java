package com.cs79_1.interactive_dashboard.Entity;

import com.cs79_1.interactive_dashboard.Enum.UserPreference.UIAppearance;
import jakarta.persistence.*;

@Entity
public class UserPreference {
    @Id
    private long id;

    @Version
    private long version;

    @OneToOne
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Enumerated(EnumType.ORDINAL)
    private UIAppearance appearance;

    public UserPreference() {
    }

    public UserPreference(User user, UIAppearance appearance) {
        this.user = user;
        this.appearance = appearance;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getVersion() {
        return version;
    }

    public void setVersion(long version) {
        this.version = version;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public UIAppearance getAppearance() {
        return appearance;
    }

    public void setAppearance(UIAppearance appearance) {
        this.appearance = appearance;
    }
}
