import { useState, useEffect, useRef, useContext } from 'react'
import { Routes, Route, useNavigate } from 'react-router-dom'
import ProtectedRoute from './config/ProtectedRoute'
import SideBar from './components/Sidebar'
import ClientHome from './pages/client/Home'
import ChartDemo from './pages/client/ChartDemo'
import OpsHome from './pages/ops/Home'
import Login from './pages/auth/Login'
import Simulation from './pages/client/Simulation'
import Unauthorized from './pages/auth/Unauthorized'
import { UserProvider } from './context/UserContext'
import { useUser } from './context/UserContext'
import { CircularProgress } from '@heroui/react'
import Profile from './pages/client/Profile'
// import { Settings } from 'lucide-react'
// import Setting from './pages/setting/Setting'
import Register from './pages/auth/Register'
import Survey from './pages/client/Survey'
import Insights from './pages/client/Insights'

function ClientLayout({ children }) {
    const { loading, error } = useUser();
    const userLightColorScheme = "from-blue-100 via-40% via-violet-50 to-blue-100 brightness-90 saturate-200";
    const userDarkColorScheme = "dark:from-indigo-800 dark:via-fuchsia-200 dark:to-indigo-800 dark:brightness-80 dark:saturate-150"

    if (loading) {
        return (
            <div className={`fixed w-full h-full bg-conic ${userLightColorScheme} ${userDarkColorScheme} blur-2xl flex items-center py-2`}>
                <div className='w-full h-full bg-white/20 backdrop-blur-3xl flex items-center justify-center'>
                    <div>
                        <CircularProgress label="Loading..." />
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="fixed w-full h-screen min-h-[650px] flex">
            <div className={`absolute -z-100 w-full h-full bg-conic ${userLightColorScheme} ${userDarkColorScheme} blur-2xl`} />
            <div className='w-[250px] m-4 mr-2 flex-shrink-0'>
                <SideBar className='w-full' />
            </div>
            <div id='dashboard' className='w-full overflow-visible'>
                    {children}
            </div>
        </div>
    )
}

function OpsLayout({ children }) {
    return (
        <div className='fixed dark w-full h-full bg-gradient-to-bl from-sky-800 to-cyan-950 text-white flex items-center justify-center p-2'>
            {children}
        </div>
    )
}

function AuthLayout({ children }) {
    const authLightColorScheme = "from-pink-50 to-cyan-100"
    const authDarkColorScheme = "dark:from-pink-800/50 dark:to-cyan-800"

    return (
        <div className={`fixed w-full h-full bg-gradient-to-br ${authLightColorScheme} ${authDarkColorScheme} flex justify-center items-center p-2`}>
            {children}
        </div>
    )
}

function App() {
    return (
        <UserProvider>
            <Routes>
                {/* Client-end Routing */}
                <Route path="/" element={
                    <ProtectedRoute requiredRole={['USER']}>
                        <ClientLayout>
                            <ClientHome />
                        </ClientLayout>
                    </ProtectedRoute>

                } />

                <Route path='/simulate' element={
                    <ClientLayout>
                        <Simulation />
                    </ClientLayout>
                } />
                
                <Route path='/survey' element={
                    <ClientLayout>
                        <Survey />
                    </ClientLayout>
                } />

                <Route path='/insights' element={
                    <ClientLayout>
                        <Insights />
                    </ClientLayout>
                } />

                <Route path="/profile" element={
                    <ProtectedRoute requiredRole={['USER']}>
                        <ClientLayout>
                            <Profile />
                        </ClientLayout>
                    </ProtectedRoute>
                } />


                {/* Ops-end Routing */}
                <Route path="/ops" element={
                    <ProtectedRoute requiredRole={['ADMIN', 'SUPERADMIN']}>
                        <OpsLayout>
                            <OpsHome />
                        </OpsLayout>
                    </ProtectedRoute>

                } />

                <Route path="/login" element={
                    <AuthLayout>
                        <Login />
                    </AuthLayout>
                } />

                <Route path="/register" element={
                    <AuthLayout>
                        <Register />
                    </AuthLayout>
                } />

                <Route path='/unauthorized' element={
                    <AuthLayout>
                        <Unauthorized />
                    </AuthLayout>
                } />

               {/* <Route path="/settings" element={
                    <ProtectedRoute requiredRole={['USER']}>
                        <ClientLayout>
                            <Setting />
                        </ClientLayout>
                    </ProtectedRoute>
                /> 
                } />*/}
            </Routes>
        </UserProvider>

    )
}

export default App
