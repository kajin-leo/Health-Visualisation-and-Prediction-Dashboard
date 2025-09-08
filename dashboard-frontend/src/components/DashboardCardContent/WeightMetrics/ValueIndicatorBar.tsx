
const ValueIndicatorBar = ({ min, max, currentVal, title, className, width, ...props }: { min: number, max: number, currentVal: number, title?: string, className?: string, width?: number, props?: React.ReactNode }) => {
    const percentage = (currentVal - min)/(max-min) * 100;
    return (
        <div id="indicator" className="w-full min-h-10 h-fit flex flex-col items-center">
            {title && (
                <h3 className="-mb-1 text-sm">{title}: {currentVal}</h3>
            )}
            <div className="w-full flex items-center gap-2">
                <h4 className={`${min >= 0 ? 'w-8 pl-1.5' : 'w-8'} text-left`}>{min}</h4>
                <div className={`relative w-full h-2`}>
                    <div id="bar" className="w-full h-full bg-linear-to-r/increasing from-yellow-400  to-red-600 rounded-full shadow-md/40 outline-2 outline-white/50" />
                    <div className='absolute h-3 -top-0.5 aspect-square bg-gray-200 rounded-full shadow-md/50 inset-shadow-xs/50 outline-2 outline-white'
                    style={{left:`calc(${percentage}% - 6px)`}}>
                        
                    </div>
                </div>
                <h4 className="w-8 text-right">{max}</h4>
            </div>
        </div>
    )
}

export default ValueIndicatorBar;