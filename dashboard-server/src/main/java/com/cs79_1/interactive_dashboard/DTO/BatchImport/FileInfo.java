package com.cs79_1.interactive_dashboard.DTO.BatchImport;

import java.nio.file.Path;

public class FileInfo {
    private final Path tempPath;
    private final String originalName;

    public FileInfo(Path tempPath, String originalName) {
        this.tempPath = tempPath;
        this.originalName = originalName;
    }

    public Path getTempPath() {
        return tempPath;
    }

    public String getOriginalName() {
        return originalName;
    }
}
