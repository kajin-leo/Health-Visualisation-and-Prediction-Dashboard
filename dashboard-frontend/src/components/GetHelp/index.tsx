import React from "react";

type SectionIntro = {
  id: string;
  title: string;
  summary: string;
  details: string[];
  where?: string;
};

const SectionIntroCard: React.FC<SectionIntro> = ({ title, summary, details, where }) => {
  return (
    <div className="rounded-xl border border-slate-200 bg-white/80 p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold text-slate-800">{title}</h3>
        {where ? (
          <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs text-slate-600">{where}</span>
        ) : null}
      </div>
      <p className="mt-2 text-sm text-slate-700">{summary}</p>
      {details?.length ? (
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-700">
          {details.map((d, i) => (
            <li key={i}>{d}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
};

export default SectionIntroCard;