import './styles/Variables.css';
import './styles/App.css';
import { CollectionProvider } from './context/CollectionContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

import MainLayout from './layouts/MainLayout';
import HomeView from './home/HomeView';
import CharactersPage from './pages/CharactersPage';
import BannersPage from './pages/BannersPage';
import CreatorsPage from './pages/CreatorsPage';
import CrewsPage from './pages/CrewsPage';
import AdminPanel from './admin/AdminPanel';

const queryClient = new QueryClient();

function App(){

    return(
    <QueryClientProvider client={queryClient}>
        <CollectionProvider>
            <Toaster 
                position="top-center"
                containerStyle={{
                    zIndex: 99999
                }}
                toastOptions={{
                    className: 'toast-notification',

                    success:{
                        className: 'toast-notification success',
                        iconTheme: {
                            primary: 'var(--color-success)',
                            secondary: 'var(--bg-card)',
                        },
                    },

                    error: {
                        className: 'toast-notification error',
                        iconTheme: {
                            primary: 'var(--color-danger)',
                            secondary: 'var(--bg-card)'
                        },
                    },
                }}
            />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<MainLayout/>}>
                        <Route index element={<Navigate to="/home" replace />} />

                        <Route path="home" element={<HomeView />}/>

                        <Route path="characters" element={<CharactersPage />} />
                        <Route path="banners" element={<BannersPage/>} />
                        <Route path="creators" element={<CreatorsPage/>} />
                        
                        <Route path="grandVoyage" element={<CrewsPage mode="grandVoyage" />} />
                        <Route path="garpsChallenge" element={<CrewsPage mode="garpsChallenge" />} />
                        <Route path="forestOfTraining" element={<CrewsPage mode="forestOfTraining" />} />
                        <Route path="coliseum" element={<CrewsPage mode="coliseum" />} />
                        <Route path="pirateKingAdventures" element={<CrewsPage mode="pirateKingAdventures" />} />
                        <Route path="treasureMap" element={<CrewsPage mode="treasureMap" />} />
                        <Route path="kizunaClash" element={<CrewsPage mode="kizunaClash" />} />

                        <Route path="admin" element={<AdminPanel />} />

                        <Route path="*" element={<Navigate to="/home" replace />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </CollectionProvider>
    </QueryClientProvider>
    );

};

export default App;
