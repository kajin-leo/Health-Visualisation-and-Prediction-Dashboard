//
//  HealthExtractService.swift
//  HealthDataExtractor
//
//  Created by 可人鹅 on 15/10/2025.
//

import HealthKit
internal import Combine

@MainActor
class HealthDataManager:ObservableObject {
    @Published var isLoading = false
    @Published var exportedJSON: String?
    @Published var errorMessage: String?
    
    var basicMetrics:HealthDataExport.BasicMetrics?
    var hourlyActivity: [HealthDataExport.HourlyActivity] = []
    var sleepStats: HealthDataExport.SleepStats?
    
    private let healthStore = HKHealthStore()
    public var healthDict = Dictionary<String, Any>()

    let typesToRead: Set<HKObjectType> = [
        HKObjectType.quantityType(forIdentifier: .height)!,
        HKObjectType.quantityType(forIdentifier: .bodyMass)!,
        HKObjectType.quantityType(forIdentifier: .bodyMassIndex)!,
        HKObjectType.quantityType(forIdentifier: .bodyFatPercentage)!,
        
        HKObjectType.quantityType(forIdentifier: .stepCount)!,
        HKObjectType.quantityType(forIdentifier: .distanceWalkingRunning)!,
        HKObjectType.quantityType(forIdentifier: .activeEnergyBurned)!,
        HKObjectType.categoryType(forIdentifier: .sleepAnalysis)!
    ]
    

    
    func request() {
        isLoading = true
        errorMessage = nil
        
        requestAuthorization {
            [weak self] success, error in
            guard let self = self else { return }
            
            if error != nil {
                self.errorMessage = "Failed!"
                self.isLoading = false
                return
            }
            
            if success {
                self.loadAllData { result in
                    switch result {
                    case .success():
                        self.exportToJSON()
                    case .failure(let error):
                        self.errorMessage = "Failed to load data: \(error.localizedDescription)"
                        self.isLoading = false
                    }
                }
            } else {
                self.errorMessage = "Authorization denied"
                self.isLoading = false
            }
        }
    }
    
    private func exportToJSON() {
//        print("Starting JSON export...")
//        print("Current data state:")
//        print("  - Basic metrics: \(String(describing: basicMetrics))")
//        print("  - Activity data count: \(hourlyActivity.count)")
//        print("  - Sleep stats: \(String(describing: sleepStats))")
        
        var missingData: [String] = []
        if basicMetrics == nil {
                missingData.append("Basic metrics (height, weight, BMI, body fat)")
            } else if let metrics = basicMetrics {
                var missingMetrics: [String] = []
                if metrics.height == 0 { missingMetrics.append("height") }
                if metrics.weight == 0 { missingMetrics.append("weight") }
                if metrics.bmi == 0 { missingMetrics.append("BMI") }
                if metrics.bfp == 0 { missingMetrics.append("body fat percentage") }
                
                if !missingMetrics.isEmpty {
                    missingData.append("Basic metrics (\(missingMetrics.joined(separator: ", ")))")
                }
            }
            
            if sleepStats == nil {
                missingData.append("Sleep data")
            } else if let sleep = sleepStats {
                if sleep.weekdaysAvg == 0 && sleep.weekendsAvg == 0 && sleep.totalAvg == 0 {
                    missingData.append("Sleep data (no sleep records found)")
                }
            }
            
            if hourlyActivity.isEmpty {
                missingData.append("Activity data (no exercise or movement records)")
            } else {
                let hasValidActivity = hourlyActivity.contains { activity in
                    activity.mvpaSeconds > 0 || activity.lightSeconds > 0
                }
                if !hasValidActivity {
                    missingData.append("Activity data (all records are zero)")
                }
            }
            
            if !missingData.isEmpty {
                let errorMessage = """
                Missing or incomplete data:
                
                • \(missingData.joined(separator: "\n• "))
                
                This might be because:
                - You haven't granted permission to all health data types
                - No data has been recorded in the Health app
                - You're using the iOS Simulator (limited HealthKit support)
                
                Please check your Health app and try again.
                """
                self.errorMessage = errorMessage
                self.isLoading = false
                return
            }
            
            let exportData = HealthDataExport(
                basicMetrics: basicMetrics!,
                activityData: hourlyActivity,
                sleepStatistics: sleepStats!
            )
        
        // Convert to JSON and set the exported JSON string
        do {
            let jsonData = try JSONEncoder().encode(exportData)
            self.exportedJSON = String(data: jsonData, encoding: .utf8)
        } catch {
            self.errorMessage = "Failed to export JSON: \(error.localizedDescription)"
        }
        
        self.isLoading = false
    }
    
