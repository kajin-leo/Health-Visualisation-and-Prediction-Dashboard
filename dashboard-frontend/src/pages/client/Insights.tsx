import { useState } from "react";
import DashboardCard from "../../components/DashboardCard";
import { Button, Spinner, Tab, Tabs } from "@heroui/react";
import { apiClient } from "../../service/axios";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { API_CONFIG } from "../../config/api";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface InsightsResponse {
    cached: boolean
    taskId: string
    insights: insights;
}

interface insights {
    activitiesAnalysis: string;
    bodyInfoAnalysis: string;
    bioEAnalysis: string;
    intakeAnalysis: string;
    overallInsights: string;
}

const tabs = [
    {
        id: 0,
        label: 'Overall',
        address: 'overallInsights'
    },
    {
        id: 1,
        label: 'Activities',
        address: 'activitiesAnalysis'
    },
    {
        id: 2,
        label: 'Body Info',
        address: 'bodyInfoAnalysis'
    },
    {
        id: 3,
        label: 'Bioelectrical',
        address: 'bioEAnalysis'
    },
    {
        id: 4,
        label: 'Dietary Intake',
        address: 'intakeAnalysis'
    },
]

const Insights = () => {
    const [response, setResponse] = useState<insights>();
    const [selected, setSelected] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [errors, setErrors] = useState(false);

    const generateInsights = async () => {
        if (isGenerating) return;
        try {
            setIsGenerating(true);
            setErrors(false);

            const response = await apiClient.get('/insights');
            const data: InsightsResponse = response.data;
            if (data.cached) {
                setResponse(data.insights);
            } else {
                const eventSource = API_CONFIG.FULL_URL + '/insights/stream/' + data.taskId;
                const token = localStorage.getItem('token');
                await fetchEventSource(eventSource, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    },
                    onmessage: (msg) => {
                        if (msg.event === 'result') {
                            const result: insights = JSON.parse(msg.data);
                            setResponse(result);
                        }
                    },
                    onerror: (error) => {
                        throw error;
                    }
                })
            }
        } catch (error) {
            console.error(error);
            setErrors(true);
        } finally {
            setIsGenerating(false);
        }
    }

    return (
        <div className="w-full h-full p-4 pl-2">
            <DashboardCard className="w-full h-full" noHover={true}>
                <div className="mb-2 h-full flex flex-col gap-3 p-5">
                    <h1 className="w-fit opacity-100 rounded-lg text-gray-800 dark:text-gray-200 select-none pl-1 text-lg tracking-tight font-bold font-[Nunito] flex-shrink-0">
                        Insights
                    </h1>

                    <div className="flex flex-col gap-3 flex-1 min-h-0">
                        <div className="flex-shrink-0">
                            <Button isDisabled={isGenerating} onPress={() => generateInsights()} variant={"shadow"} color={"primary"}>
                                {isGenerating && (<Spinner size="sm" color={"default"} />)}
                                Generate
                                {isGenerating && " (Process may take about 2 minutes)"}
                            </Button>
                        </div>

                        <div className="flex-1 min-h-0 flex flex-col">
                            {response && (
                                <div className="flex-1 min-h-0 overflow-hidden flex flex-col gap-2 items-center">
                                    <Tabs selectedKey={selected.toString()} onSelectionChange={(e) => setSelected(parseInt(e.toString()))} variant={"light"} radius="full" className="rounded-full bg-gray-400/30 dark:bg-gray-900/30 inset-shadow-sm/20">
                                        {(tabs.map((value) => (
                                            <Tab key={value.id} title={value.label} />
                                        )))}
                                    </Tabs>
                                    <div className="bg-white/50 dark:bg-gray-900/50 rounded-2xl flex-1 min-h-0 p-5 overflow-y-scroll inset-shadow-sm/10">
                                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]} components={{
                                            p: ({ node, ...props }) => (
                                                <p className="mb-4" {...props} />
                                            ),
                                            table: ({ node, ...props }) => (
                                                <div className="m-2">
                                                    <table className="p-3 m-3 border border-b-0" {...props} />
                                                </div>
                                            ),
                                            thead: ({ node, ...props }) => (
                                                <thead className="m-2" {...props} />
                                            ),
                                            th: ({ node, ...props }) => (
                                                <th className="border-b p-2" {...props} />
                                            ),
                                            td: ({ node, ...props }) => (
                                                <td className="border-b p-2" {...props} />
                                            ),
                                            tr: ({ node, ...props }) => (
                                                <tr className="p-2" {...props} />
                                            ),
                                            hr: ({ node, ...props }) => (
                                                <hr className="m-2" {...props} />
                                            ),
                                        }}>
                                            {response[tabs[selected].address]}
                                        </ReactMarkdown>
                                    </div>
                                </div>
                            )}

                            {errors && (
                                <div className="bg-red-300/50 rounded-2xl p-5">
                                    <p className="select-none">Sorry, insights service is currently unavailable. </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

            </DashboardCard>
        </div>
    )
}

export default Insights;