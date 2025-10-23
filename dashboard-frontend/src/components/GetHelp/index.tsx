import React from "react";
import DashboardCard from "../DashboardCard";

type SectionIntro = {
  id: string;
  title: string;
  summary: string;
  details: string[];
  where?: string;
};

const SectionIntroCard: React.FC<SectionIntro> = ({ title, summary, details, where }) => {
  return (
    <DashboardCard className="h-full">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-slate-800 dark:text-slate-200">{title}</h3>
        {where ? (
          <span className="shrink-0 rounded-full bg-slate-100 dark:bg-slate-700 px-2.5 py-0.5 text-xs text-slate-600 dark:text-slate-300">{where}</span>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{summary}</p>
      {details?.length ? (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700 dark:text-slate-300">
          {details.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      ) : null}
    </DashboardCard>
  );
};

export default SectionIntroCard;