    func loadAllData(completion: @escaping (Result<Void, Error>)->Void) {
        let group = DispatchGroup()
        group.enter()
        loadBasicMetrics {
            group.leave()
        }
        
        group.enter()
        loadActivityData {
            group.leave()
        }
        
        group.enter()
        loadSleepData {
            group.leave()
        }
        
        group.notify(queue: .main) { [weak self] in
            completion(.success(()))
        }
    }

    func requestAuthorization(completion: @escaping (Bool, Error?) -> Void) {
        guard HKHealthStore.isHealthDataAvailable() else {
            completion(false, NSError(domain: "HealthKit", code: -1,
                            userInfo: [NSLocalizedDescriptionKey: "HealthKit Not Available"]))
            return
        }
        healthStore.requestAuthorization(toShare: nil, read: typesToRead) {
            success, error in
            DispatchQueue.main.async {
                completion(success, error)
            }
        }
    }

    func fetchLatestValue(for identifier: HKQuantityTypeIdentifier, unit: HKUnit, completion:@escaping (Double?) -> Void) {
        guard let quantityType = HKQuantityType.quantityType(forIdentifier: identifier) else {
            completion(nil)
            return
        }
        
        let sortDescriptor = NSSortDescriptor(key: HKSampleSortIdentifierEndDate, ascending: false)
        
        let query = HKSampleQuery(sampleType: quantityType, predicate: nil, limit: 1, sortDescriptors: [sortDescriptor]) {
            query, samples, error in
            guard let sample = samples?.first as? HKQuantitySample else {
                completion(nil)
                return
            }
            
            let value = sample.quantity.doubleValue(for: unit)
            completion(value)
        }
        
        healthStore.execute(query)
    }

    private func loadBasicMetrics(completion: @escaping()->Void ) {
        let group = DispatchGroup()
        var height:Double = 0
        var weight:Double = 0
        var bmi:Double = 0
        var bfp:Double = 0
        
        group.enter()
        fetchLatestValue(for: .height, unit: .meterUnit(with: .centi)) { value in
            height = value ?? 0
//            print("Height: \(height) cm")
            group.leave()
        }
        
        group.enter()
        fetchLatestValue(for: .bodyMass, unit: .gramUnit(with: .kilo)) { value in
            weight = value ?? 0
//            print("Weight: \(weight) kg")
            group.leave()
        }
        
        group.enter()
        fetchLatestValue(for: .bodyMassIndex, unit: .count()) { value in
            bmi = value ?? 0
//            print("BMI: \(bmi)")
            group.leave()
        }
        
        group.enter()
        fetchLatestValue(for: .bodyFatPercentage, unit: .percent()) { value in
            bfp = value ?? 0
//            print("Body Fat: \(bfp * 100)%")
            group.leave()
        }
        
        group.notify(queue: .main) {
            [weak self] in
            self?.basicMetrics = HealthDataExport.BasicMetrics(height: height, weight: weight, bmi: bmi, bfp: bfp)
//            print("Basic metrics loaded: \(String(describing: self?.basicMetrics))")
            completion()
        }
    }
    
    private func loadActivityData(completion: @escaping ()->Void) {
        let calendar = Calendar.current
        let now = Date()
        let todayStart = calendar.startOfDay(for: now)
        
        guard let sevenDaysAgo = calendar.date(byAdding: .day, value: -7, to: todayStart) else {
            completion()
            return
        }
        
        fetchActivityDataByHour(startDate: sevenDaysAgo, endDate: now) { [weak self] data in
            DispatchQueue.main.async {
                let formatter = DateFormatter()
                formatter.dateFormat = "yyyy-MM-dd HH:mm:ss"
                formatter.timeZone = TimeZone.current
                
                self?.hourlyActivity = data.enumerated().map { index, dict in
                    HealthDataExport.HourlyActivity(date: formatter.string(from: dict["date"] as! Date),
                                   hour: dict["hour"] as! Int,
                                   day: index / 24,
                                   mvpaSeconds: dict["mvpa_seconds"] as! Int,
                                   lightSeconds: dict["light_seconds"] as! Int,
                                   mvpaTimes: dict["mvpa_times"] as! Int,
                                   lightTimes: dict["light_times"] as! Int)
                }
//                print("Activity data loaded: \(self?.hourlyActivity.count ?? 0) hours")
                if let activityData = self?.hourlyActivity {
                    let totalMVPA = activityData.reduce(0) { $0 + $1.mvpaSeconds }
                    let totalLight = activityData.reduce(0) { $0 + $1.lightSeconds }
//                    print("Total Exercise Time (MVPA): \(totalMVPA) seconds")
//                    print("Total Move Time (Light): \(totalLight) seconds")
                }
                completion()
            }
        }
    }
    
