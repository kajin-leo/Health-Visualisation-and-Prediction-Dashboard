package com.cs79_1.interactive_dashboard.Controller;

import com.cs79_1.interactive_dashboard.DTO.FileInfo;
import com.cs79_1.interactive_dashboard.Service.BatchImportService;
import com.cs79_1.interactive_dashboard.DTO.ImportProgress;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.parameters.P;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;

@RestController
@RequestMapping("/api/ops/import")
public class BatchImportController {

    @Autowired
    private BatchImportService batchImportService;

    @Value("${upload.temp.path:temp/uploads}")
    private String uploadTempPath;

    private static final Logger logger = LoggerFactory.getLogger(BatchImportController.class);

    @PostMapping("/individual-attributes")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<String> importIndividualAttributes(@RequestParam("file") MultipartFile file) {
        Path tempFile = null;
        try {
            if (file.isEmpty()){
                return ResponseEntity.badRequest().body("File is empty");
            }

            String fileName = file.getOriginalFilename();
            if (fileName == null || !fileName.toLowerCase().endsWith(".csv")) {
                return ResponseEntity.badRequest().body("File is not csv");
            }

            String jobId = UUID.randomUUID().toString();

            Files.createDirectories(Paths.get(uploadTempPath));

            tempFile = Paths.get(uploadTempPath, jobId + "_" + file.getOriginalFilename());
            file.transferTo(tempFile);

            ImportProgress progress = new ImportProgress(jobId, 1);
            batchImportService.initProgress(jobId, progress);

            Path finalTempFile = tempFile;
            CompletableFuture.runAsync(() -> {
                try {
                    batchImportService.importIndividualAttributesWithProgress(finalTempFile, jobId);
                } finally {
                    if (finalTempFile != null) {
                        try {
                            Files.deleteIfExists(finalTempFile);
                            logger.debug("Deleted temp file {}", finalTempFile);
                        } catch (IOException e) {
                            logger.warn("Failed to delete temp file: " + finalTempFile, e);
                        }
                    }
                }
            }).exceptionally(ex -> {
                logger.error("Failed to import individual attributes", ex);
                if (finalTempFile != null) {
                    try {
                        Files.deleteIfExists(finalTempFile);
                        logger.debug("Deleted temp file {}", finalTempFile);
                    } catch (IOException e) {
                        logger.warn("Failed to delete temp file: " + finalTempFile, e);
                    }
                }

                return null;
            });

            return ResponseEntity.ok(jobId);
        } catch (Exception e) {
            logger.error("Error importing Individual Attributes: " + e.getMessage() + e.getStackTrace());
            return ResponseEntity.badRequest().body("Error importing Individual Attributes: " + e.getMessage());
        }
    }

    @GetMapping(value="/progress-stream/{jobId}", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter getProgress(@PathVariable String jobId) {
        SseEmitter sseEmitter = new SseEmitter(Long.MAX_VALUE);
        ExecutorService executor = Executors.newSingleThreadExecutor();
        executor.execute(() -> {
            try {
                while (!batchImportService.isCompleted(jobId)) {
                    ImportProgress importProgress = batchImportService.getProgress(jobId);
                    sseEmitter.send(SseEmitter.event()
                            .name("progress")
                            .data(importProgress));
                    Thread.sleep(500);
                }

                sseEmitter.send(SseEmitter.event()
                        .name("complete")
                        .data(batchImportService.getProgress(jobId)));
                sseEmitter.complete();
            } catch (Exception e) {
                sseEmitter.completeWithError(e);
            }
        });
        executor.shutdown();

        return sseEmitter;
    }

    @GetMapping(value="/progress/{jobId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<ImportProgress> getImportProgress(@PathVariable String jobId) {
        ImportProgress importProgress = batchImportService.getProgress(jobId);
        return ResponseEntity.ok(importProgress);
    }

    @PostMapping("/workout-single")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<String> importWorkoutSingle(@RequestParam("file") MultipartFile file,
                                                      @RequestParam("participantId") String participantId) {
        try {
            if (file.isEmpty()){
                return ResponseEntity.badRequest().body("File is empty");
            }

            batchImportService.importWorkoutAmountData(file, participantId);
            return ResponseEntity.ok("Import WorkoutAmount data of " + participantId + "successful");
        } catch (Exception e) {
            logger.error("Error importing WorkoutSingle: " + e.getMessage() + e.getStackTrace());
            return ResponseEntity.badRequest().body("Error importing WorkoutSingle: " + e.getMessage());
        }
    }

    @PostMapping("/workout-batch")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<String> importWorkoutBatch(@RequestParam("files") MultipartFile[] files) {
        try {
            if (files.length == 0){
                return ResponseEntity.badRequest().body("Please select at least one file");
            }
            List<FileInfo> savedFiles = saveToTempFiles(files);

            String jobId= UUID.randomUUID().toString();
            
            ImportProgress progress = new ImportProgress(jobId, 1);
            batchImportService.initProgress(jobId, progress);

            CompletableFuture.runAsync(() -> {
                try {
                    batchImportService.importMultipleWorkoutAmountDataWithProgress(savedFiles, jobId);
                } finally {
                    cleanUpTempFiles(savedFiles);
                }
            }).exceptionally(ex -> {
                logger.error("Failed to batch import workout data: ", ex);
                cleanUpTempFiles(savedFiles);

                return null;
            });

            return ResponseEntity.ok(jobId);
        } catch (Exception e) {
            logger.error("Error importing WorkoutBatch: " + e);
            return ResponseEntity.badRequest().body("Error importing WorkoutBatch: " + e.getMessage());
        }
    }

    @GetMapping("/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<String> getStatus() {
        return ResponseEntity.ok("Batch Import Service is running");
    }


    private Path saveToTempFile(MultipartFile file, Path uploadDir) throws IOException {
        String originalFilename = file.getOriginalFilename();
//        String fileExtension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : ".tmp";

        String tempFileName = UUID.randomUUID().toString() + "." + originalFilename;
        Path tempFile = uploadDir.resolve(tempFileName);

        file.transferTo(tempFile.toFile());

        return tempFile;
    }

    private List<FileInfo> saveToTempFiles(MultipartFile[] files) throws IOException {
        List<FileInfo> savedFiles = new ArrayList<>();
        Path uploadDir = Paths.get(uploadTempPath);

        Files.createDirectories(uploadDir);

        for(MultipartFile file : files){
            if (file.isEmpty()){
                continue;
            }

            String originalFilename = file.getOriginalFilename();
            String fileExtension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf(".")) : ".tmp";
            String tempFileName = UUID.randomUUID().toString() + fileExtension;
            logger.debug("Createed temp name: {}", tempFileName);

            Path tempFile = uploadDir.resolve(tempFileName);
            logger.debug("Created Path: {}", tempFile);

            file.transferTo(tempFile);
            logger.debug("Transfered file to path {}", tempFile);

            savedFiles.add(new FileInfo(tempFile, file.getOriginalFilename()));
            logger.debug("Saved file {} to {}", originalFilename, tempFile);
        }

        return savedFiles;
    }

    private void cleanUpTempFiles(List<FileInfo> tempFiles) {
        for (FileInfo tempFile : tempFiles) {
            try {
                Files.deleteIfExists(tempFile.getTempPath());
                logger.debug("Deleted temp file {}", tempFile.getTempPath());
            } catch (IOException e) {
                logger.warn("Failed to delete temp file: " + tempFile.getTempPath(), e);
            }
        }
    }
}
