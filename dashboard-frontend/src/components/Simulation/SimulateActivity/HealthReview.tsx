import { Spinner } from "@heroui/react";
import { useEffect, useState } from "react";

type ReviewData = {
    groundTruth: string;
    prediction?: {
        newClassification: string;
        possibility: number;
    };
    isLoading: boolean;
}

const HealthLabelMappedTextColor = (label: string) => {
    switch (label) {
        case "VL":
            return "text-lime-600 dark:text-lime-300";
        case "HFZ":
            return "text-green-600 dark:text-green-300";
        case "NI":
            return "text-orange-500 dark:text-orange-200";
        case "NIHR":
            return "text-red-600 dark:text-red-200";
        default:
            return "text-slate-600 dark:text-slate-200"
    }
}

const HealthLabelMappedBackgroundColor = (label: string) => {
    switch (label) {
        case "VL":
            return "bg-lime-500/20 dark:bg-lime-700/20";
        case "HFZ":
            return "bg-green-400/20 dark:bg-green-800/20";
        case "NI":
            return "bg-orange-500/20 dark:bg-orange-700/20";
        case "NIHR":
            return "bg-red-600/20 dark:bg-red-800/20";
        default:
            return "bg-slate-400/20 dark:bg-slate-800/20"
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
        <div className={`rounded-2xl outline-3 border-2 outline-gray-200/50 dark:outline-gray-700/50 border-white dark:border-gray-800 shadow-lg/20 inset-shadow-sm/20 w-fit overflow-clip`}>
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
                                reviewData!.isLoading ?
                                    (
                                        <div className="flex flex-col items-center justify-center bg-stone-100 text-stone-600 gap-4 p-4 pt-2">
                                            <h3>Prediction</h3>
                                            {/* <h1 className="text-5xl font-[Nunito] font-bold">?</h1> */}
                                            <Spinner color="default" size="sm"/>
                                        </div>
                                    ) : (<></>)

                            }

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