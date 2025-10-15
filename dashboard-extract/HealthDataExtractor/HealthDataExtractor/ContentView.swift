//
//  ContentView.swift
//  HealthDataExtractor
//
//  Created by 可人鹅 on 15/10/2025.
//

import SwiftUI
import UIKit

// MARK: - Glass Effect Extension for Compatibility
extension View {
    @ViewBuilder
    func compatibleGlassEffect() -> some View {
        if #available(iOS 26.0, *) {
            self.glassEffect()
        } else {
            // Fallback implementation for earlier iOS versions
            self
                .background(
                    RoundedRectangle(cornerRadius: 25)
                        .fill(.ultraThinMaterial)
                        .shadow(color: .black.opacity(0.1), radius: 10, x: 0, y: 4)
                )
        }
    }
}

struct TextWall: View {
    let text = "CS79-1"
    let columns = 9
    let rows = 20
    
    var body: some View {
        GeometryReader {
            geometry in
            ZStack {
                Color.cyan.ignoresSafeArea().opacity(0)
                VStack(spacing:20){
                    ForEach(0..<rows, id: \.self) {
                        row in
                        HStack(spacing:30) {
                            ForEach(0..<columns, id: \.self) {
                                col in
                                Text(text).font(.system(size: 24, weight:.bold, design: .monospaced))
                                    .foregroundColor(
                                        Color(
                                            hue:Double((row+col)) / Double(rows+columns),
                                            saturation: 0.7,
                                            brightness: 0.8
                                        )
                                    )
                                    .frame(width:90)
                                    .opacity(0.4)
                            }
                        }
                        .offset(x: row % 2 == 0 ? 0 : 40)
                    }
                }.ignoresSafeArea().blur(radius: 2)
            }
            .frame(maxWidth: .infinity, maxHeight: .infinity)
        }
    }
}

class FileShareHelper {
    static func cleanupOldFiles() {
        guard let tempDirectory = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask).first else {
            return
        }
        
        do {
            let contents = try FileManager.default.contentsOfDirectory(at: tempDirectory, includingPropertiesForKeys: [.creationDateKey], options: [])
            let healthFiles = contents.filter { $0.lastPathComponent.hasPrefix("HealthData_") && $0.pathExtension == "json" }
            
            // Delete outdated files
            let oneHourAgo = Date().addingTimeInterval(-3600)
            for file in healthFiles {
                if let creationDate = try? file.resourceValues(forKeys: [.creationDateKey]).creationDate,
                   creationDate < oneHourAgo {
                    try? FileManager.default.removeItem(at: file)
//                    print("Cleaned up old file: \(file.lastPathComponent)")
                }
            }
        } catch {
            print("Error during cleanup: \(error)")
        }
    }
}

struct ShareSheet: UIViewControllerRepresentable {
    let fileURL: URL
    let onCompletion: () -> Void
    
    func makeUIViewController(context: Context) -> UIActivityViewController {
//        print("Creating activity view controller for file: \(fileURL.path)")
        
        let controller = UIActivityViewController(activityItems: [fileURL], applicationActivities: nil)
        
        if let popover = controller.popoverPresentationController {
            popover.sourceView = UIApplication.shared.connectedScenes
                .compactMap { $0 as? UIWindowScene }
                .flatMap { $0.windows }
                .first { $0.isKeyWindow }?.rootViewController?.view
            popover.sourceRect = CGRect(x: UIScreen.main.bounds.midX, y: UIScreen.main.bounds.midY, width: 0, height: 0)
            popover.permittedArrowDirections = []
        }
        
        controller.completionWithItemsHandler = { activityType, completed, returnedItems, error in
            if let error = error {
                print("Share error: \(error)")
            } else if completed {
                print("Share completed with activity: \(activityType?.rawValue ?? "unknown")")
            } else {
                print("Share cancelled")
            }
            
            DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                onCompletion()
            }
        }
        
        return controller
    }
    
    func updateUIViewController(_ uiViewController: UIActivityViewController, context: Context) {

    }
}

