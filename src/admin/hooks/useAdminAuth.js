import {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import adminService from '../../api/adminService';


export const useAdminAuth = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const [secret, setSecret] = useState('');

    const navigate = useNavigate();

    useEffect(()=> {
        const storedSecret = sessionStorage.getItem('admin_secret');
        if(storedSecret){
            verifySecret(storedSecret, true);
        } else{
            setLoading(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const verifySecret = async (inputSecret, isAutoLogin = false) => {
        setLoading(true);
        try{
            await adminService.verifyAuth(inputSecret);

            //Success
            sessionStorage.setItem('admin_secret', inputSecret);
            setSecret(inputSecret);
            setIsAuthenticated(true);
            if(!isAutoLogin) toast.success("Admin Access Granted");
        } catch (err){
            console.error("Auth failed", err);
            sessionStorage.removeItem('admin_secret');
            setIsAuthenticated(false);
            
            if(!isAutoLogin){
                toast.error("Ivalid Admin Secret! Redirecting...");
                navigate('/home');
            }
        } finally {
            setLoading(false);
        }
    };

    const login = async (input) => {
       if(!input) return toast.error("Please enter a secret");
       await verifySecret(input);
    };

    const logout = () => {
        sessionStorage.removeItem('admin_secret');
        setSecret('');
        setIsAuthenticated(false);
        toast("Logged Out");
        navigate('/home');
    };

    return {isAuthenticated, secret, login, logout, loading};
};