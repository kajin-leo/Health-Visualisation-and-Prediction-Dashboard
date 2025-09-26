import { Spinner } from "@heroui/react";
import { useEffect, useState } from "react";

type ReviewData = {
    groundTruth: string;
    prediction?: {
        newClassification: string;
        possibility: number;
    }
}

const HealthLabelMappedOutlineColor = (label: string) => {
    switch (label) {
        case "NI":
            return "outline-yellow-600";
        case "HFZ":
            return "outline-green-600";
        case "NIHR":
            return "outline-orange-500";
        case "VL":
            return "outline-red-600";
        default:
            return "outline-slate-600"
    }
}

const HealthLabelMappedTextColor = (label: string) => {
    switch (label) {
        case "NI":
            return "text-yellow-600";
        case "HFZ":
            return "text-green-600";
        case "NIHR":
            return "text-orange-500";
        case "VL":
            return "text-red-600";
        default:
            return "text-slate-600"
    }
}

const HealthLabelMappedBackgroundColor = (label: string) => {
    switch (label) {
        case "NI":
            return "bg-yellow-500/20";
        case "HFZ":
            return "bg-green-400/20";
        case "NIHR":
            return "bg-orange-500/20";
        case "VL":
            return "bg-red-600/20";
        default:
            return "bg-slate-400/20"
    }
}

const HealthReview = ({ data }: { data?: ReviewData }) => {
    const [isDataReady, setIsDataReady] = useState(false);
    const [reviewData, setReviewData] = useState<ReviewData>();

    useEffect(() => {
        if (data) {
            setReviewData(data);
            setIsDataReady(true);
        }
    }, [data]);

    return (
        <div className={`rounded-2xl outline-3 border-2 outline-gray-200/50 border-white shadow-lg/20 inset-shadow-sm/20 w-fit overflow-clip`}>
            {
                !isDataReady ? (
                    <div className={`bg-slate-400 flex flex-col p-4 gap-2 ${HealthLabelMappedTextColor(reviewData?.prediction?.newClassification ?? '--')}`}>
                        <h2 className="text-xs opacity-50">Ground Truth</h2>
                        <Spinner className="opacity-50" color="default" />
                    </div>
                ) :
                    (
                        <>
                            <div className={`p-4 pb-2 flex flex-col justify-between items-center ${HealthLabelMappedTextColor(reviewData?.groundTruth ?? '--')} ${HealthLabelMappedBackgroundColor(reviewData?.groundTruth ?? '--')}`}>
                                <h2 className="text-xs opacity-50">Ground Truth</h2>
                                <h1 className="text-xl font-[Nunito] font-semibold">{reviewData?.groundTruth ?? '--'}</h1>
                            </div>
                            {
                                reviewData!.prediction ?
                                    (
                                        <div className={`p-4 pt-2 flex flex-col justify-between items-center ${HealthLabelMappedTextColor(reviewData?.prediction?.newClassification ?? '--')} ${HealthLabelMappedBackgroundColor(reviewData?.prediction?.newClassification ?? '--')}`}>
                                            <h3>Prediction</h3>
                                            <h1 className="text-5xl font-[Nunito] font-bold">{reviewData?.prediction?.newClassification ?? '--'}</h1>
                                            <h2 className="text-lg">{reviewData?.prediction?.possibility ?? '--'}% Probability</h2>
                                        </div>
                                    ) : (<></>)
                            }
                        </>
                    )
            }
        </div>
    )
}

export default HealthReview;

export type { ReviewData };