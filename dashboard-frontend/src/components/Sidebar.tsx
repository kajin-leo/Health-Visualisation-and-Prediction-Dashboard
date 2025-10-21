import { Button, Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger, User } from '@heroui/react'
import { Cog, Gauge, CircleQuestionMark, ChartLine, LogOut, SquareUser, BicepsFlexed, FlaskConical } from 'lucide-react'

import SidebarMenuItem from './SidebarMenuItem'
import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SideBarUserIndicator from './SidebarUserIndicator'
import { apiClient } from '../service/axios'
import Logo from '../assets/豹豹Logo.svg'
import LogoDark from '../assets/豹豹Logo-Dark.svg'
import { useUser } from '../context/UserContext'

const sidebarData = {
    navMain: [
        {
            title: 'Dashboard',
            icon: Gauge,
            url: '/'
        },
        {
            title: 'Simulate',
            icon: FlaskConical,
            url: '/simulate'
        }
    ],
    navBottoms: [
        {
            title: 'Settings',
            icon: Cog,
            url: '/settings'
        },
        {
            title: 'Get Help',
            icon: CircleQuestionMark,
            url: '/help'
        }
    ]
}

function SideBar({ className, ...props }: { className?: string, props?: React.ReactNode }) {
    const navigate = useNavigate();
    const { user, loading, error } = useUser();

    const location = useLocation();

    if (loading)
        return (<div>Loading...</div>);

    if (error){
        localStorage.clear();
        navigate('/login');
        return (<div>Error:{error}</div>);}

    // console.log(user);

    const isItemSelected = (itemUrl: string) => {
        return location.pathname === itemUrl;
    };

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    }

    return (
        <div id='sidebar-container' className={`w-full h-full flex flex-col relative justify-between ${className || ''} p-2`}>
            <div id="sidebar-bg" className='w-full h-full absolute inset-0 -z-10 backdrop-brightness-100 dark:backdrop-brightness-75 dark:backdrop-saturate-20 dark:backdrop-contrast-150 rounded-xl border-1 border-white/100 dark:border-white/60 dark:bg-purple-900/40 shadow-blue-500 dark:shadow-purple-700 shadow-xl/40' >
                <div className='w-full h-full bg-conic/oklab from-pink-50/80 dark:from-purple-600/40 via-45% via-violet-200/60 dark:via-violet-500/60 to-blue-50/80 dark:to-purple-600/40 blur-2xl'/>
            </div>


            <div id='header-area' className='flex flex-col gap-5'>
                <a onClick={()=>{navigate('/')}}>
                    <div className='h-20 p-5 flex items-center gap-2 cursor-pointer'>
                        <img src={Logo} className='h-full block dark:hidden' />
                        <img src={LogoDark} className='h-full hidden dark:block' />
                        <h1 className='font-bold select-none text-2xl text-transparent bg-gradient-to-br from-slate-400 to-slate-500 dark:to-pink-200 bg-clip-text'>
                            CS79-1
                        </h1>
                    </div>
                </a>

                <div id='nav-main' className='flex flex-col gap-1'>
                    {sidebarData.navMain.map((item) => (
                        <SidebarMenuItem item={item} key={item.title} isSelected={isItemSelected(item.url)} />
                    ))}
                </div>
            </div>
            <div id='bottom-area' className='flex flex-col gap-5'>
                <div id='bottom-navigate' className='flex flex-col gap-1'>
                    {sidebarData.navBottoms.map((item) => (
                        <SidebarMenuItem item={item} key={item.title} isSelected={isItemSelected(item.url)} />
                    ))}
                </div>
                <Popover showArrow placement='right'>
                    <PopoverTrigger>
                        <SideBarUserIndicator role="button" username={user ? `${user.firstName} ${user.lastName}` : ''} />
                    </PopoverTrigger>
                    <PopoverContent>
                        <Listbox>
                            <ListboxItem key='profile' startContent={<SquareUser />} onPress={() => navigate('/profile')} >My Profile</ListboxItem>
                            <ListboxItem key='logout' className='text-danger' color='danger' startContent={<LogOut />} onPress={logout}>Sign Out</ListboxItem>
                        </Listbox>
                    </PopoverContent>
                </Popover>
                
            </div>
        </div>
    );
}

export default SideBar;