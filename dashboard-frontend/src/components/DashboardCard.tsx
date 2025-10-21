import type React from "react";

const DashboardCard = ({ id, className, children, noHover, ...props }: { id?:string, className?: string, children?: React.ReactNode, noHover?:boolean, props?: React.ReactNode }) => {
    return (
        <div className={`${className || ''} relative rounded-2xl shadow-lg overflow-clip ${noHover ? '' : 'hover:scale-[1.01]'} transition-all duration-350 p-4`}>
            <div id='visual effects' className="inset-0 absolute w-full h-full pointer-events-none">
                <div className="absolute -z-50 opacity-20 w-full h-full border-1 border-white/100 dark:border-white/20 bg-radial-[at_-50%_0%] rounded-2xl from-white/100 dark:from-gray-900 via-60% via-slate-50/60 dark:via-slate-700/60 to-slate-300/50 dark:to-slate-700/50 pointer-events-none" />
                <div className="absolute z-10 w-full h-full opacity-40 bg-linear-to-b from-gray-200/40 via-5% via-gray-300/40 to-white/0 backdrop-saturate-50 pointer-events-none" />
                <div className="absolute z-20 opacity-50 border-3 rounded-2xl border-white inset-1 blur-xl pointer-events-none" />
                <div className="absolute z-30 opacity-30 w-full h-full border-1 rounded-2xl border-white pointer-events-none" />
                <div className="absolute -z-40 opacity-60 w-full h-full bg-white dark:bg-gray-900" />
            </div>
            <div id="Card Content" className="w-full h-full">
                {children}
            </div>
        </div>
    );
}

export default DashboardCard;