// MARK: - Extract Button View
struct ExtractButton: View {
    @ObservedObject var healthManager: HealthDataManager
    let isPreparingFile: Bool
    
    var body: some View {
        Button(action: {
            healthManager.request()
        }) {
            HStack {
                if healthManager.isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        .scaleEffect(0.8)
                } else {
                    Image(systemName: "square.and.arrow.up")
                }
                Text(healthManager.isLoading ? "Extracting..." : "Extract")
            }
        }
        .padding()
        .compatibleGlassEffect()
        .disabled(healthManager.isLoading || isPreparingFile)
        .opacity((healthManager.isLoading || isPreparingFile) ? 0.6 : 1.0)
        .animation(.easeInOut(duration: 0.2), value: healthManager.isLoading)
        .animation(.easeInOut(duration: 0.2), value: isPreparingFile)
    }
}

// MARK: - Share Button View
struct ShareButtonView: View {
    let isPreparingFile: Bool
    let isFileReady: Bool
    let onShareTap: () -> Void
    let healthManager: HealthDataManager
    
    var body: some View {
        if isPreparingFile {
            HStack {
                ProgressView()
                    .progressViewStyle(CircularProgressViewStyle(tint: .white))
                    .scaleEffect(0.8)
                Text("Preparing file...")
            }
            .padding()
            .compatibleGlassEffect()
            .transition(.opacity.combined(with: .scale(scale: 0.9)))
            .animation(.easeInOut(duration: 0.3), value: isPreparingFile)
        } else if isFileReady {
            Button(action: onShareTap) {
                HStack {
                    Image(systemName: "paperplane")
                    Text("Share JSON")
                }
            }
            .padding()
            .compatibleGlassEffect()
            .transition(.opacity.combined(with: .scale(scale: 0.9)))
            .animation(.easeInOut(duration: 0.3), value: isFileReady)
        }
    }
}

struct ContentView: View {
    @StateObject private var healthManager = HealthDataManager()
    @State private var showShareSheet = false
    @State private var showErrorAlert = false
    @State private var isPreparingFile = false
    @State private var fileURL: URL?
    
    var body: some View {
        mainContentView
            .sheet(isPresented: $showShareSheet, onDismiss: sheetDismissed) {
                shareSheetContent
            }
            .alert("Extracting Error", isPresented: $showErrorAlert) {
                alertButton
            } message: {
                alertMessage
            }
            .onChange(of: healthManager.errorMessage) { oldValue, newValue in
                handleErrorChange(oldValue: oldValue, newValue: newValue)
            }
            .onChange(of: healthManager.isLoading) { oldValue, newValue in
                handleLoadingChange(oldValue: oldValue, newValue: newValue)
            }
            .onChange(of: healthManager.exportedJSON) { oldValue, newValue in
                handleJSONChange(oldValue: oldValue, newValue: newValue)
            }
    }
    
    // MARK: - View Components
    private var mainContentView: some View {
        ZStack {
            TextWall()
            
            VStack(spacing: 20) {
                extractButtonView
                shareButtonSection
            }
        }
    }
    
    private var extractButtonView: some View {
        ExtractButton(
            healthManager: healthManager, 
            isPreparingFile: isPreparingFile
        )
    }
    
