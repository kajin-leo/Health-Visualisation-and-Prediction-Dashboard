import { useState, useEffect, useRef } from 'react'
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
import GetHelp from './pages/client/GetHelp'

function ClientLayout({ children }) {
    const { loading, error } = useUser();

    if (loading) {
        return (
            <div className="fixed w-full h-full bg-conic from-blue-100 via-40% via-violet-50 to-blue-100 blur-2xl brightness-90 saturate-200 flex items-center py-2">
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
            <div className='absolute -z-100 w-full h-full bg-conic from-blue-100 via-40% via-violet-50 to-blue-100 blur-2xl brightness-90 saturate-200' />
            <div className='w-[250px] m-4 mr-2 flex-shrink-0'>
                <SideBar className='w-full' />
            </div>
            <div id='dashboard' className='flex-1 overflow-visible'>
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
    return (
        <div className='fixed w-full h-full bg-gradient-to-br from-pink-50 to-cyan-100 flex justify-center items-center p-2'>
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

                <Route path="/profile" element={
                    <ProtectedRoute requiredRole={['USER']}>
                        <ClientLayout>
                            <Profile />
                        </ClientLayout>
                    </ProtectedRoute>
                } />

                                <Route path="/profile" element={
                    <ProtectedRoute requiredRole={['USER']}>
                        <ClientLayout>
                            <Profile />
                        </ClientLayout>
                    </ProtectedRoute>
                    
                } />
                                <Route path="/get-help" element={
                    <ProtectedRoute requiredRole={['USER']}>
                        <ClientLayout>
                            <GetHelp />
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

                <Route path='/unauthorized' element={
                    <AuthLayout>
                        <Unauthorized />
                    </AuthLayout>
                } />
            </Routes>
        </UserProvider>

    )
}

export default App
