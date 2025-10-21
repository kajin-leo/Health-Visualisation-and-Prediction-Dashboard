// contexts/UserContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiClient } from '../service/axios'
import { useNavigate } from 'react-router-dom'

interface User {
    username: string
    firstName: string
    lastName: string
    avatar?: string
    userId: number
    appearance: string
}

interface UserContextType {
    user: User | null
    loading: boolean
    error: string | null
    fetchUserInfo: () => Promise<void>
    refreshUserInfo:() => Promise<void>
    clearUserInfo:() => void
    appearance: string
}

export const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [appearance, setAppearance] = useState("auto");
    const navigate = useNavigate();
    const root = window.document.documentElement;

    const fetchUserInfo = async () => {
        try {
            setLoading(true)
            const response = await apiClient.get('/user/info')
            // console.log(response);
            const userData = response.data;
            setUser(userData);
        } catch (err) {
            setError('Network Error')
            localStorage.clear();
            navigate('/login');
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=> {
        if (user?.appearance === 'Light') {
                setAppearance('light');
                root.classList.remove('dark');
            } else if (user?.appearance === 'Dark') {
                setAppearance('dark');
                root.classList.add('dark');
            } else {
                setAppearance('auto');
                const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
                const handleChange = (e) => {
                    if(e.matches) {
                        root.classList.add('dark');
                    } else {
                        root.classList.remove('dark');
                    }
                }

                handleChange(mediaQuery);
                mediaQuery.addEventListener('change', handleChange);
                return () => {
                    mediaQuery.removeEventListener('change', handleChange);
                }
            }
    }, [user])

    const refreshUserInfo = async() => {
        await fetchUserInfo();
    }

    const clearUserInfo = () => {
        setUser(null);
        setLoading(false);
        setError(null);
    }

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (token) {
            fetchUserInfo()
        } else {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        const handleLocalStorage = (e:StorageEvent) =>{
            if (e.key === "token") {
                if (e.newValue) {
                    fetchUserInfo();
                } else {
                    clearUserInfo();
                }
            }
        }
        window.addEventListener('storage', handleLocalStorage);
        return () => removeEventListener('storage', handleLocalStorage);
    }, []);

    return (
        <UserContext.Provider value={{ user, loading, error, fetchUserInfo, refreshUserInfo, clearUserInfo, appearance }}>
            {children}
        </UserContext.Provider>
    )
}

export function useUser() {
    const context = useContext(UserContext)
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider')
    }
    return context
}