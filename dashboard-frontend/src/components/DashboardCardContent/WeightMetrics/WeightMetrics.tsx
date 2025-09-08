import { Clock } from 'lucide-react';
import { apiClient } from '../../../service/axios';
import { useEffect, useState, useRef } from 'react';
import RadarChart from './RadarChart';
import { Tab, Tabs } from '@heroui/react';
import ValueIndicatorBar from './ValueIndicatorBar';
// import background from '../../assets/DataAcknowledgeBG.png'

interface ZScores {
    iotf: number;
    cachera: number;
    oms: number;
    cdc: number;
}

interface weightmetrics {
    iotfL: number,
    iotfM: number,
    iotfS: number,
    iotfP: number,
    iotfC: string,
    cacheraL: number,
    cacheraM: number,
    cacheraS: number,
    cacheraP: number,
    cacheraC: string,
    omsL: number,
    omsM: number,
    omsS: number,
    omsP: number,
    omsC: string,
    cdcL: number,
    cdcM: number,
    cdcS: number,
    cdcP: number,
    cdcC: string,
}

const WeightMetrics = () => {
    const [zScores, setZScores] = useState<ZScores | null>(null);
    const [weightMetric, setWeightMetric] = useState<weightmetrics | null>(null);

    useEffect(() => {
        const fetchWeightStatus = async () => {
            try {
                const response = await apiClient.get('/static/weight-metrics');
                const data = response.data;
                const zdata: ZScores = {
                    iotf: data.iotfZ,
                    cachera: data.cacheraZ,
                    oms: data.omsZ,
                    cdc: data.cdcZ
                }
                const weightdata: weightmetrics = {
                    iotfC: data.iotfC,
                    iotfL: data.iotfL,
                    iotfM: data.iotfM,
                    iotfS: data.iotfS,
                    iotfP: data.iotfP,
                    cacheraC: data.cacheraC,
                    cacheraL: data.cacheraL,
                    cacheraM: data.cacheraM,
                    cacheraS: data.cacheraS,
                    cacheraP: data.cacheraP,
                    omsC: data.omsC,
                    omsL: data.omsL,
                    omsM: data.omsM,
                    omsS: data.omsS,
                    omsP: data.omsP,
                    cdcC: data.cdcC,
                    cdcL: data.cdcL,
                    cdcM: data.cdcM,
                    cdcS: data.cdcS,
                    cdcP: data.cdcP,
                }
                console.log(data);
                setWeightMetric(weightdata);
                setZScores(zdata);
            } catch (error) {
                const data: ZScores = {
                    iotf: 0,
                    cachera: 0,
                    oms: 0,
                    cdc: 0
                };

                const weightdata: weightmetrics = {
                    iotfC: "No Comment",
                    iotfL: 0,
                    iotfM: 0,
                    iotfS: 0,
                    iotfP: 0,
                    cacheraC: "No Comment",
                    cacheraL: 0,
                    cacheraM: 0,
                    cacheraS: 0,
                    cacheraP: 0,
                    omsC: "No Comment",
                    omsL: 0,
                    omsM: 0,
                    omsS: 0,
                    omsP: 0,
                    cdcC: "No Comment",
                    cdcL: 0,
                    cdcM: 0,
                    cdcS: 0,
                    cdcP: 0,
                }
                setWeightMetric(weightdata);
                setZScores(data);
            }
        };
        fetchWeightStatus();
    }, []);

    const metrics = [
        {
            name: 'IOTF',
            id: 0
        }, {
            name: 'Cachera',
            id: 1
        }, {
            name: 'OMS',
            id: 2
        }, {
            name: 'CDC',
            id: 3
        }
    ];
    const valueRange = {
        L: {
            min: -5,
            max: 5
        },
        M: {
            min: 2,
            max: 90
        },
        S: {
            min: 0,
            max: 0.3
        },
        P: {
            min: 0,
            max: 100
        }
    }
    const vars = ['L', 'M', 'S'];
    const decimalCount = 2;

    return (
        <div className='w-full h-full justify-between flex flex-col overflow-visible'>
            <div className='flex justify-between items-baseline'>
                <h1 className="text-2xl mt-2 ml-2 flex-shrink-0">
                    Weight Status
                </h1>
                <div className='flex gap-2 text-sm bg-white p-1 px-2 rounded-full shadow-md/20'>
                    <div className='flex items-center gap-1'>
                        <div className='bg-yellow-400 w-4 h-4 rounded-full' />
                        <h4>Low</h4>
                    </div>
                    <div className='flex items-center gap-1'>
                        <div className='bg-sky-600 w-4 h-4 rounded-full' />
                        <h4>Good</h4>
                    </div>
                    <div className='flex items-center gap-1'>
                        <div className='bg-red-600 w-4 h-4 rounded-full' />
                        <h4>High</h4>
                    </div>
                </div>
            </div>
            
            <div className='flex-1 flex gap-0 overflow-hidden min-h-0'>
                <div className='aspect-square h-full flex-shrink-0'>
                    {zScores && (
                        <RadarChart data={zScores} title='Z-Score' />
                    )}
                </div>

                <div className='flex-1 h-full min-w-0 flex-col overflow-visible'>
                    {
                        weightMetric && <Tabs items={metrics} className='h-full items-center flex-1' variant={'light'} isVertical={false} placement='end' size='sm' classNames={{base: 'h-full', panel:'h-full', tabContent:'h-full w-full', tabList:'flex-shrink-0', tabWrapper:'h-full items-center'}}>
                            {(item) => (
                                <Tab key={item.id} title={item.name} className='w-full h-full' >
                                    <div className='flex items-center justify-between flex-col w-full h-full'>
                                        {
                                            vars.map((varName) => {
                                                return (
                                                    <ValueIndicatorBar min={valueRange[varName].min} max={valueRange[varName].max} currentVal={weightMetric[item.name.toLowerCase() + varName].toFixed(decimalCount)} title={varName} />
                                                    // <h3 className='text-sm'>{varName}: {weightMetric[item.name.toLowerCase() + varName].toFixed(decimalCount)}</h3>
                                                )
                                            })
                                        }
                                        <ValueIndicatorBar min={valueRange.P.min} max={valueRange.P.max} currentVal={weightMetric[item.name.toLowerCase() + 'P'].toFixed(decimalCount)} title={'Percentile(%)'} />
                                        <h3 className='text-sm'>Comment: {weightMetric[item.name.toLowerCase() + 'C']}</h3>
                                    </div>
                                </Tab>
                            )}
                        </Tabs>
                    }
                </div>
            </div>
        </div>
    )
};

export default WeightMetrics;