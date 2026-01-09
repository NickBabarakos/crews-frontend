import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import adminService from '../../api/adminService';


export const useAdminAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [token, setToken] = useState('');

    const navigate = useNavigate();

    useEffect(()=> {
        const storedToken = sessionStorage.getItem('admin_token');
        if(storedToken){
            verifyToken(storedToken, true);
        } else{
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const verifyToken = async (inputToken, isAutoLogin = false) => {
        setLoading(true);
        try{
            await adminService.verifyAuth(inputToken);

            //Success
            sessionStorage.setItem('admin_token', inputToken);
            setToken(inputToken);
            setIsAuthenticated(true);
            if(!isAutoLogin) toast.success("Admin Access Granted");
        } catch (err){
            console.error("Auth failed", err);
            sessionStorage.removeItem('admin_token');
            setIsAuthenticated(false);
            
            if(!isAutoLogin){
                toast.error("Ivalid Admin Secret! Redirecting...");
                navigate('/home');
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async (inputSecret) => {
       if(!inputSecret) return toast.error("Please enter a secret");
       
       try{
        setLoading(true);
        const data = await adminService.login(inputSecret);

        if(data.success && data.token){
            await verifyToken(data.token);
        }
       } catch(err){
        toast.error("Invalid Secret!");
        setLoading(false);
       }
    };

    const logout = () => {
        sessionStorage.removeItem('admin_token');
        setToken('');
        setIsAuthenticated(false);
        toast("Logged Out");
        navigate('/home');
    };

    return {isAuthenticated, token, login, logout, loading};
};