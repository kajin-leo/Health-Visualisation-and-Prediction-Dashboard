import { Button, Listbox, ListboxItem, Popover, PopoverContent, PopoverTrigger, User } from '@heroui/react'
import { Cog, Gauge, CircleQuestionMark, ChartLine, LogOut, SquareUser } from 'lucide-react'
import SidebarMenuItem from './SidebarMenuItem'
import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SideBarUserIndicator from './SidebarUserIndicator'
import { apiClient } from '../service/axios'
import Logo from '../assets/豹豹Logo.svg'
import { useUser } from '../context/UserContext'

const sidebarData = {
    navMain: [
        {
            title: 'Dashboard',
            icon: Gauge,
            url: '/'
        },
        {
            title: 'Interactable Chart',
            icon: ChartLine,
            url: '/chart-demo'
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

    if (error)
        return (<div>Error:{error}</div>);

    // console.log(user);

    const isItemSelected = (itemUrl: string) => {
        return location.pathname === itemUrl;
    };

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    }

    return (
        <div id='sidebar-container' className={`w-full h-full flex flex-col justify-between ${className || ''}`}>
            <div id='header-area' className='flex flex-col gap-5'>
                <a onClick={()=>{navigate('/')}}>
                    <div className='h-20 p-5 flex items-center gap-2 cursor-pointer'>
                        <img src={Logo} className='h-full' />
                        <h1 className='font-bold select-none text-2xl text-transparent bg-gradient-to-br from-slate-400 to-slate-500 bg-clip-text'>
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
                            <ListboxItem key='profile' startContent={<SquareUser />}>My Profile</ListboxItem>
                            <ListboxItem key='logout' className='text-danger' color='danger' startContent={<LogOut />} onPress={logout}>Sign Out</ListboxItem>
                        </Listbox>
                    </PopoverContent>
                </Popover>
                
            </div>
        </div>
    );
}

export default SideBar;