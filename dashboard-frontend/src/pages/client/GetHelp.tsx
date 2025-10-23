import React, { useMemo, useState } from "react";
import SectionIntroCard from "../../components/GetHelp"; // ← 指向 index.tsx

const GetHelp: React.FC = () => {
  const [q, setQ] = useState("");
  const sections = useMemo(() => [
    {
      id: "overview",
      title: "Dashboard Overview",
      summary: "A quick summary of key cards and indicators on the dashboard.",
      details: [
        "Hover to see exact values on charts",
        "Use legends to show or hide series",
      ],
      where: "Dashboard top",
    },
    {
      id: "activity",
      title: "Activity Charts",
      summary:
        "Daily trends for MVPA and Light Activity with area comparison.",
      details: [
        "Hover to inspect values",
        "Click legend items to filter series",
      ],
      where: "Dashboard",
    },
    {
      id: "profile",
      title: "Profile",
      summary: "Manage your account information and basic preferences.",
      details: [
        "Edit name and basic info",
        "Update password if supported",
      ],
      where: "Profile page",
    },
    {
      id: "faq",
      title: "FAQ",
      summary: "Common questions and quick troubleshooting tips.",
      details: [
        "Check typical data and login issues",
        "Contact support if the problem persists",
      ],
      where: "Get Help",
    },
  ], []);
  const filtered = useMemo(() => {
    const k = q.trim().toLowerCase();
    if (!k) return sections;
    return sections.filter(s =>
      s.title.toLowerCase().includes(k) ||
      s.summary.toLowerCase().includes(k) ||
      s.details.some(d => d.toLowerCase().includes(k)) ||
      (s.where||"").toLowerCase().includes(k)
    );
  }, [q, sections]);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-2 text-slate-800 dark:text-slate-200">Get Help</h1>
      <input
        value={q}
        onChange={(e)=>setQ(e.target.value)}
        placeholder="Search: dashboard / activity / profile / faq..."
        className="w-full rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map(s => (
          <SectionIntroCard key={s.id} {...s} />
        ))}
      </div>
    </div>
  );
};

export default GetHelp;
