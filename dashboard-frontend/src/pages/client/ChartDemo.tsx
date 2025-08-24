import { Button } from '@heroui/react';
import DraggableChart from '../../components/DraggableChart'
import { useState } from 'react';

const ChartDemo = () => {
    const [simulatedOutput, setSimulatedOutput] = useState<string[]>([]);
    const [sampleData, setSampleData] = useState<number[]>([10, 20, 40, 15, 50, 20, 35, 25]);
    const dragEnd = (callback) => {
        setSimulatedOutput(prev => [...prev, `User dragged data point at col-${callback.index}, changing it to ${callback.value}`]);
    }

    const generateSampleData = () => {
        const data:number[] = [];
        for (let i = 0; i < 10; i++) {
            data.push(Math.floor(Math.random() * 100));
        }
        // chartRef.value?.updateChart(data);
        // return;
        setSampleData(data);
    };

    return (
        <div className='w-full h-full flex flex-col items-center justify-start gap-2'>
            <DraggableChart initialData={sampleData}
                xAxisLabel={'X-AXIS'} yAxisLabel={'Y-AXIS'}
                datasetLabel={'Sample'} title={'demo'}
                onDragEnd={(callback) => dragEnd(callback)} />

            <div className='flex gap-2'>
                <Button onPress={() => {generateSampleData()}}>
                    Generate Random Data
                </Button>

                <Button onPress={() => (setSimulatedOutput([]))}>
                    Clear Output
                </Button>
            </div>

            <div className='rounded-2xl bg-white/30 inset-shadow-sm flex flex-col gap-2 p-2 min-h-20 w-full'>
                {simulatedOutput.map((output, index) => (
                    <p key={index}>{output}</p>
                ))}
            </div>

        </div>
    )
}

export default ChartDemo;