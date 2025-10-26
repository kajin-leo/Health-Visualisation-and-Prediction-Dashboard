import DashboardCard from "../../components/DashboardCard";
import FFQForm from "../../components/Survey/FFQForm";

const Survey = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-6">
      <DashboardCard className="text-md font-bold font-[Nunito] w-full max-w-7xl h-[90vh]">
        <div className="max-h-[80vh] overflow-y-auto pr-2">
        <FFQForm />
        </div>
      </DashboardCard>
    </div>
  );
};

export default Survey;
