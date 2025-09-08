import {Button, Card, CardBody, CardFooter} from '@heroui/react'
import DashboardCard from '../../components/DashboardCard';
import WeightMetrics from '../../components/DashboardCardContent/WeightMetrics/WeightMetrics';
import SleepGauges from "../../components/DashboardCardContent/Sleep/SleepGauges.tsx";
import FoodIntake from "../../components/DashboardCardContent/FoodIntake/FoodIntake.tsx";
import WlgrWlgxCards from "../../components/DashboardCardContent/WlgrWlgx/WlgrWlgxCards.tsx";
import BMI from "../../components/BmiCard.tsx"
import FatMuscleWaterCard from "../../components/DashboardCardContent/Body/FatMuscleWaterCard.tsx";
const Home = () => {
    return(
        <div className='w-full h-full py-4 grid grid-cols-1 auto-rows-[calc((100%-var(--spacing)*8)/3)] md:grid-cols-6 lg:grid-cols-12 gap-4 col-span-2 row-span-3 overflow-y-scroll pl-2 pr-4'>
            <DashboardCard id='avg daily intake' className='text-4xl font-light md:col-span-2 lg:col-span-4'>
                <FoodIntake/>
            </DashboardCard>

            <DashboardCard id='percentages' className='md:col-span-4 lg:col-span-4'>
                <FatMuscleWaterCard />
            </DashboardCard>

            <DashboardCard id='Basic' className='row-span-2 md:col-span-2 lg:col-span-4'>
                <BMI />
            </DashboardCard>

            <DashboardCard id='wlgr wlgx' className='md:col-span-2 lg:col-span-5'>
                <WlgrWlgxCards />
            </DashboardCard>

            <DashboardCard id='sleeping duration' className='md:col-span-2 lg:col-span-3'>
                <SleepGauges />
            </DashboardCard>

            <DashboardCard id='lsmz' className='md:col-span-2 lg:col-span-7'>
                <WeightMetrics />
            </DashboardCard>

            <DashboardCard id='metrics' className='md:col-span-2 lg:col-span-5'>

            </DashboardCard>

            <DashboardCard>

            </DashboardCard>
        </div>
    )
}

export default Home;