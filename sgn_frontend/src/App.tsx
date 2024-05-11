import React, { useState, useEffect } from 'react';
import Api, { setAuthToken } from './app/services/api';  
import Login from './app/Login';
import DepartementList from './Components/Organisms/DepartementList';
import Navbar from './Components/Organisms/Navbar';
import Footer from './Components/Organisms/Footer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import NotFound from './Components/Organisms/NotFound';
import TasksLists from './app/admin/TasksLists';
import GDF_DynamicFormComponent from './app/admin/GDF_DynamicFormComponent';
import GU_DynamicFormComponent from './app/admin/GU_DynamicFormComponent';


const refreshTokenEvery = 30 * 60 * 1000; 

const App: React.FC = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setAuthToken(token);
            setIsAuthenticated(true);
            startTokenRefreshInterval();
        }
    }, []);


    const handleLoginSuccess = (token: string, refreshToken: string) => {
        localStorage.setItem('authToken', token); 
        localStorage.setItem('refreshToken', refreshToken);
        setAuthToken(token);
        setIsAuthenticated(true);
        startTokenRefreshInterval();
    };

    const startTokenRefreshInterval = () => {
        setInterval(() => {
            refreshAuthToken();
        }, refreshTokenEvery);
    };

    const refreshAuthToken = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            console.error("No refresh token available");
            logoutUser();
            return;
        }
    
        try {
            const response = await Api.post('/api/token/refresh/', { refresh: refreshToken });
            if (response.status === 200) {
                const data = await response.data;
                localStorage.setItem('authToken', data.access); 
                localStorage.setItem('refreshToken', data.refresh);
                setAuthToken(data.access); 
            } else {
                throw new Error('Unable to refresh token');
            }
        } catch (error) {
            console.error('Failed to refresh token:', error);
            logoutUser();
        }
    };
    
    const logoutUser = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('refreshToken');
        setIsAuthenticated(false);
        // window.location.href = '/login'; 
    };
    


    return (
      <div className="App">
        <BrowserRouter>
            <header className="App-header">
                <Navbar />
            </header>
                {!isAuthenticated ? (
                    <Login onLoginSuccess={handleLoginSuccess} />
                ) : (
                    <div className='container mt-32'>
                        <Routes>
                                <Route path="/" element={<DepartementList />} />
                                <Route path="/administration" element={<TasksLists />} />
                                <Route path="/administration/depart_et_fil" element={<GDF_DynamicFormComponent />} />
                                <Route path="/administration/utilisateurs" element={<GU_DynamicFormComponent />} />
                                <Route path="*" element={<NotFound />} />
                            </Routes>
                    </div>
                )}
                
                {/* <Footer /> */}
        </BrowserRouter>
  </div>
        
    );
}

export default App;