    private func loadSleepData(completion: @escaping ()->Void) {
        fetchSleepDataLast7Days { [weak self] stats in
            DispatchQueue.main.async {
                self?.sleepStats = HealthDataExport.SleepStats(weekdaysAvg: stats["weekdaysSleep"] ?? 0,
                                             weekendsAvg: stats["weekendsSleep"] ?? 0,
                                             totalAvg: stats["totalSleep"] ?? 0)
//                print("Sleep data loaded:")
//                print("  Weekdays avg: \(stats["weekdaysSleep"] ?? 0) seconds")
//                print("  Weekends avg: \(stats["weekendsSleep"] ?? 0) seconds")
//                print("  Total avg: \(stats["totalSleep"] ?? 0) seconds")
                completion()
            }
        }
    }

    func fetchActivityDataByHour(startDate: Date, endDate: Date, completion: @escaping([[String: Any]]) -> Void) {
        guard let stepType = HKQuantityType.quantityType(forIdentifier: .stepCount),
              let energyType = HKQuantityType.quantityType(forIdentifier: .activeEnergyBurned),
              let distanceType = HKQuantityType.quantityType(forIdentifier: .distanceWalkingRunning) else {
            completion([])
            return
        }
        
        let calendar = Calendar.current
        var hourlyData:[[String: Any]] = []
        let group = DispatchGroup()
        
        var currentDate = startDate
        while currentDate < endDate {
            let dayEnd = min(calendar.date(byAdding: .day, value: 1, to: calendar.startOfDay(for: currentDate))!, endDate)
            for hour in 0..<24 {
                guard let hourStart = calendar.date(bySettingHour: hour, minute: 0, second: 0, of: currentDate),
                      hourStart < dayEnd else {
                    continue
                }
                
                let hourEnd = min(calendar.date(byAdding: .hour, value: 1, to: hourStart)!, dayEnd)
                
                group.enter()
                fetchActivityForTimeRange(stepType: stepType, energyType: energyType, distanceType: distanceType, startDate: hourStart, endDate: hourEnd) {
                    steps, energy, distance in
                    
                    // 根据步数和消耗的能量来判断活动强度
                    // MVPA: 每小时步数 > 1000 或 活跃能量 > 50 卡路里
                    // Light: 有一定活动但不够MVPA标准
                    let isMVPA = steps > 1000 || energy > 50
                    let isLight = steps > 100 || energy > 10
                    
                    let mvpaSeconds = isMVPA ? Int(min(3600, steps * 1.5)) : 0  // 简化计算
                    let lightSeconds = (isLight && !isMVPA) ? Int(min(3600, steps * 1.2)) : 0
                    
                    hourlyData.append([
                        "date": hourStart,
                        "hour": hour,
                        "steps": Int(steps),
                        "energy": Int(energy),
                        "distance": distance,
                        "mvpa_seconds": mvpaSeconds,
                        "light_seconds": lightSeconds,
                        "mvpa_times": mvpaSeconds / 3,
                        "light_times": lightSeconds / 3
                    ])
                    
                    group.leave()
                }
            }
            
            guard let nextDay = calendar.date(byAdding: .day, value: 1, to:calendar.startOfDay(for: currentDate)) else {
                break
            }
            
            currentDate = nextDay
        }
        
        group.notify(queue: .main) {
            let sortedData = hourlyData.sorted {
                ($0["date"] as! Date) < ($1["date"] as! Date)
            }
            completion(sortedData)
        }
    }

    func fetchActivityForTimeRange(stepType: HKQuantityType, energyType: HKQuantityType, distanceType: HKQuantityType, startDate: Date, endDate: Date, completion: @escaping(Double, Double, Double) -> Void) {
        let group = DispatchGroup()
        var steps: Double = 0
        var energy: Double = 0
        var distance: Double = 0
        
        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: .strictStartDate)
        
        // Steps
        group.enter()
        let stepQuery = HKStatisticsQuery(quantityType: stepType, quantitySamplePredicate: predicate, options: .cumulativeSum) {
            _, statistics, _ in
            if let sum = statistics?.sumQuantity() {
                steps = sum.doubleValue(for: .count())
            }
            group.leave()
        }
        
        // Energy
        group.enter()
        let energyQuery = HKStatisticsQuery(quantityType: energyType, quantitySamplePredicate: predicate, options: .cumulativeSum) {
            _, statistics, _ in
            if let sum = statistics?.sumQuantity() {
                energy = sum.doubleValue(for: .kilocalorie())
            }
            group.leave()
        }
        
