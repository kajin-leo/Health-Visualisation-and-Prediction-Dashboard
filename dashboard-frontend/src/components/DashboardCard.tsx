import type React from "react";

const DashboardCard = ({ id, className, children, ...props }: { id?:string, className?: string, children?: React.ReactNode, props?: React.ReactNode }) => {
    return (
        <div className={`${className || ''} relative rounded-2xl shadow-lg overflow-clip hover:scale-[1.01] transition-all duration-350 p-4`}>
            <div id='visual effects' className="inset-0 absolute w-full h-full pointer-events-none">
                <div className="absolute -z-50 opacity-20 w-full h-full border-1 border-white/100 bg-radial-[at_-50%_0%] rounded-2xl from-white/100 via-60% via-slate-50/60 to-slate-300/50 pointer-events-none" />
                <div className="absolute z-10 w-full h-full opacity-40 bg-linear-to-b from-gray-200/40 via-5% via-gray-300/40 to-white/0 backdrop-saturate-50 pointer-events-none" />
                <div className="absolute z-20 opacity-50 border-3 rounded-2xl border-white inset-1 blur-xl pointer-events-none" />
                <div className="absolute z-30 opacity-30 w-full h-full border-0 rounded-2xl border-white pointer-events-none" />
                <div className="absolute -z-40 opacity-60 w-full h-full bg-white" />
            </div>
            {children}
        </div>
    );
}

export default DashboardCard;