    private var shareButtonSection: some View {
        Group {
            if healthManager.exportedJSON != nil {
                if isPreparingFile {
                    HStack {
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .white))
                            .scaleEffect(0.8)
                        Text("Preparing file...")
                    }
                    .padding()
                    .compatibleGlassEffect()
                    .transition(.opacity.combined(with: .scale(scale: 0.9)))
                } else {
                    Button(action: handleShareTap) {
                        HStack {
                            Image(systemName: "paperplane")
                            Text("Share JSON")
                        }
                    }
                    .padding()
                    .compatibleGlassEffect()
                    .transition(.opacity.combined(with: .scale(scale: 0.9)))
                }
            }
        }
        .animation(.easeInOut(duration: 0.3), value: isPreparingFile)
    }
    
    private var shareSheetContent: some View {
        Group {
            if let fileURL = fileURL {
                ShareSheet(fileURL: fileURL) {
                    cleanupSharedFile()
                }
            } else {
                Text("No file available for sharing")
                    .padding()
            }
        }
    }
    
    private var alertButton: some View {
        Button("OK") {
            healthManager.errorMessage = nil
        }
    }
    
    private var alertMessage: some View {
        Text(healthManager.errorMessage ?? "Unknown Error")
    }
    
    // MARK: - Event Handlers
    private func sheetDismissed() {

    }
    
    private func handleShareTap() {
//        print("Share button tapped")
        
        guard let jsonString = healthManager.exportedJSON else {
//            print("No JSON data available for sharing")
            return
        }
        
        isPreparingFile = true
        
        Task {
            do {
//                print("Creating JSON file in background...")
                let createdFileURL = try await createJSONFile(jsonString: jsonString)
                
                await MainActor.run {
                    self.fileURL = createdFileURL
                    self.isPreparingFile = false
                    self.showShareSheet = true
//                    print("File created and sharing sheet presented")
                }
            } catch {
                await MainActor.run {
                    self.isPreparingFile = false
                    self.healthManager.errorMessage = "Failed to create file: \(error.localizedDescription)"
//                    print("Error creating file: \(error)")
                }
            }
        }
    }
    
    private func handleErrorChange(oldValue: String?, newValue: String?) {
        showErrorAlert = (newValue != nil)
        if newValue != nil {
            isPreparingFile = false
            fileURL = nil
        }
    }
    
    private func handleLoadingChange(oldValue: Bool, newValue: Bool) {
        if newValue {
            isPreparingFile = false
            fileURL = nil
        }
    }
    
    private func handleJSONChange(oldValue: String?, newValue: String?) {
        if newValue != nil && oldValue == nil {
//            print("New JSON data available for sharing")
        }
    }
    
    // MARK: - Helper Methods
    private func generateFileName() -> String {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "yyyy-MM-dd-HH-mm-ss"
        return "HealthData_\(dateFormatter.string(from: Date())).json"
    }
    
    // MARK: - File Processing
    private func createJSONFile(jsonString: String) async throws -> URL {
        return try await withCheckedThrowingContinuation { continuation in
            DispatchQueue.global(qos: .userInitiated).async {
                do {
                    guard let cacheDirectory = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask).first else {
                        throw NSError(domain: "FileError", code: 1, userInfo: [NSLocalizedDescriptionKey: "Cannot access cache directory"])
                    }
                    
                    FileShareHelper.cleanupOldFiles()
                    
                    let fileName = self.generateFileName()
                    let fileURL = cacheDirectory.appendingPathComponent(fileName)
                    
                    guard !jsonString.isEmpty else {
                        throw NSError(domain: "DataError", code: 2, userInfo: [NSLocalizedDescriptionKey: "JSON data is empty"])
                    }
                    
                    try jsonString.write(to: fileURL, atomically: true, encoding: .utf8)
                    
                    if FileManager.default.fileExists(atPath: fileURL.path) {
                        let attributes = try FileManager.default.attributesOfItem(atPath: fileURL.path)
                        if let fileSize = attributes[.size] as? Int64, fileSize > 0 {
                            print("JSON file created successfully:")
                            print("   Path: \(fileURL.path)")
                            print("   Size: \(fileSize) bytes")
                            continuation.resume(returning: fileURL)
                        } else {
                            try? FileManager.default.removeItem(at: fileURL)
                            throw NSError(domain: "FileError", code: 3, userInfo: [NSLocalizedDescriptionKey: "Created file is empty"])
                        }
                    } else {
                        throw NSError(domain: "FileError", code: 4, userInfo: [NSLocalizedDescriptionKey: "File was not created"])
                    }
                } catch {
                    continuation.resume(throwing: error)
                }
            }
        }
    }
    
    private func cleanupSharedFile() {
        if let fileURL = fileURL {
            DispatchQueue.global(qos: .utility).async {
                try? FileManager.default.removeItem(at: fileURL)
                print("Cleaned up shared file: \(fileURL.lastPathComponent)")
            }
        }
        fileURL = nil
    }
}

#Preview {
    ContentView()
}
