import { useEffect, useState } from "react";

type MockData = {
    groundTruth: string;
    newClassification: string;
    possibility: number;
}

const HealthLabelMappedOutlineColor = (label: string) => {
    switch(label) {
        case "NI":
            return "outline-yellow-600";
        case "HFZ":
            return "outline-green-600";
        case "NIHR":
            return "outline-orange-500";
        case "VL":
            return "outline-red-600";
    }
}

const HealthLabelMappedTextColor = (label: string) => {
    switch(label) {
        case "NI":
            return "text-yellow-600";
        case "HFZ":
            return "text-green-600";
        case "NIHR":
            return "text-orange-500";
        case "VL":
            return "text-red-600";
    }
}

const HealthLabelMappedBackgroundColor = (label: string) => {
    switch(label) {
        case "NI":
            return "bg-yellow-500/20";
        case "HFZ":
            return "bg-green-400/20";
        case "NIHR":
            return "bg-orange-500/20";
        case "VL":
            return "bg-red-600/20";
    }
}

const HealthReview = ({ MockData }: { MockData?: MockData }) => {
    const [groundTruth, setGroundTruth] = useState('');
    const [predictedLabel, setPredictedLabel] = useState('');
    const [probability, setProbability] = useState(0.0);

    useEffect(() => {
        if (MockData) {
            setGroundTruth(MockData.groundTruth);
            setPredictedLabel(MockData.newClassification);
            setProbability(MockData.possibility);
        }
    }, [MockData]);

    return (
        <div className={`rounded-2xl outline-3 border-2 outline-gray-200/50 border-white shadow-lg/20 inset-shadow-sm/20 w-fit overflow-clip`}>
            <div className={`p-4 pb-2 flex flex-col justify-between items-center ${HealthLabelMappedTextColor(groundTruth)} ${HealthLabelMappedBackgroundColor(groundTruth)}`}>
                <h2 className="text-xs opacity-50">Ground Truth</h2>
                <h1 className="text-xl font-[Nunito] font-semibold">{groundTruth}</h1>
            </div>
            <div className={`p-4 pt-2 flex flex-col justify-between items-center ${HealthLabelMappedTextColor(predictedLabel)} ${HealthLabelMappedBackgroundColor(predictedLabel)}`}>
                <h3>Prediction</h3>
                <h1 className="text-5xl font-[Nunito] font-bold">{predictedLabel}</h1>
                <h2 className="text-lg">{probability}% Probability</h2>
            </div>
        </div>
    )
}

export default HealthReview;