import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import Logo from '../../assets/豹豹就这样哭.svg';

const Unauthorized = () => {
    const navigate = useNavigate();

    const logout = () => {
        localStorage.clear();
        navigate('/login');
    }

    return (
        <div className="flex flex-col gap-8 items-center">
            <img src={Logo} className="max-w-80" />
            <div className="flex flex-col items-center gap-2">
                <h1 className="text-6xl font-bold bg-gradient-to-br from-slate-400 dark:from-slate-200 to-slate-500 dark:to-slate-400 bg-clip-text text-transparent">
                    Unauthorised
                </h1>
                <h2 className="text-xl text-slate-600 dark:text-slate-200">
                    Sorry! You are not authorised for this page. What about going back? 
                </h2>
            </div>
            <div className="bg-gradient-to-b from-gray-50/80 dark:from-gray-900/70 to-white/70 dark:to-gray-800/50 p-3 rounded-full flex gap-10 items-center dark:outline-1 dark:outline-white/20 justify-between mx-auto shadow-xl backdrop-blur-lg backdrop-saturate-200">
                <Button color="primary" className="bg-teal-800/40 dark:bg-teal-500/40" radius="full">Go Back</Button>
                <Button color="danger" className="bg-red-600 dark:bg-red-600/80" onPress={logout} radius="full">Logout</Button>
            </div>
        </div>

    );
}

export default Unauthorized;