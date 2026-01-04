import { useState, useEffect } from "react";
import { Outlet, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import apiClient from "../api/client";
import {Toaster } from 'react-hot-toast';
import Header from "../components/layout/Header";
import Sidebar from "../components/layout/Sidebar";
import landscapeWarning from '../assets/landscape-warning.png';

const MainLayout = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();

    useEffect(()=> {
        const checkSharedCrew = async () => {
            const crewId = searchParams.get('crew');

            if(crewId){
                try{
                    const res = await apiClient.get(`/api/crews/${crewId}/context`);
                    const {mode} = res.data;

                    let targetMode = `grandVoyage`;
                    switch(mode) {
                        case 'grand_voyage': targetMode = 'grandVoyage'; break;
                        case 'garp_challenge': targetMode = 'garpsChallenge'; break;
                        case 'forest_of_training': targetMode = 'forestOfTraining'; break;
                        case 'pirate_king_adventures': targetMode = 'pirateKingAdventures'; break;
                        case 'kizuna_clash': targetMode = 'kizunaClash'; break;
                        case 'treasure_map': targetMode = 'treasureMap'; break;
                        case 'coliseum': targetMode = 'coliseum'; break;
                        default: targetMode = 'grandVoyage';
                    }
                    if(!location.pathname.includes(targetMode)){
                    navigate(`/${targetMode}?${searchParams.toString()}`, {replace: true});
                    }
                } catch(error){
                    console.error("Error resolving crew context", error);
                }
            }
        };
        if(searchParams.get('crew')){
        checkSharedCrew();
        }
    }, [searchParams, navigate, location.pathname]);

    useEffect(()=>{
        const handleResize = () => {
            if(window.innerWidth > 1024){
                setIsMobileMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return ()=> window.removeEventListener('resize', handleResize);

    }, []);

    return(
        <div className="app-container">
            <div className="landscape-warning">
                <div className="warning-content">
                    <img src={landscapeWarning} alt="Usopp Panic" className="usopp-img" />
                        <div className="text-container">
                            <h1>NAMIIIII! WE'RE OFF COURSE!</h1>
                            <p>
                                The log pose is broken in landscape mode! <br />
                                Please rotate your device back to <strong>Portrait</strong> to continue the adventure.
                            </p>
                            <small>(Landscape support coming soon! Let the Great Captain Usopp handle it)</small>
                        </div>
                    </div>
                </div>
        
                <Toaster
                position="bottom-center"
                toastOptions={{
                    style: {
                    background: 'var(--border-light)',
                    color: 'var(--text-main)'
                    
                },
            }}
        />
    
      <Header 
        onToggleMobileMenu={()=> setIsMobileMenuOpen(!isMobileMenuOpen)} 
        onHomeClick={()=>{navigate('/home')}}
        />

      <div className = "content-wrapper">

        <Sidebar
            isOpen={isMobileMenuOpen}
            onClose={()=> setIsMobileMenuOpen(false)}
        />

        <div className="main-content">
            <Outlet/>
        </div>
    </div>
</div>  
    
    )
};

export default MainLayout;