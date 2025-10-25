import DashboardCard from "../../components/DashboardCard";
import FFQForm from "../../components/Survey/FFQForm";

const Survey = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center p-6">
      <DashboardCard title="Food Frequency Questionnaire (FFQ)">
        <FFQForm />
      </DashboardCard>
    </div>
  );
};

export default Survey;
