import { Avatar, AvatarIcon, Button, Card } from "@heroui/react"
import { forwardRef } from "react";

const SideBarUserIndicator = forwardRef(({ children, className, username, userAvatarUrl, ...props }, ref) => {
    
    
    return (
        <div role="button" tabIndex={0} ref={ref} className="w-full h-max-[40px] p-2 flex gap-3 items-end rounded-lg hover:shadow-xs hover:bg-white dark:hover:bg-violet-900/50 transition-all active:bg-white active:inset-shadow-sm" {...props}>
            <div className='aspect-square'>
                <Avatar classNames={{
                    base: 'bg-linear-to-b from-sky-700 dark:from-violet-400 to-sky-50 dark:to-violet-700',
                    icon: 'text-white/80'
                }}
                    icon={<AvatarIcon />} src={userAvatarUrl || ''} />
            </div>
            <div className="w-full h-full flex-col">
                <h2 className="text-black/70 dark:text-white/70 text-sm">
                    Hello,
                </h2>
                <h1 className="text-medium">
                    {username || 'Jane Doe'}
                </h1>
            </div>
        </div>
    );
})

export default SideBarUserIndicator;