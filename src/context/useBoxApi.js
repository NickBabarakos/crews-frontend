import {useState, useCallback} from 'react';
import{
    restoreBoxService,
    updateBoxService,
    createBoxService,
    getOtherBoxService
} from '../api/collectionService';

export const useBoxApi = () =>{
    const [isLoadingOther, setIsLoadingOther] = useState(false);

    const restoreBox = useCallback(async (secretKey) => {
        try{
            const data = await restoreBoxService(secretKey);
            if(data.success){
                return{
                    success: true,
                    boxData: data.boxData,
                    favorites: data.favorites || [],
                    publicKey: data.publicKey
                };
            }
            return {success: false};
        } catch (err){
            console.error("Restore failed:", err);
            return {success: false, error: err};
        }
    }, []);

    const updateBox = useCallback(async (secretKey, boxData, favorites) => {
        if(!secretKey) return false;
        try{
            await updateBoxService(secretKey, boxData, favorites);
            return true;
        } catch (err){
            console.error("Cloud save failed", err);
            return false;
        }
    }, []);

    const createBox = useCallback(async (initialData, favorites) => {
        try{
            const data = await createBoxService(initialData, favorites);
            if(data.success){
                return{
                    success: true,
                    keys: {
                        publicKey: data.publicKey,
                        secretKey: data.secretKey
                    }
                };
            }
            return {success: false};
        } catch(err){
            console.error("Create box failed", err);
            return {success: false, error: err};
        }
    }, []);

    const getOtherBox = useCallback(async (publicKey) => {
        setIsLoadingOther(true);
        try{
            const data = await getOtherBoxService(publicKey);
            return {success: true, boxData: data.boxData};
        } catch (err){
            console.error("View Box failed", err);
            return{ success: false};
        } finally{
            setIsLoadingOther(false);
        }
    }, []);

    return{
        restoreBox,
        updateBox,
        createBox,
        getOtherBox,
        isLoadingOther
    };
};