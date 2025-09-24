import DashboardCard from '../../components/DashboardCard';
import WeightMetrics from '../../components/DashboardCardContent/WeightMetrics/WeightMetrics';
import SleepGauges from "../../components/DashboardCardContent/Sleep/SleepGauges.tsx";
import FoodIntakeWrapper from "../../components/DashboardCardContent/FoodIntake/FoodIntakeWrapper.tsx";
import WlgrWlgxCards from "../../components/DashboardCardContent/WlgrWlgx/WlgrWlgxCards.tsx";
import BmiCard from "../../components/DashboardCardContent/Bmi/BmiCard.tsx"
import FatMuscleWaterCard from "../../components/DashboardCardContent/Body/FatMuscleWaterCard.tsx";
import WorkoutOverview from '../../components/DashboardCardContent/WorkoutOverview/WorkoutOverview.tsx';
const Home = () => {
    return (
        <div className='w-full h-full py-4 grid grid-cols-1 auto-rows-[calc((100%-var(--spacing)*8)/3)] md:grid-cols-6 lg:grid-cols-15 gap-4 col-span-2 row-span-3 overflow-y-scroll pl-2 pr-4'>
            <DashboardCard id='workout' className='md:col-span-2 lg:col-span-12'>
                <WorkoutOverview />
            </DashboardCard>

            <DashboardCard id='Basic' className=' md:col-span-2 lg:col-span-3'>
                <BmiCard showLabels={true} />
            </DashboardCard>

            <DashboardCard id='avg daily intake' className='text-4xl font-light md:col-span-2 lg:col-span-5'>
                <FoodIntakeWrapper />
            </DashboardCard>

            <DashboardCard id='percentages' className='md:col-span-4 lg:col-span-5'>
                <FatMuscleWaterCard />
            </DashboardCard>

            <DashboardCard id='wlgr wlgx' className='md:col-span-2 lg:col-span-5'>
                <WlgrWlgxCards />
            </DashboardCard>

            <DashboardCard id='sleeping duration' className='md:col-span-2 lg:col-span-4'>
                <SleepGauges />
            </DashboardCard>

            <DashboardCard id='lsmz' className='md:col-span-2 lg:col-span-11'>
                <WeightMetrics />
            </DashboardCard>


        </div>
    )
}

export default Home;