        // Walking & Running Distance
        group.enter()
        let distanceQuery = HKStatisticsQuery(quantityType: distanceType, quantitySamplePredicate: predicate, options: .cumulativeSum) {
            _, statistics, _ in
            if let sum = statistics?.sumQuantity() {
                distance = sum.doubleValue(for: .meter())
            }
            group.leave()
        }
        
        healthStore.execute(stepQuery)
        healthStore.execute(energyQuery)
        healthStore.execute(distanceQuery)
        
        group.notify(queue: .main) {
            completion(steps, energy, distance)
        }
    }

    func fetchSleepDataLast7Days(completion: @escaping([String: Double]) -> Void) {
        let calendar = Calendar.current
        let now = Date()
        let todayStart = calendar.startOfDay(for: now)
        
        guard let sevenDaysAgo = calendar.date(byAdding: .day, value: -7, to: todayStart) else {
            completion([:])
            return
        }
        
        fetchDailySleepData(startDate: sevenDaysAgo, endDate: todayStart) { dailySleepData in
            var weekdaysSleep:[Double] = []
            var weekendsSleep:[Double] = []
            
            for (date, sleepSeconds) in dailySleepData {
                let weekday = calendar.component(.weekday, from: date)
                if weekday == 1 || weekday == 7 {
                    weekendsSleep.append(sleepSeconds)
                } else {
                    weekdaysSleep.append(sleepSeconds)
                }
            }
            
            let allSleep = weekendsSleep + weekdaysSleep
            
            let weekdaysAvg = weekdaysSleep.isEmpty ? 0 : weekdaysSleep.reduce(0, +) / Double(weekdaysSleep.count) / 3600
            let weekendsAvg = weekendsSleep.isEmpty ? 0 : weekendsSleep.reduce(0, +) / Double(weekendsSleep.count) / 3600
            let overallAvg = allSleep.isEmpty ? 0 : allSleep.reduce(0, +) / Double(allSleep.count) / 3600
            
//            print("Sleep calculation debug:")
//            print("  Raw weekdays data: \(weekdaysSleep)")
//            print("  Raw weekends data: \(weekendsSleep)")
//            print("  Weekdays avg (hours): \(weekdaysAvg)")
//            print("  Weekends avg (hours): \(weekendsAvg)")
//            print("  Overall avg (hours): \(overallAvg)")
            
            let result: [String: Double] = [
                "weekdaysSleep": weekdaysAvg,
                "weekendsSleep": weekendsAvg,
                "totalSleep": overallAvg
            ]
            
            completion(result)
        }
        
    }

    func fetchDailySleepData(startDate: Date, endDate: Date, completion: @escaping([Date: Double]) -> Void) {
        guard let sleepType = HKObjectType.categoryType(forIdentifier: .sleepAnalysis) else {
            completion([:])
            return
        }
        
        let predicate = HKQuery.predicateForSamples(withStart: startDate, end: endDate, options: .strictStartDate)
        let query = HKSampleQuery(sampleType: sleepType, predicate: predicate, limit: HKObjectQueryNoLimit, sortDescriptors: nil) { _, samples, error in
            guard let samples = samples as? [HKCategorySample], error == nil else {
                completion([:])
                return
            }
            
            var dailySleep: [Date: Double] = [:]
            let calendar = Calendar.current
            
            for sample in samples {
                let isAsleep:Bool = sample.value == HKCategoryValueSleepAnalysis.asleepCore.rawValue ||
                                    sample.value == HKCategoryValueSleepAnalysis.asleepDeep.rawValue ||
                                    sample.value == HKCategoryValueSleepAnalysis.asleepREM.rawValue ||
                                    sample.value == HKCategoryValueSleepAnalysis.asleepUnspecified.rawValue
                
                if isAsleep {
                    let duration = sample.endDate.timeIntervalSince(sample.startDate)
                    let sleepDay = calendar.startOfDay(for: sample.endDate)
                    dailySleep[sleepDay, default: 0] += duration
                }
            }
            
            completion(dailySleep)
        }
        
        healthStore.execute(query)
    }
    
}

struct HealthDataExport:Codable {
    let basicMetrics: BasicMetrics
    let activityData: [HourlyActivity]
    let sleepStatistics: SleepStats
    
    struct BasicMetrics: Codable {
        let height: Double
        let weight: Double
        let bmi: Double
        let bfp: Double
    }
    
    struct HourlyActivity: Codable {
        let date: String
        let hour: Int
        let day: Int
        let mvpaSeconds: Int
        let lightSeconds: Int
        let mvpaTimes: Int
        let lightTimes: Int
    }
    
    struct SleepStats: Codable {
        let weekdaysAvg: Double
        let weekendsAvg: Double
        let totalAvg: Double
    }
}
