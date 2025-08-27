import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authClient } from '../../service/axios';
import { Alert, Button, Input } from '@heroui/react';
import { CircleX, XCircle } from 'lucide-react';
import Logo from '../../assets/豹豹Logo.svg';
import { useUser } from '../../context/UserContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorResponse, setErrorResponse] = useState('');
    const [isUsernameInvalid, setUsernameInvalid] = useState(false);
    const [isPasswordInvalid, setPasswordInvalid] = useState(false);
    const { refreshUserInfo, clearUserInfo } = useUser()

    const navigate = useNavigate();

    const handleLogin = async () => {
        setIsLoading(true);
        setUsernameInvalid(false);
        setPasswordInvalid(false);
        clearUserInfo();

        if(username.trim() === '' || username.length < 3) {
            setUsernameInvalid(true);
        }

        if(password.trim() === '' || password.length < 6){
            setPasswordInvalid(true);
            setIsLoading(false);
            return;
        }

        try {
            const { data } = await authClient.post('/auth/login', { username, password });
            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('role', data.role);
            await refreshUserInfo();
            if (data.role === 'USER') {
                navigate('/')
            } else {
                navigate('/ops')
            }
        } catch (error) {
            console.error(error);
            setErrorResponse(error.code === 'ERR_NETWORK' ? error.message : (error.response.data.error || error.response.data.errors[0]));
        } finally {
            setIsLoading(false);
        }
    }
    return (
        <form
        onSubmit={(e)=>{
            e.preventDefault();
            handleLogin();
        }}>
            <div className="bg-white/80 backdrop-blur-xl outline-1 outline-white/20 flex flex-col items-center gap-4 rounded-3xl p-4 min-w-80 shadow-xl">
            <div className='flex flex-col items-center my-2'>
                <img src={Logo} className='w-15' />
                <h1 className='text-2xl font-semibold'>Login</h1>
            </div>
            <Input label='Username'
                placeholder='Please enter your username'
                value={username}
                onValueChange={setUsername}
                errorMessage="Please enter a valid username. "
                isInvalid={isUsernameInvalid}
            />

            <Input label='Password'
                placeholder='Please enter your password'
                type='password'
                value={password}
                onValueChange={setPassword}
                errorMessage="Please enter a valid password. "
                isInvalid={isPasswordInvalid}
            />
            <Button type="submit" color='primary' isLoading={isLoading} onPress={handleLogin} className='mt-4'>
                Sign In
            </Button>
            {errorResponse != '' ? <Alert icon={<CircleX stroke='white' />} color='danger'>{errorResponse}</Alert> : ''}
        </div>
        </form>
        
    )
}

export default Login;