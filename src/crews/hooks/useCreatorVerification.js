import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { verifyCreatorHandle, verifyCreatorKey, checkCreatorName } from '../../api/creatorService';

/**
 * VERIFICATION LOGIC HOOK
 * -----------------------
 * Manages the User Identity verification process.
 * 
 * State Machine (verificationStep):
 * - 'idle': Initial state
 * - 'checking': API request in progress.
 * - 'found': Creator found (ask "Is this you?").
 * - 'confirmed': User verified.
 * - 'not_found' / 'valid_key_no_creator': New user flows.
 */

export function useCreatorVerification(myKeys){
    const [verificationStep, setVerificationStep] = useState('idle'); //'idle', 'checking', 'found', 'not_found', 'valid_key_no_creator', 'confirmed'
    const [creatorIdentity, setCreatorIdentity] = useState(null);
    const [manualName, setManualName] = useState('');
    const [inputType, setInputType] = useState('handle');
    const [socialInput, setSocialInput] = useState('');
    const [keyInput, setKeyInput] = useState('');

    const resetVerification = () => {
        setVerificationStep('idle');
        setCreatorIdentity(null);
        setManualName('');
        setSocialInput('');
        setKeyInput('');
        setInputType('handle');
    };

     const verifyHandle = async(e) => {
        if(e && e.preventDefault) e.preventDefault();
        const cleanInput = socialInput.trim();

        if(!cleanInput) return;
        setVerificationStep('checking');
        try{
            const data = await verifyCreatorHandle(cleanInput);
            if(data.status === 'FOUND'){
                setCreatorIdentity(data.creator);
                setVerificationStep('found');
            } else {
                setVerificationStep('not_found');
            }
        } catch(err){
            console.error(err);
            if(err.response && err.response.status === 404){
                setVerificationStep('not_found');
                return;
            }
            toast.error("Verification failed. Please check the URL/Handle");
            setVerificationStep('idle');
        }
    };

    const verifyKey = async (e) => {
        if(e && e.preventDefault) e.preventDefault();
            if(!keyInput.trim()) return;
            setVerificationStep('checking');
            try{
                const data = await verifyCreatorKey(keyInput);
                if(data.status === 'CREATOR_FOUND'){
                    setCreatorIdentity(data.creator);
                    setVerificationStep('found');
                } else if(data.status === 'VALID_KEY_NO_CREATOR'){
                    setVerificationStep('valid_key_no_creator');
                } else {
                    toast.error("Invalid Public Key. This key does not exist in our database");
                    setVerificationStep('idle');
                }
            } catch(err){
                console.error(err);
                toast.error("Verification failed");
                setVerificationStep('idle');
            }
    };

    const handleAutoFillKey = () => {
        if(myKeys?.publicKey){
            setKeyInput(myKeys.publicKey);
        } else {
            toast.error("No Public Key found in your browser storage");
        }
    };

    const checkNameAvailability = async (name) =>{
        if(!name || !name.trim()) return false;
        try{
            const data = await checkCreatorName(name);
            return data.exists;
        } catch (e){
            console.error("Name check failed", e);
            throw e;
        }

    };

    return{
        verificationStep, setVerificationStep,
        creatorIdentity, setCreatorIdentity,
        manualName, setManualName,
        inputType, setInputType,
        socialInput, setSocialInput,
        keyInput, setKeyInput,
        verifyHandle,
        verifyKey,
        handleAutoFillKey,
        resetVerification,
        checkNameAvailability
    };
}