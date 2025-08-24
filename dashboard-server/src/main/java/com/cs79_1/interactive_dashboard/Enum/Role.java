package com.cs79_1.interactive_dashboard.Enum;

public enum Role {
    USER(0),
    ADMIN(1),
    SUPERADMIN(2);

    int id;

    Role(int id) { this.id = id; }

    public int getId() { return id; }
}
